import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
  };
}

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.",
    );
  }

  return createBrowserClient(url, anonKey);
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

export function formatAuthError(error: unknown): string {
  if (error instanceof TypeError && String(error.message).includes("fetch")) {
    return (
      "Cannot reach Supabase. Open your Supabase dashboard → Settings → API, " +
      "copy the exact Project URL into .env.local as NEXT_PUBLIC_SUPABASE_URL, " +
      "then restart npm run dev."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected authentication error.";
}
