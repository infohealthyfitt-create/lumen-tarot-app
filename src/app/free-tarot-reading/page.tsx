import type { Metadata } from 'next';
import ReadingFlow from './ReadingFlow';

export const metadata: Metadata = {
  title: 'Free Tarot Reading — Choose Your Cards',
  description:
    'Ask your question, pick a category, and choose three Tarot cards yourself for a free, personalized reading covering your past, present, and possible direction.',
  alternates: { canonical: '/free-tarot-reading' },
  openGraph: { title: 'Free Tarot Reading — Choose Your Cards', url: '/free-tarot-reading' },
};

export default function FreeTarotReadingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ReadingFlow />
    </div>
  );
}
