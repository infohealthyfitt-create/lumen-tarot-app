import type { Metadata } from 'next';
import Link from 'next/link';
import { DECK, MAJOR_ARCANA, MINOR_ARCANA } from '@/lib/tarot/deck';

export const metadata: Metadata = {
  title: 'Tarot Card Meanings — All 78 Cards',
  description: 'Explore upright and reversed meanings, love, career, and money interpretations for all 78 Tarot cards — Major and Minor Arcana.',
  alternates: { canonical: '/tarot-card-meanings' },
};

function CardLink({ slug, name }: { slug: string; name: string }) {
  return (
    <Link
      href={`/tarot-card-meanings/${slug}`}
      className="glass rounded-lg px-3 py-3 text-center text-sm text-starlight/80 transition hover:border-gold/40 hover:text-gold"
    >
      {name}
    </Link>
  );
}

export default function TarotCardMeaningsIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-center font-display text-3xl text-starlight">Tarot Card Meanings</h1>
      <p className="mb-10 text-center text-sm text-starlight/60">
        All 78 cards of the Tarot deck, with upright, reversed, love, career, and money meanings.
      </p>

      <div className="mb-4 flex justify-center gap-4 text-sm">
        <Link href="/major-arcana" className="text-gold hover:underline">Major Arcana (22)</Link>
        <Link href="/minor-arcana" className="text-gold hover:underline">Minor Arcana (56)</Link>
      </div>

      <h2 className="mb-4 mt-10 font-display text-xl text-gold">Major Arcana</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MAJOR_ARCANA.map((c) => (
          <CardLink key={c.slug} slug={c.slug} name={c.name} />
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-xl text-gold">Minor Arcana</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MINOR_ARCANA.map((c) => (
          <CardLink key={c.slug} slug={c.slug} name={c.name} />
        ))}
      </div>
    </div>
  );
}
