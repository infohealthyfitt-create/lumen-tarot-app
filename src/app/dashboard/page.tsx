import type { Metadata } from 'next';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AuthForms from '@/components/AuthForms';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false }, // private, user-specific page — should not be indexed
};

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="mb-6 text-center font-display text-2xl text-starlight">
          Sign in to view your dashboard
        </h1>
        <AuthForms />
      </div>
    );
  }

  // Reading history / saved readings / payments are read here with the
  // user's own session (RLS-scoped — see supabase/policies.sql), so a user
  // can only ever see their own rows.
  const [{ data: readings }, { data: payments }, { data: streak }] = await Promise.all([
    supabase!.from('readings').select('*').order('created_at', { ascending: false }).limit(10),
    supabase!.from('payments').select('*').eq('status', 'succeeded').order('created_at', { ascending: false }),
    supabase!.from('user_streaks').select('*').eq('user_id', user.id).maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-display text-3xl text-starlight">Your Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-gold/70">Current Streak</p>
          <p className="mt-2 font-display text-3xl text-gold">{streak?.current_streak ?? 0} days</p>
        </div>
        <Link href="/daily-tarot" className="glass rounded-2xl p-6 text-center transition hover:border-gold/40">
          <p className="text-xs uppercase tracking-widest text-gold/70">Today&rsquo;s Card</p>
          <p className="mt-2 text-sm text-starlight/70">Draw or revisit today&rsquo;s card →</p>
        </Link>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-gold/70">Account</p>
          <p className="mt-2 truncate text-sm text-starlight/70">{user.email}</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl text-gold">Reading History</h2>
        {readings && readings.length > 0 ? (
          <div className="space-y-2">
            {readings.map((r: any) => (
              <div key={r.id} className="glass rounded-xl p-4 text-sm">
                <div className="flex justify-between text-starlight/50">
                  <span>{r.category}</span>
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-starlight/80">{r.question || 'No question provided'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-starlight/50">
            No saved readings yet. Complete a{' '}
            <Link href="/free-tarot-reading" className="text-gold hover:underline">
              free reading
            </Link>{' '}
            and choose &ldquo;Save This Reading&rdquo;.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl text-gold">Premium Readings</h2>
        {payments && payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map((p: any) => (
              <div key={p.payment_id} className="glass rounded-xl p-4 text-sm text-starlight/80">
                {p.product_id} — {(p.amount / 100).toFixed(2)} {p.currency?.toUpperCase()}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-starlight/50">
            No premium readings yet. Unlock a deeper spread from any completed free reading.
          </p>
        )}
      </section>
    </div>
  );
}
