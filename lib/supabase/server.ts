import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Returns a Supabase client using the anon key, or null if env vars are missing.
 */
export function supabase(): SupabaseClient | null {
    if (!url || !key) {
        console.warn(
            "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        );
        return null;
    }
    return createClient(url, key);
}
