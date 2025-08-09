"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
let warnedMissingEnv = false;

export function getSupabase(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  // Warn in development if env is missing to help diagnose empty data issues
  if ((!url || !anon) && !warnedMissingEnv && typeof window !== 'undefined') {
    console.warn(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in web/.env.local. Using fallback client will not work against your database."
    );
    warnedMissingEnv = true;
  }
  // Fallback strings avoid build-time crashes during static prerender.
  browserClient = createClient(url || "http://localhost", anon || "public-anon-key");
  return browserClient;
}


