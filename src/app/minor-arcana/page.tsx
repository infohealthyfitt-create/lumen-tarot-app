import type { Metadata } from 'next';
import Link from 'next/link';
import { MINOR_ARCANA } from '@/lib/tarot/deck';
import type { Suit } from '@/lib/tarot/types';

export const metadata: Metadata = {
  title: 'Minor Arcana — All 56 Cards',
  description: 'The 56 Minor Arcana cards across Wands, Cups, Swords, and Pentacles, with meanings for everyday situations.',
  alternates: { canonical: '/minor-arcana' },
};

const SUITS: Suit[] = ['Wands', 'Cups', 'Swords', 'Pentacles'];

export default function MinorArcanaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-center font-display text-3xl text-starlight">Minor Arcana</h1>
      <p className="mb-10 text-center text-sm text-starlight/60">
        The 56 Minor Arcana cards reflect the day-to-day textures of life across four suits: Wands, Cups, Swords, and Pentacles.
      </p>
      {SUITS.map((suit) => (
        <div key={suit} className="mb-10">
          <h2 className="mb-4 font-display text-xl text-gold">{suit}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
            {MINOR_ARCANA.filter((c) => c.suit === suit).map((c) => (
              <Link
                key={c.slug}
                href={`/tarot-card-meanings/${c.slug}`}
                className="glass rounded-lg px-3 py-3 text-center text-xs text-starlight/80 transition hover:border-gold/40 hover:text-gold"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
