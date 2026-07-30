'use client';

import { useEffect, useState } from 'react';
import { RevealedCard } from '@/components/TarotCard';
import ShareCard from '@/components/ShareCard';
import { track } from '@/lib/analytics';
import type { TarotCard, Orientation } from '@/lib/tarot/types';

const SEED_KEY = 'lumen_tarot_anon_seed';
const STREAK_KEY = 'lumen_tarot_streak';

function getOrCreateSeed(): string {
  let seed = localStorage.getItem(SEED_KEY);
  if (!seed) {
    seed = crypto.randomUUID();
    localStorage.setItem(SEED_KEY, seed);
  }
  return seed;
}

function updateStreak(todayKey: string): number {
  const raw = localStorage.getItem(STREAK_KEY);
  const state = raw ? JSON.parse(raw) : { lastDate: null, count: 0 };
  if (state.lastDate === todayKey) return state.count;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = state.lastDate === yesterday ? state.count + 1 : 1;
  localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: todayKey, count }));
  return count;
}

export default function DailyCardClient() {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [orientation, setOrientation] = useState<Orientation>('upright');
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const seed = getOrCreateSeed();
      const res = await fetch(`/api/daily-card?seed=${seed}`);
      const data = await res.json();
      setCard(data.card);
      setOrientation(data.orientation);
      setStreak(updateStreak(data.date));
      setLoading(false);
      track('daily_card_drawn', { streak: updateStreak(data.date) });
    })();
  }, []);

  if (loading || !card) {
    return <p className="text-sm text-starlight/50">Drawing today&rsquo;s card…</p>;
  }

  const meaning = orientation === 'upright' ? card.general_meaning : card.reversed_meaning;

  return (
    <div>
      <div className="flex justify-center">
        <RevealedCard drawn={{ card, orientation, position: 1 }} />
      </div>

      <div className="glass mt-8 rounded-2xl p-6 text-left">
        <h2 className="mb-2 font-display text-lg text-gold">{card.name}</h2>
        <p className="mb-4 text-sm leading-relaxed text-starlight/80">{meaning}</p>
        <h3 className="mb-1 text-xs uppercase tracking-widest text-gold/70">Today&rsquo;s Focus</h3>
        <p className="mb-4 text-sm text-starlight/70">
          Notice where this energy already shows up in your day, and where it invites a small shift.
        </p>
        <h3 className="mb-1 text-xs uppercase tracking-widest text-gold/70">Journal Prompt</h3>
        <p className="text-sm text-starlight/70">What is this card inviting you to pay attention to today?</p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-starlight/70">
        <span className="text-gold">🔥</span> {streak} Day Tarot Streak
      </div>

      <div className="mt-6 flex justify-center">
        <ShareCard cardName={card.name} reflection={meaning} />
      </div>
      <p className="mt-4 text-xs text-starlight/40">
        Share today&rsquo;s card with someone who needs this message.
      </p>
    </div>
  );
}
