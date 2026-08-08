"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/types";

import { getSupabaseEnv } from "./env";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Browser Supabase client. Memoised so every hook shares one auth session and
 * one realtime connection.
 */
export function createClient() {
  if (client) return client;

  const { url, anonKey } = getSupabaseEnv();
  client = createBrowserClient<Database>(url, anonKey);
  return client;
}
