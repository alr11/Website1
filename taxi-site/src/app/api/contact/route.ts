import { NextResponse } from "next/server";

/**
 * ============================================================================
 * PLACEHOLDER BOOKING ENDPOINT — NOT WIRED UP.
 * ============================================================================
 * This route validates the submission and returns success, but it does not
 * deliver the enquiry anywhere. Nothing is stored, emailed or forwarded.
 *
 * TODO(owner): wire this up to a real handler before going live. Two options
 * that need no backend of your own:
 *
 *   1. Formspree — https://formspree.io
 *      Create a form, then replace the body of POST() with:
 *        return NextResponse.json(await (await fetch(
 *          `https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`,
 *          { method: "POST", headers: { "Content-Type": "application/json" },
 *            body: JSON.stringify(payload) },
 *        )).json());
 *
 *   2. Resend — https://resend.com
 *      `npm i resend`, set RESEND_API_KEY, then:
 *        await new Resend(process.env.RESEND_API_KEY).emails.send({
 *          from: "bookings@yourdomain.co.uk",
 *          to: siteConfig.contact.email,
 *          subject: `Booking enquiry — ${payload.name}`,
 *          text: JSON.stringify(payload, null, 2),
 *        });
 *
 * Both are paid-tier-optional third-party services, so neither has been
 * installed or configured here. Add the API key to .env.local, never to git.
 *
 * Before going live you should also add: a spam guard (honeypot or Turnstile),
 * a rate limit, and server-side logging of failures.
 * ============================================================================
 */

/** Fields the booking form sends. Mirrors BookingForm's state. */
type BookingPayload = {
  name: string;
  phone: string;
  email: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  notes: string;
};

const REQUIRED_FIELDS: (keyof BookingPayload)[] = [
  "name",
  "phone",
  "email",
  "pickup",
  "destination",
];

export async function POST(request: Request) {
  let payload: Partial<BookingPayload>;

  try {
    payload = (await request.json()) as Partial<BookingPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter((field) => !payload[field]?.toString().trim());

  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required field(s): ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email!.trim())) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look right." },
      { status: 400 },
    );
  }

  // TODO(owner): replace this log with a real delivery call (see header).
  // Deliberately does not log the payload — it contains personal data.
  console.info("[contact] booking enquiry received (not delivered — endpoint is a stub)");

  return NextResponse.json({
    ok: true,
    delivered: false,
    message:
      "Enquiry received by the placeholder endpoint. Wire up /api/contact to deliver it.",
  });
}
