import { createClient } from "@supabase/supabase-js";

/** Server-side Supabase client (service role — bypasses RLS, only use in API routes) */
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/** Browser-safe Supabase client (anon key — subject to RLS) */
export function createBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
