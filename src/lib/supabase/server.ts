import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-side client that respects the current user's session + RLS.
 * Safe to use in Server Components, Server Actions, and Route Handlers.
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component with no writable cookie store;
          // safe to ignore when middleware handles session refresh.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // see above
        }
      },
    },
  });
}

/**
 * Privileged client using the service role key. ONLY ever import this file
 * from server-only code (API routes / webhooks) — never from a Client
 * Component, and never send this key to the browser. Used for operations
 * like writing verified payment records after a Stripe webhook fires.
 */
export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
