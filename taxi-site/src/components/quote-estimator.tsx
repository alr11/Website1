"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { calculateEstimate, destinationOptions } from "@/lib/estimate";
import { formatPrice } from "@/lib/utils";
import { Field, Select, TextInput, Toggle } from "@/components/form-fields";
import { ArrowRightIcon, PhoneIcon } from "@/components/icons";

const { pricing } = siteConfig;

/**
 * Client-side price estimator. All arithmetic happens in the browser against
 * the rate table in siteConfig — no network request, no pricing API, no
 * payment step. The result is indicative and is confirmed manually by the
 * operator, as stated in the disclaimer below.
 */
export function QuoteEstimator() {
  const [pickup, setPickup] = useState("");
  const [destinationId, setDestinationId] = useState<string>(pricing.fixedRoutes[0].id);
  const [miles, setMiles] = useState("");
  const [vehicleId, setVehicleId] = useState<string>(pricing.vehicleTypes[0].id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [returnTrip, setReturnTrip] = useState(false);

  const isOther = destinationId === "other";

  const estimate = useMemo(
    () =>
      calculateEstimate({
        destinationId,
        miles: Number(miles) || 0,
        vehicleId,
        date,
        time,
        returnTrip,
      }),
    [destinationId, miles, vehicleId, date, time, returnTrip],
  );

  const selectedVehicle = pricing.vehicleTypes.find((v) => v.id === vehicleId);

  // Carries the choices across to the booking form so nothing is retyped.
  const bookingHref = `/contact?${new URLSearchParams({
    pickup,
    destination: destinationOptions.find((d) => d.id === destinationId)?.label ?? "",
    date,
    time,
    vehicle: selectedVehicle?.label ?? "",
    estimate: estimate.ok ? formatPrice(estimate.total, pricing.currency) : "",
    ret: returnTrip ? "yes" : "no",
  }).toString()}`;

  const airports = destinationOptions.filter((d) => d.group === "airport");
  const locals = destinationOptions.filter((d) => d.group === "local");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      {/* ------------------------------------------------------------ inputs */}
      <form
        className="grid gap-5 sm:grid-cols-2"
        // Nothing is submitted: the estimate updates live as you type.
        onSubmit={(e) => e.preventDefault()}
      >
        <Field
          label="Pick-up location"
          htmlFor="pickup"
          hint="Street or postcode. Used on your booking, not in the price."
          className="sm:col-span-2"
        >
          <TextInput
            id="pickup"
            name="pickup"
            autoComplete="street-address"
            placeholder={`e.g. Old Town, ${siteConfig.contact.baseTown}`}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            aria-describedby="pickup-hint"
          />
        </Field>

        <Field label="Destination" htmlFor="destination" className="sm:col-span-2">
          <Select
            id="destination"
            name="destination"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
          >
            <optgroup label="Airports — fixed price">
              {airports.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Local journeys">
              {locals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Anywhere else">
              <option value="other">Somewhere else (estimate by distance)</option>
            </optgroup>
          </Select>
        </Field>

        {isOther ? (
          <Field
            label="Approximate distance"
            htmlFor="miles"
            required
            hint={`Charged at ${pricing.currency}${pricing.perMile.toFixed(2)} per mile, minimum ${formatPrice(pricing.minimumFare, pricing.currency)}.`}
            className="sm:col-span-2"
          >
            <TextInput
              id="miles"
              name="miles"
              type="number"
              inputMode="numeric"
              min={1}
              max={500}
              step={1}
              placeholder="Miles"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              aria-describedby="miles-hint"
            />
          </Field>
        ) : null}

        <Field label="Vehicle" htmlFor="vehicle" hint={selectedVehicle?.detail} className="sm:col-span-2">
          <Select
            id="vehicle"
            name="vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            aria-describedby="vehicle-hint"
          >
            {pricing.vehicleTypes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Date" htmlFor="date" hint="Weekend pick-ups carry a surcharge.">
          <TextInput
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-describedby="date-hint"
          />
        </Field>

        <Field label="Pick-up time" htmlFor="time" hint="22:00–06:00 carries a night rate.">
          <TextInput
            id="time"
            name="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-describedby="time-hint"
          />
        </Field>

        <div className="sm:col-span-2">
          <Toggle
            id="return-trip"
            label="Add a return journey"
            description={`The return leg is charged at ${100 - pricing.returnDiscount * 100}% of the outbound fare.`}
            checked={returnTrip}
            onChange={setReturnTrip}
          />
        </div>
      </form>

      {/* ------------------------------------------------------------ result */}
      <aside
        aria-live="polite"
        className="h-fit rounded-sm border border-ink-700 bg-ink p-7 text-bone lg:sticky lg:top-28"
      >
        <p className="eyebrow-on-dark">Your estimate</p>

        {estimate.ok ? (
          <>
            <p className="mt-4 font-display text-5xl font-bold text-gold-300">
              {formatPrice(estimate.total, pricing.currency)}
            </p>
            <p className="mt-2 text-sm text-bone/60">{estimate.summary}</p>

            <dl className="mt-7 space-y-3 border-t border-ink-600 pt-6 text-sm">
              {estimate.lines.map((line) => (
                <div key={line.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-bone/75">
                    {line.label}
                    {line.note ? (
                      <span className="ml-1 text-xs text-gold-300/80">({line.note})</span>
                    ) : null}
                  </dt>
                  <dd className="shrink-0 tabular-nums text-bone">
                    {formatPrice(line.amount, pricing.currency)}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 border-t border-ink-600 pt-3 text-base font-semibold">
                <dt className="text-bone">Total estimate</dt>
                <dd className="tabular-nums text-gold-300">
                  {formatPrice(estimate.total, pricing.currency)}
                </dd>
              </div>
            </dl>

            <Link
              href={bookingHref}
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-sm bg-gold-400 px-6 font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-gold-300"
            >
              Book this journey
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <p className="mt-4 text-lg text-bone/70">{estimate.problem}</p>
        )}

        <a
          href={`tel:${siteConfig.contact.phoneHref}`}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-gold-400/50 px-6 text-sm font-semibold text-gold-200 transition-colors hover:bg-gold-400/10"
        >
          <PhoneIcon className="h-4 w-4" />
          Or call {siteConfig.contact.phone}
        </a>

        <p className="mt-6 border-t border-ink-600 pt-5 text-xs leading-relaxed text-bone/55">
          {pricing.disclaimer}
        </p>
      </aside>
    </div>
  );
}
