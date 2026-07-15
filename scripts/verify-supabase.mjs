/**
 * Verify Supabase connection. Run: node scripts/verify-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length) process.env[key] = rest.join("=");
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

console.log("Supabase URL:", url);

const supabase = createClient(url, key);

const { error: healthError } = await supabase.auth.getSession();
if (healthError) {
  console.error("Auth check failed:", healthError.message);
} else {
  console.log("Auth API: reachable");
}

const { error: profileError } = await supabase.from("profiles").select("id").limit(1);
if (profileError) {
  console.error("Profiles table:", profileError.message);
  console.log("\nRun supabase/schema.sql in your Supabase SQL Editor.");
} else {
  console.log("Profiles table: OK");
}
