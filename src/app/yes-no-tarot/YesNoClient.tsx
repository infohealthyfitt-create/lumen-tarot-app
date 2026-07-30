'use client';

import { useState } from 'react';
import CardSelectionGrid from '@/components/CardSelectionGrid';
import { RevealedCard } from '@/components/TarotCard';
import { drawCards } from '@/lib/tarot/randomization';
import type { DrawnCard, YesNoTendency } from '@/lib/tarot/types';
import { track } from '@/lib/analytics';
import clsx from 'clsx';

const ANSWER_STYLES: Record<YesNoTendency, string> = {
  yes: 'text-green-400',
  'leaning yes': 'text-green-300',
  unclear: 'text-gold',
  'leaning no': 'text-orange-300',
  no: 'text-red-400',
};

const ANSWER_LABELS: Record<YesNoTendency, string> = {
  yes: 'YES',
  'leaning yes': 'LEANING YES',
  unclear: 'UNCLEAR',
  'leaning no': 'LEANING NO',
  no: 'NO',
};

export default function YesNoClient() {
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState<'question' | 'select' | 'result'>('question');
  const [drawn, setDrawn] = useState<DrawnCard | null>(null);

  function onSelect() {
    const [card] = drawCards(1);
    setDrawn(card);
    setPhase('result');
    track('reading_completed', { category: 'yes-no' });
  }

  return (
    <div>
      {phase === 'question' && (
        <div>
          <textarea
            maxLength={300}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will... / Should I... / Is this..."
            className="glass h-28 w-full rounded-xl px-4 py-3 text-sm text-starlight placeholder:text-starlight/40 focus:border-gold/50 focus:outline-none"
          />
          <button
            disabled={!question}
            onClick={() => {
              track('question_submitted', { category: 'yes-no' });
              setPhase('select');
            }}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-gold-dim to-gold px-8 py-3.5 text-base font-semibold text-void shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            Choose Your Card
          </button>
        </div>
      )}

      {phase === 'select' && <CardSelectionGrid needed={1} onComplete={onSelect} />}

      {phase === 'result' && drawn && (
        <div className="flex flex-col items-center gap-6 text-center">
          <RevealedCard drawn={drawn} />
          <p
            className={clsx(
              'font-display text-3xl tracking-wide',
              ANSWER_STYLES[drawn.card.yes_no_tendency],
            )}
          >
            {ANSWER_LABELS[drawn.card.yes_no_tendency]}
          </p>
          <div className="glass max-w-md rounded-2xl p-6 text-left">
            <p className="text-sm leading-relaxed text-starlight/80">
              {drawn.card.name}
              {drawn.orientation === 'reversed' ? ' (reversed)' : ''} {`can represent`}{' '}
              {(drawn.orientation === 'upright' ? drawn.card.general_meaning : drawn.card.reversed_meaning)
                .charAt(0)
                .toLowerCase()}
              {(drawn.orientation === 'upright' ? drawn.card.general_meaning : drawn.card.reversed_meaning).slice(1)}
            </p>
            <p className="mt-3 text-xs italic text-starlight/40">
              Consider this a symbolic reflection rather than a guaranteed outcome.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
