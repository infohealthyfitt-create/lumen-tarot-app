import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DECK, getAllSlugs, getCardBySlug, relatedCards } from '@/lib/tarot/deck';

export function generateStaticParams() {
  return getAllSlugs().map((card) => ({ card }));
}

export function generateMetadata({ params }: { params: { card: string } }): Metadata {
  const card = getCardBySlug(params.card);
  if (!card) return {};
  return {
    title: `${card.name} — Tarot Card Meaning`,
    description: `${card.name} Tarot card meaning: upright, reversed, love, career, and money interpretations, symbolism, and reflection questions.`,
    alternates: { canonical: `/tarot-card-meanings/${card.slug}` },
    openGraph: { title: `${card.name} — Tarot Card Meaning`, url: `/tarot-card-meanings/${card.slug}` },
  };
}

const REFLECTION_QUESTIONS = [
  'Where in your life is this energy already present?',
  'What would it look like to lean into this card\'s invitation this week?',
  'What is one small, concrete action this card might be pointing toward?',
];

export default function CardMeaningPage({ params }: { params: { card: string } }) {
  const card = getCardBySlug(params.card);
  if (!card) notFound();

  const related = relatedCards(card, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-2 text-center text-xs uppercase tracking-widest text-gold/70">
        {card.arcana === 'major' ? 'Major Arcana' : `Minor Arcana — ${card.suit}`}
      </p>
      <h1 className="mb-8 text-center font-display text-4xl text-starlight">{card.name}</h1>

      <div className="glass mb-6 rounded-2xl p-6">
        <h2 className="mb-2 font-display text-lg text-gold">Upright Meaning</h2>
        <p className="mb-4 text-sm leading-relaxed text-starlight/80">{card.upright_meaning}</p>
        <p className="text-xs text-starlight/50">Keywords: {card.upright_keywords.join(', ')}</p>
      </div>

      <div className="glass mb-6 rounded-2xl p-6">
        <h2 className="mb-2 font-display text-lg text-gold">Reversed Meaning</h2>
        <p className="mb-4 text-sm leading-relaxed text-starlight/80">{card.reversed_meaning}</p>
        <p className="text-xs text-starlight/50">Keywords: {card.reversed_keywords.join(', ')}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-1 text-xs uppercase tracking-widest text-gold/70">Love</h3>
          <p className="text-sm text-starlight/70">{card.love_meaning}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-1 text-xs uppercase tracking-widest text-gold/70">Career</h3>
          <p className="text-sm text-starlight/70">{card.career_meaning}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-1 text-xs uppercase tracking-widest text-gold/70">Money</h3>
          <p className="text-sm text-starlight/70">{card.money_meaning}</p>
        </div>
      </div>

      <div className="glass mb-6 rounded-2xl p-6">
        <h2 className="mb-3 font-display text-lg text-gold">Reflection Questions</h2>
        <ul className="space-y-2 text-sm text-starlight/70">
          {REFLECTION_QUESTIONS.map((q) => (
            <li key={q} className="flex gap-2"><span className="text-gold">✦</span>{q}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg text-gold">Related Cards</h2>
        <div className="flex flex-wrap gap-2">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/tarot-card-meanings/${r.slug}`}
              className="glass rounded-full px-4 py-2 text-xs text-starlight/80 hover:border-gold/40 hover:text-gold"
            >
              {r.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href={`/free-tarot-reading?category=general`}
          className="inline-block rounded-full bg-gradient-to-r from-gold-dim to-gold px-8 py-3.5 text-base font-semibold text-void shadow-glow"
        >
          Get Your Own Reading
        </Link>
      </div>
    </div>
  );
}
