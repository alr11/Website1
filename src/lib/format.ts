import { differenceInCalendarDays, format, isValid, parseISO } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const preciseCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `$12,500` — used for headline numbers where cents are noise. */
export function formatCurrency(value: number | null | undefined) {
  return currencyFormatter.format(value ?? 0);
}

/** `$12,500.00` — used in tables where amounts are compared line by line. */
export function formatCurrencyPrecise(value: number | null | undefined) {
  return preciseCurrencyFormatter.format(value ?? 0);
}

/** Percentage of `total` that `value` represents, clamped to 0 when total is 0. */
export function percentOf(value: number, total: number) {
  if (!total) return 0;
  return (value / total) * 100;
}

/** `Jun 14, 2026` — returns an em dash for missing or unparseable dates. */
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = parseISO(value);
  if (!isValid(date)) return "—";
  return format(date, "MMM d, yyyy");
}

/** Whole days from today until `value`. Negative when the date has passed. */
export function daysUntil(value: string | null | undefined) {
  if (!value) return null;
  const date = parseISO(value);
  if (!isValid(date)) return null;
  return differenceInCalendarDays(date, new Date());
}

/** `in 42 days` / `today` / `9 days ago`. */
export function relativeDayLabel(value: string | null | undefined) {
  const days = daysUntil(value);
  if (days === null) return "No date set";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 0) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
