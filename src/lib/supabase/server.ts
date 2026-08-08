import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/types";

import { getSupabaseEnv } from "./env";

/**
 * Server Supabase client for Server Components, Route Handlers and Server
 * Actions. Reads the session from cookies written by the middleware.
 */
export function createClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The middleware refreshes
          // the session on every request, so this is safe to ignore.
        }
      },
    },
  });
}
