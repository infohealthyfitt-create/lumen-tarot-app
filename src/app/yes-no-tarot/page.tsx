import type { Metadata } from 'next';
import YesNoClient from './YesNoClient';

export const metadata: Metadata = {
  title: 'Yes or No Tarot — Ask the Cards',
  description: 'Ask a yes-or-no question, choose one card, and receive a symbolic leaning: yes, leaning yes, unclear, leaning no, or no.',
  alternates: { canonical: '/yes-no-tarot' },
};

export default function YesNoTarotPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-2 text-center font-display text-3xl text-starlight">Ask the Cards — Yes or No?</h1>
      <p className="mb-10 text-center text-sm text-starlight/60">
        Focus on a clear yes-or-no question, then choose one card.
      </p>
      <YesNoClient />
    </div>
  );
}
