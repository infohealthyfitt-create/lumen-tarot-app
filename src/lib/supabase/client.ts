'use client';

import { createBrowserClient } from '@supabase/ssr';

// Uses only the public anon key - safe to expose to the browser.
// Row Level Security policies (see supabase/policies.sql) are what actually
// protect user data, not this client's configuration.
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Clean dev fallback: the app must still run without Supabase configured.
    // Callers should check `isSupabaseConfigured()` before relying on auth.
    return null;
  }

  return createBrowserClient(url, anonKey);
}

export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
