import { siteConfig } from "@/lib/siteConfig";

/**
 * FRONT-END ONLY price estimator.
 *
 * Everything below runs in the browser against the rate table in
 * siteConfig.pricing. There is no pricing API, no server call and no payment
 * processing anywhere in this project — the output is an indicative figure
 * that the operator confirms manually.
 */

const { pricing } = siteConfig;

export type DestinationOption = {
  id: string;
  label: string;
  group: "airport" | "local" | "other";
  price?: number;
};

/** Flattened destination list for the <select>, including the "other" escape hatch. */
export const destinationOptions: DestinationOption[] = [
  ...pricing.fixedRoutes.map((r) => ({ ...r, group: "airport" as const })),
  ...pricing.localRoutes.map((r) => ({ ...r, group: "local" as const })),
  { id: "other", label: "Somewhere else (estimate by distance)", group: "other" as const },
];

export type EstimateInput = {
  destinationId: string;
  /** Only used when destinationId is "other". */
  miles: number;
  vehicleId: string;
  /** "YYYY-MM-DD" from <input type="date">; empty means "not chosen yet". */
  date: string;
  /** "HH:MM" from <input type="time">; empty means "not chosen yet". */
  time: string;
  returnTrip: boolean;
};

export type EstimateLine = {
  label: string;
  amount: number;
  /** Rendered in a muted tone — context rather than a charge. */
  note?: string;
};

export type Estimate = {
  ok: boolean;
  /** Set when the inputs are not yet sufficient to price the job. */
  problem?: string;
  lines: EstimateLine[];
  total: number;
  /** Human-readable summary, reused as the prefilled booking-form note. */
  summary: string;
};

/** 22:00–05:59 pick-ups attract the late-night rate. */
export function isNightPickup(time: string): boolean {
  if (!time) return false;
  const hour = Number(time.slice(0, 2));
  if (Number.isNaN(hour)) return false;
  return hour >= 22 || hour < 6;
}

/** Saturday or Sunday pick-ups attract the weekend rate. */
export function isWeekendPickup(date: string): boolean {
  if (!date) return false;
  // Parse as UTC so the result does not shift with the viewer's timezone.
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  const day = parsed.getUTCDay();
  return day === 0 || day === 6;
}

export function calculateEstimate(input: EstimateInput): Estimate {
  const empty: Estimate = { ok: false, lines: [], total: 0, summary: "" };

  const destination = destinationOptions.find((d) => d.id === input.destinationId);
  if (!destination) {
    return { ...empty, problem: "Choose a destination to see an estimate." };
  }

  const vehicle = pricing.vehicleTypes.find((v) => v.id === input.vehicleId);
  if (!vehicle) {
    return { ...empty, problem: "Choose a vehicle to see an estimate." };
  }

  /* ------------------------------------------------------------ base fare */
  let base: number;
  let baseLabel: string;

  if (destination.group === "other") {
    if (!input.miles || input.miles <= 0) {
      return {
        ...empty,
        problem: "Enter an approximate distance in miles to see an estimate.",
      };
    }
    const byDistance = input.miles * pricing.perMile;
    base = Math.max(byDistance, pricing.minimumFare);
    baseLabel =
      base > byDistance
        ? `Minimum fare (${input.miles} miles)`
        : `${input.miles} miles at ${pricing.currency}${pricing.perMile.toFixed(2)} per mile`;
  } else {
    base = destination.price ?? pricing.minimumFare;
    baseLabel =
      destination.group === "airport"
        ? `Fixed airport rate — ${destination.label}`
        : `Local rate — ${destination.label}`;
  }

  const lines: EstimateLine[] = [{ label: baseLabel, amount: base }];

  /* -------------------------------------------------------------- vehicle */
  const vehicleAdjusted = base * vehicle.multiplier;
  if (vehicle.multiplier !== 1) {
    lines.push({
      label: vehicle.label,
      amount: vehicleAdjusted - base,
      note: `+${Math.round((vehicle.multiplier - 1) * 100)}%`,
    });
  }

  /* ----------------------------------------------------------- surcharges */
  let oneWay = vehicleAdjusted;

  if (isNightPickup(input.time)) {
    const amount = vehicleAdjusted * pricing.surcharges.night.rate;
    oneWay += amount;
    lines.push({
      label: pricing.surcharges.night.label,
      amount,
      note: `+${Math.round(pricing.surcharges.night.rate * 100)}%`,
    });
  }

  if (isWeekendPickup(input.date)) {
    const amount = vehicleAdjusted * pricing.surcharges.weekend.rate;
    oneWay += amount;
    lines.push({
      label: pricing.surcharges.weekend.label,
      amount,
      note: `+${Math.round(pricing.surcharges.weekend.rate * 100)}%`,
    });
  }

  /* ---------------------------------------------------------- return trip */
  let total = oneWay;

  if (input.returnTrip) {
    const returnLeg = oneWay * (1 - pricing.returnDiscount);
    total += returnLeg;
    lines.push({
      label: "Return journey",
      amount: returnLeg,
      note: `${Math.round(pricing.returnDiscount * 100)}% off the return leg`,
    });
  }

  /* ---------------------------------------------------------- booking fee */
  if (pricing.bookingFee > 0) {
    total += pricing.bookingFee;
    lines.push({ label: "Booking fee", amount: pricing.bookingFee });
  }

  const summaryParts = [
    `${destination.group === "other" ? `${input.miles} miles from ${siteConfig.contact.baseTown}` : destination.label}`,
    vehicle.label,
    input.returnTrip ? "return trip" : "one way",
    input.date ? `on ${input.date}` : null,
    input.time ? `at ${input.time}` : null,
  ].filter(Boolean);

  return {
    ok: true,
    lines,
    total,
    summary: summaryParts.join(" · "),
  };
}
