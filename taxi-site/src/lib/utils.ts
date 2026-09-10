/** Tiny className joiner — avoids pulling in clsx for a five-line helper. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Formats a number as a whole-pound price, e.g. 110 -> "£110", 12.5 -> "£12.50". */
export function formatPrice(value: number, currency = "£"): string {
  const rounded = Math.round(value * 100) / 100;
  const isWhole = Number.isInteger(rounded);
  return `${currency}${rounded.toFixed(isWhole ? 0 : 2)}`;
}
