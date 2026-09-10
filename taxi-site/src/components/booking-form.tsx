"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { Field, Select, TextArea, TextInput } from "@/components/form-fields";
import { Button } from "@/components/button";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export type BookingPrefill = {
  pickup?: string;
  destination?: string;
  date?: string;
  time?: string;
  vehicle?: string;
  estimate?: string;
  ret?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Lead-capture booking form. Posts JSON to /api/contact, which is a stub —
 * see the TODO block in src/app/api/contact/route.ts for wiring it to a real
 * handler (Formspree, Resend, etc.). No payment is taken anywhere.
 */
export function BookingForm({ prefill }: { prefill: BookingPrefill }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Anything carried over from the price estimator seeds the notes field.
  const seededNotes = [
    prefill.vehicle ? `Vehicle: ${prefill.vehicle}` : null,
    prefill.estimate ? `Online estimate: ${prefill.estimate}` : null,
    prefill.ret === "yes" ? "Return journey required." : null,
  ]
    .filter(Boolean)
    .join("\n");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Capture the element up front: React nulls `currentTarget` once the
    // handler yields at the first `await`.
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong. Please call us instead.");
        return;
      }

      setStatus("success");
      setMessage(
        `Thank you — your request has reached us. We will confirm your fixed price by phone or email. For anything urgent, call ${siteConfig.contact.phone}.`,
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage(
        `We could not send that. Please call ${siteConfig.contact.phone} or email ${siteConfig.contact.email}.`,
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-sm border border-gold-400/40 bg-ink-800 p-10 text-center"
      >
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-ink">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-6 font-display text-2xl font-bold text-bone">Request received</h3>
        <p className="mx-auto mt-3 max-w-md text-bone/75">{message}</p>
        <p className="mt-6 text-xs text-gold-300/80">
          Note for the site owner: /api/contact is still a stub, so this enquiry was not
          delivered anywhere.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" htmlFor="name" required>
        <TextInput id="name" name="name" autoComplete="name" required placeholder="Jane Doe" />
      </Field>

      <Field label="Phone" htmlFor="phone" required>
        <TextInput
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="07700 900000"
        />
      </Field>

      <Field label="Email" htmlFor="email" required className="sm:col-span-2">
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Pick-up address" htmlFor="pickup" required>
        <TextInput
          id="pickup"
          name="pickup"
          autoComplete="street-address"
          required
          defaultValue={prefill.pickup}
          placeholder={`Street or postcode, ${siteConfig.contact.baseTown}`}
        />
      </Field>

      <Field label="Destination" htmlFor="destination" required>
        <TextInput
          id="destination"
          name="destination"
          required
          defaultValue={prefill.destination}
          placeholder="Airport, station or address"
        />
      </Field>

      <Field label="Date" htmlFor="booking-date">
        <TextInput id="booking-date" name="date" type="date" defaultValue={prefill.date} />
      </Field>

      <Field label="Pick-up time" htmlFor="booking-time">
        <TextInput id="booking-time" name="time" type="time" defaultValue={prefill.time} />
      </Field>

      <Field label="Passengers" htmlFor="passengers" className="sm:col-span-2">
        <Select id="passengers" name="passengers" defaultValue="1">
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "passenger" : "passengers"}
            </option>
          ))}
          <option value="5+">5 or more — please tell us below</option>
        </Select>
      </Field>

      <Field
        label="Anything else we should know?"
        htmlFor="notes"
        hint="Flight number, luggage, child seats, wait-and-return, multiple stops."
        className="sm:col-span-2"
      >
        <TextArea
          id="notes"
          name="notes"
          defaultValue={seededNotes}
          aria-describedby="notes-hint"
          placeholder="Flight BA123, two large cases, child seat needed."
        />
      </Field>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Sending…" : "Send booking request"}
          {status === "submitting" ? null : <ArrowRightIcon className="h-4 w-4" />}
        </Button>

        <p
          role={status === "error" ? "alert" : undefined}
          aria-live="polite"
          className={
            status === "error"
              ? "mt-4 border-l-2 border-gold-600 pl-3 text-sm font-semibold text-gold-700"
              : "mt-4 text-xs text-ink/60"
          }
        >
          {status === "error"
            ? message
            : "We will never pass your details on. Requests are answered in person, usually within the hour."}
        </p>
      </div>
    </form>
  );
}
