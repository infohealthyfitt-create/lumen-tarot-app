import type { Metadata } from 'next';
import DailyCardClient from './DailyCardClient';

export const metadata: Metadata = {
  title: "Daily Tarot — Your Card of the Day",
  description: 'Draw one free Tarot card every day for reflection, a journal prompt, and today\'s focus. Build your daily Tarot streak.',
  alternates: { canonical: '/daily-tarot' },
};

export default function DailyTarotPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="mb-2 font-display text-3xl text-starlight">Your Card of the Day</h1>
      <p className="mb-10 text-sm text-starlight/60">One free card, once every calendar day.</p>
      <DailyCardClient />
    </div>
  );
}
