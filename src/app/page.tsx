import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORY_LABELS, type ReadingCategory } from '@/lib/tarot/types';
import { CATEGORY_ICONS } from '@/data/questions';

export const metadata: Metadata = {
  title: 'Your Cards Have a Message for You',
  description:
    'Ask what\'s on your heart and discover a personalized Tarot-inspired reading. Free daily card, love readings, yes/no tarot, and more.',
  alternates: { canonical: '/' },
};

const CATEGORIES: ReadingCategory[] = ['love', 'relationship', 'ex', 'career', 'money', 'future', 'yes-no', 'general'];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-radial-fade px-4 pb-16 pt-20 text-center sm:pt-28">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold/70">Tarot-inspired guidance</p>
        <h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-starlight sm:text-6xl">
          Your Cards Have a Message for You
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-starlight/70 sm:text-lg">
          Ask what&rsquo;s on your heart and discover a personalized Tarot-inspired reading.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/free-tarot-reading"
            className="w-full rounded-full bg-gradient-to-r from-gold-dim to-gold px-8 py-3.5 text-base font-semibold text-void shadow-glow transition hover:brightness-110 sm:w-auto"
          >
            Start Free Reading
          </Link>
          <Link
            href="/daily-tarot"
            className="glass w-full rounded-full px-8 py-3.5 text-base font-medium text-starlight transition hover:border-gold/40 sm:w-auto"
          >
            Draw Today&rsquo;s Card
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-8 text-center font-display text-2xl text-starlight/90">
          What would you like guidance about?
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/free-tarot-reading?category=${cat}`}
              className="glass group flex flex-col items-center gap-2 rounded-2xl px-4 py-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow active:scale-95"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">{CATEGORY_ICONS[cat]}</span>
              <span className="text-sm font-medium text-starlight/90">{CATEGORY_LABELS[cat]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="glass grid gap-6 rounded-3xl p-8 sm:grid-cols-3">
          {[
            { title: 'Choose your own cards', body: 'No auto-picks — you select every card yourself, at your own pace.' },
            { title: 'Build a daily streak', body: 'Draw one free card a day and watch your reflection streak grow.' },
            { title: 'Save & revisit readings', body: 'Create an account to keep a private history of every reading.' },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="mb-2 font-display text-lg text-gold">{f.title}</h3>
              <p className="text-sm text-starlight/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
