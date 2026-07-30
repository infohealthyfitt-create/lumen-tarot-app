'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { track } from '@/lib/analytics';

type Mode = 'login' | 'signup' | 'forgot';

export default function AuthForms() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="glass mx-auto max-w-sm rounded-2xl p-6 text-center text-sm text-starlight/70">
        <p className="mb-2 font-display text-lg text-gold">Accounts coming soon</p>
        <p>
          Sign-in isn&rsquo;t configured for this environment yet. Add your Supabase project keys to{' '}
          <code className="text-gold/80">.env.local</code> to enable accounts, saved readings, and streaks.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.reload();
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
        });
        if (error) throw error;
        track('signup_completed');
        setMessage('Check your email to confirm your account.');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        });
        if (error) throw error;
        setMessage('Password reset link sent — check your email.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
    });
  }

  return (
    <div className="glass mx-auto max-w-sm rounded-2xl p-6">
      <div className="mb-4 flex justify-center gap-4 text-sm">
        {(['login', 'signup', 'forgot'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={m === mode ? 'text-gold' : 'text-starlight/50'}
          >
            {m === 'login' ? 'Log In' : m === 'signup' ? 'Sign Up' : 'Forgot Password'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gold/20 bg-void/50 px-4 py-2.5 text-sm text-starlight placeholder:text-starlight/40 focus:border-gold/50 focus:outline-none"
        />
        {mode !== 'forgot' && (
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gold/20 bg-void/50 px-4 py-2.5 text-sm text-starlight placeholder:text-starlight/40 focus:border-gold/50 focus:outline-none"
          />
        )}
        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-gold-dim to-gold px-6 py-2.5 text-sm font-semibold text-void shadow-glow disabled:opacity-50"
        >
          {mode === 'login' ? 'Log In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
        </button>
      </form>

      <button
        onClick={handleGoogle}
        className="mt-3 w-full rounded-full border border-gold/20 px-6 py-2.5 text-sm text-starlight/80 hover:border-gold/40"
      >
        Continue with Google
      </button>

      {message && <p className="mt-3 text-center text-xs text-starlight/60">{message}</p>}
    </div>
  );
}
