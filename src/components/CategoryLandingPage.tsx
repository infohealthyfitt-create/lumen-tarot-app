import Link from 'next/link';
import type { ReadingCategory } from '@/lib/tarot/types';

export default function CategoryLandingPage({
  h1,
  intro,
  category,
  bullets,
}: {
  h1: string;
  intro: string;
  category: ReadingCategory;
  bullets: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-4 text-center font-display text-3xl text-starlight">{h1}</h1>
      <p className="mb-8 text-center text-sm leading-relaxed text-starlight/70">{intro}</p>
      <ul className="glass mb-8 space-y-2 rounded-2xl p-6 text-sm text-starlight/70">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-gold">✦</span> {b}
          </li>
        ))}
      </ul>
      <div className="text-center">
        <Link
          href={`/free-tarot-reading?category=${category}`}
          className="inline-block rounded-full bg-gradient-to-r from-gold-dim to-gold px-8 py-3.5 text-base font-semibold text-void shadow-glow"
        >
          Start Free Reading
        </Link>
      </div>
    </div>
  );
}
