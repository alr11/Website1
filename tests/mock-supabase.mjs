/**
 * A tiny in-memory stand-in for the parts of Supabase this app uses: the
 * GoTrue endpoints behind `supabase.auth` and the PostgREST endpoints behind
 * `supabase.from(...)`.
 *
 * It exists so `npm test` runs anywhere without a Supabase project or any
 * credentials. The app itself is untouched — it just points at this server
 * through NEXT_PUBLIC_SUPABASE_URL, so the real middleware, the real
 * @supabase/ssr cookie flow and the real React Query layer are all exercised.
 *
 * Row-level security is emulated the only way that matters for these tests:
 * every request is scoped to the user id in the bearer token.
 */
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 54321);

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

/** email -> { id, email, password } */
const users = new Map();
/** access token -> user id */
const tokens = new Map();
/** refresh token -> user id */
const refreshTokens = new Map();

const db = {
  wedding_settings: [],
  guests: [],
  budget_categories: [],
  expenses: [],
  vendors: [],
  timeline_tasks: [],
};

/** Mirrors the column defaults in supabase/migrations/0001_init.sql. */
const COLUMN_DEFAULTS = {
  wedding_settings: {
    partner_one_name: "Partner 1",
    partner_two_name: "Partner 2",
    wedding_date: null,
    venue_name: null,
    total_budget: 0,
  },
  guests: {
    last_name: "",
    email: null,
    phone: null,
    rsvp_status: "pending",
    party_size: 1,
    side: "both",
    role: "Guest",
    table_number: null,
    dietary_notes: null,
    notes: null,
  },
  budget_categories: { allocated: 0, sort_order: 0 },
  expenses: {
    category_id: null,
    vendor_id: null,
    amount: 0,
    paid: false,
    due_date: null,
  },
  vendors: {
    vendor_type: "Other",
    contact_name: null,
    email: null,
    phone: null,
    website: null,
    estimated_cost: 0,
    deposit_paid: 0,
    status: "researching",
    notes: null,
  },
  timeline_tasks: {
    notes: null,
    due_date: null,
    completed: false,
    completed_at: null,
    sort_order: 0,
  },
};

/** wedding_settings is keyed by user_id; everything else by id. */
const PRIMARY_KEY = {
  wedding_settings: "user_id",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const base64url = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

/**
 * An unsigned but structurally valid JWT. supabase-js only decodes it; the
 * mock is the authority on whether a token is valid.
 */
function issueToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url({ alg: "HS256", typ: "JWT" });
  const payload = base64url({
    sub: user.id,
    email: user.email,
    aud: "authenticated",
    role: "authenticated",
    iat: now,
    exp: now + 3600,
  });
  return `${header}.${payload}.mock-signature`;
}

function userPayload(user) {
  const now = new Date().toISOString();
  return {
    id: user.id,
    aud: "authenticated",
    role: "authenticated",
    email: user.email,
    email_confirmed_at: now,
    phone: "",
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {},
    identities: [],
    created_at: now,
    updated_at: now,
    is_anonymous: false,
  };
}

function createSession(user) {
  const access_token = issueToken(user);
  const refresh_token = randomUUID();
  tokens.set(access_token, user.id);
  refreshTokens.set(refresh_token, user.id);

  return {
    access_token,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token,
    user: userPayload(user),
  };
}

function userIdFrom(req) {
  const header = req.headers.authorization ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  return tokens.get(token) ?? null;
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) return resolve(null);
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
  });
}

function send(res, status, body, extraHeaders = {}) {
  const payload = body === null ? "" : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-expose-headers": "content-range",
    "content-range": "*/*",
    ...extraHeaders,
  });
  res.end(payload);
}

function authError(res, status, message) {
  send(res, status, { error: "invalid_grant", error_description: message, message });
}

/* -------------------------------------------------------------------------- */
/* PostgREST emulation                                                        */
/* -------------------------------------------------------------------------- */

const RESERVED_PARAMS = new Set(["select", "order", "columns", "on_conflict", "limit", "offset"]);

/** Applies `col=eq.value` style filters. Only the operators this app uses. */
function applyFilters(rows, params) {
  let result = rows;

  for (const [key, raw] of params.entries()) {
    if (RESERVED_PARAMS.has(key)) continue;
    const [operator, ...rest] = raw.split(".");
    const value = rest.join(".");
    if (operator !== "eq") continue;

    result = result.filter((row) => {
      const current = row[key];
      if (value === "null") return current === null;
      if (current === null || current === undefined) return false;
      return String(current) === value;
    });
  }

  return result;
}

function applyOrder(rows, params) {
  const clauses = params.getAll("order");
  if (clauses.length === 0) return rows;

  return [...rows].sort((a, b) => {
    for (const clause of clauses) {
      const [column, direction = "asc"] = clause.split(".");
      const left = a[column];
      const right = b[column];
      if (left === right) continue;
      if (left === null || left === undefined) return 1;
      if (right === null || right === undefined) return -1;
      const comparison = left > right ? 1 : -1;
      return direction.startsWith("desc") ? -comparison : comparison;
    }
    return 0;
  });
}

/** `.single()` / `.maybeSingle()` set this Accept header. */
function wantsObject(req) {
  return (req.headers.accept ?? "").includes("vnd.pgrst.object+json");
}

function respondWithRows(req, res, rows, status = 200) {
  if (!wantsObject(req)) return send(res, status, rows);

  if (rows.length === 0) {
    return send(res, 406, {
      code: "PGRST116",
      details: "The result contains 0 rows",
      hint: null,
      message: "JSON object requested, multiple (or no) rows returned",
    });
  }

  return send(res, status, rows[0]);
}

function withDefaults(table, row, userId) {
  const key = PRIMARY_KEY[table] ?? "id";
  const base = {
    ...COLUMN_DEFAULTS[table],
    created_at: new Date().toISOString(),
    ...row,
    user_id: userId,
  };
  if (key === "id" && !base.id) base.id = randomUUID();
  return base;
}

async function handleRest(req, res, url, table) {
  const userId = userIdFrom(req);
  if (!userId) {
    return send(res, 401, { code: "401", message: "Invalid authentication credentials" });
  }
  if (!(table in db)) {
    return send(res, 404, { code: "42P01", message: `relation "${table}" does not exist` });
  }

  const params = url.searchParams;
  const owned = db[table].filter((row) => row.user_id === userId);
  const prefer = req.headers.prefer ?? "";

  if (req.method === "GET") {
    return respondWithRows(req, res, applyOrder(applyFilters(owned, params), params));
  }

  if (req.method === "POST") {
    const body = await readBody(req);
    const incoming = Array.isArray(body) ? body : [body];
    const key = PRIMARY_KEY[table] ?? "id";
    const upsert = prefer.includes("merge-duplicates");
    const written = [];

    for (const item of incoming) {
      const prepared = withDefaults(table, item, userId);
      const existing = upsert
        ? db[table].find(
            (row) => row.user_id === userId && row[key] === prepared[key],
          )
        : undefined;

      if (existing) {
        Object.assign(existing, item, { updated_at: new Date().toISOString() });
        written.push(existing);
      } else {
        db[table].push(prepared);
        written.push(prepared);
      }
    }

    return respondWithRows(req, res, written, 201);
  }

  if (req.method === "PATCH") {
    const body = await readBody(req);
    const targets = applyFilters(owned, params);
    targets.forEach((row) => Object.assign(row, body));
    return respondWithRows(req, res, targets);
  }

  if (req.method === "DELETE") {
    const targets = applyFilters(owned, params);
    db[table] = db[table].filter((row) => !targets.includes(row));
    return respondWithRows(req, res, targets, 200);
  }

  return send(res, 405, { message: "Method not allowed" });
}

/* -------------------------------------------------------------------------- */
/* GoTrue emulation                                                           */
/* -------------------------------------------------------------------------- */

async function handleAuth(req, res, url) {
  const route = url.pathname.replace("/auth/v1", "");

  if (route === "/signup" && req.method === "POST") {
    const body = (await readBody(req)) ?? {};
    const email = String(body.email ?? "").toLowerCase();
    const password = String(body.password ?? "");

    if (!email || password.length < 6) {
      return authError(res, 400, "Password should be at least 6 characters.");
    }
    if (users.has(email)) {
      return authError(res, 400, "User already registered");
    }

    const user = { id: randomUUID(), email, password };
    users.set(email, user);
    return send(res, 200, createSession(user));
  }

  if (route === "/token" && req.method === "POST") {
    const grantType = url.searchParams.get("grant_type");
    const body = (await readBody(req)) ?? {};

    if (grantType === "refresh_token") {
      const userId = refreshTokens.get(body.refresh_token);
      const user = [...users.values()].find((candidate) => candidate.id === userId);
      if (!user) return authError(res, 400, "Invalid Refresh Token");
      return send(res, 200, createSession(user));
    }

    const user = users.get(String(body.email ?? "").toLowerCase());
    if (!user || user.password !== body.password) {
      return authError(res, 400, "Invalid login credentials");
    }
    return send(res, 200, createSession(user));
  }

  if (route === "/user" && req.method === "GET") {
    const userId = userIdFrom(req);
    const user = [...users.values()].find((candidate) => candidate.id === userId);
    if (!user) return authError(res, 401, "invalid claim: missing sub claim");
    return send(res, 200, userPayload(user));
  }

  if (route === "/logout" && req.method === "POST") {
    const header = req.headers.authorization ?? "";
    tokens.delete(header.replace(/^Bearer\s+/i, ""));
    res.writeHead(204, { "access-control-allow-origin": "*" });
    return res.end();
  }

  return send(res, 404, { message: `Unhandled auth route: ${route}` });
}

/* -------------------------------------------------------------------------- */
/* Server                                                                     */
/* -------------------------------------------------------------------------- */

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
      // Echo whatever was asked for. supabase-js adds headers over time
      // (x-supabase-api-version, x-client-info, …) and the browser blocks the
      // whole request if even one of them is missing from this list.
      "access-control-allow-headers":
        req.headers["access-control-request-headers"] ??
        "authorization,apikey,content-type,prefer,accept,x-client-info",
      "access-control-max-age": "86400",
    });
    return res.end();
  }

  // Lets the test suite start each spec from a clean database.
  if (url.pathname === "/__reset" && req.method === "POST") {
    users.clear();
    tokens.clear();
    refreshTokens.clear();
    Object.keys(db).forEach((table) => {
      db[table] = [];
    });
    return send(res, 200, { ok: true });
  }

  if (url.pathname === "/__health") return send(res, 200, { ok: true });

  if (url.pathname.startsWith("/auth/v1")) return handleAuth(req, res, url);

  if (url.pathname.startsWith("/rest/v1/")) {
    const table = url.pathname.replace("/rest/v1/", "").split("?")[0];
    return handleRest(req, res, url, table);
  }

  return send(res, 404, { message: `Unhandled route: ${url.pathname}` });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock supabase listening on http://127.0.0.1:${PORT}`);
});
