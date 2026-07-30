import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Love Tarot Reading',
  description:
    'A focused Tarot-inspired reading for matters of the heart: their feelings, relationship energy, past relationships, new love, and guidance.',
  alternates: { canonical: '/love-tarot' },
};

const OPTIONS = [
  { label: 'Their Feelings', q: 'What are their feelings for me?' },
  { label: 'Relationship Energy', q: 'What energy surrounds this relationship right now?' },
  { label: 'Past Relationship', q: 'What energy surrounds this past relationship?' },
  { label: 'New Love', q: 'What should I understand about new love entering my life?' },
  { label: 'Relationship Guidance', q: 'What does this relationship need from me right now?' },
];

export default function LoveTarotPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-center font-display text-3xl text-starlight">Love Tarot Reading</h1>
      <p className="mb-10 text-center text-sm text-starlight/60">
        Choose what you&rsquo;d like guidance on, then select three cards.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <Link
            key={o.label}
            href={`/free-tarot-reading?category=love`}
            className="glass rounded-xl px-5 py-6 text-center text-sm font-medium text-starlight/90 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow"
          >
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
