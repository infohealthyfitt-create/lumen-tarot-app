import type { Metadata } from 'next';
import Link from 'next/link';
import { MAJOR_ARCANA } from '@/lib/tarot/deck';

export const metadata: Metadata = {
  title: 'Major Arcana — All 22 Cards',
  description: 'The 22 Major Arcana cards of the Tarot deck, from The Fool to The World, with meanings and symbolism.',
  alternates: { canonical: '/major-arcana' },
};

export default function MajorArcanaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-center font-display text-3xl text-starlight">Major Arcana</h1>
      <p className="mb-10 text-center text-sm text-starlight/60">
        The 22 Major Arcana represent life's larger themes and turning points, from The Fool&rsquo;s new beginning to The World&rsquo;s completion.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MAJOR_ARCANA.map((c) => (
          <Link
            key={c.slug}
            href={`/tarot-card-meanings/${c.slug}`}
            className="glass rounded-xl px-4 py-5 text-center text-sm text-starlight/80 transition hover:-translate-y-1 hover:border-gold/40 hover:text-gold"
          >
            <span className="mb-1 block text-xs text-gold/60">{c.number}</span>
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
