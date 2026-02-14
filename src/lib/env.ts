// src/lib/env.ts
export const env = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    DEMO_MODE: (process.env.NEXT_PUBLIC_DEMO_MODE ?? "false") === "true",
  } as const;
  
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    // Throwing here is good for CI/Vercel; it makes misconfig obvious.
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }