import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Turns a Supabase `{ data, error }` pair into a value or a thrown Error, so
 * React Query can put the failure into `isError` instead of silently
 * returning null.
 */
export function unwrap<T>(result: {
  data: T | null;
  error: PostgrestError | null;
}): T {
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.data === null) {
    throw new Error("No data returned from Supabase.");
  }
  return result.data;
}

/** Same as `unwrap`, but a missing row is a legitimate `null` result. */
export function unwrapMaybe<T>(result: {
  data: T | null;
  error: PostgrestError | null;
}): T | null {
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data;
}

export function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
