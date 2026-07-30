'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CategoryGrid from '@/components/CategoryGrid';
import CardSelectionGrid from '@/components/CardSelectionGrid';
import { RevealedCard } from '@/components/TarotCard';
import { POPULAR_QUESTIONS } from '@/data/questions';
import { CATEGORY_LABELS, THREE_CARD_POSITIONS, type DrawnCard, type ReadingCategory } from '@/lib/tarot/types';
import { drawCards } from '@/lib/tarot/randomization';
import { track } from '@/lib/analytics';
import { mentionsSeriousTopic, SERIOUS_TOPIC_NOTICE } from '@/data/safety-copy';
import PremiumUpsell from '@/components/PremiumUpsell';
import ShareCard from '@/components/ShareCard';

type Step = 'category' | 'question' | 'focus' | 'select' | 'reveal';

export default function ReadingFlow() {
  const params = useSearchParams();
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<ReadingCategory | null>(null);
  const [question, setQuestion] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [overallReading, setOverallReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pre = params.get('category') as ReadingCategory | null;
    if (pre && POPULAR_QUESTIONS[pre]) {
      setCategory(pre);
      setStep('question');
      track('category_selected', { category: pre });
    } else {
      track('start_reading');
    }
  }, [params]);

  function chooseCategory(c: ReadingCategory) {
    setCategory(c);
    setStep('question');
    track('category_selected', { category: c });
  }

  function submitQuestion() {
    track('question_submitted', { category: category || undefined, length: question.length });
    setStep('focus');
  }

  function beginSelection() {
    setStep('select');
  }

  async function onSelectionComplete() {
    const cards = drawCards(3).map((d, i) => ({ ...d, position: i + 1 }));
    setDrawn(cards);
    setStep('reveal');
    track('card_selected', { category: category || undefined, count: 3 });

    setLoading(true);
    try {
      const res = await fetch('/api/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          question,
          cards: cards.map((c) => ({ cardId: c.card.id, orientation: c.orientation, position: c.position })),
        }),
      });
      const data = await res.json();
      setOverallReading(data.overallReading);
      track('reading_completed', { category: category || undefined });
    } catch {
      setOverallReading(
        'We had trouble generating your full reading just now, but your cards above still hold their meaning — take a moment to reflect on what they bring up for you.',
      );
    } finally {
      setLoading(false);
    }
  }

  function revealNext() {
    setRevealedCount((c) => Math.min(c + 1, drawn.length));
  }

  const showSeriousNotice = useMemo(() => mentionsSeriousTopic(question), [question]);

  return (
    <div>
      {step === 'category' && (
        <div>
          <h1 className="mb-2 text-center font-display text-3xl text-starlight">
            What would you like guidance about?
          </h1>
          <p className="mb-8 text-center text-sm text-starlight/60">Choose the area that feels most relevant right now.</p>
          <CategoryGrid onSelect={chooseCategory} selected={category} />
        </div>
      )}

      {step === 'question' && category && (
        <div>
          <h1 className="mb-2 text-center font-display text-2xl text-starlight">
            {CATEGORY_LABELS[category]} — choose a question
          </h1>
          {!customMode ? (
            <div className="mt-6 space-y-3">
              {POPULAR_QUESTIONS[category].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className={`glass w-full rounded-xl px-4 py-4 text-left text-sm transition hover:border-gold/40 ${
                    question === q ? 'border-gold/60' : ''
                  }`}
                >
                  {q}
                </button>
              ))}
              <button
                onClick={() => setCustomMode(true)}
                className="w-full rounded-xl border border-dashed border-gold/30 px-4 py-4 text-center text-sm text-gold/80 transition hover:border-gold"
              >
                Ask Your Own Question
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <textarea
                maxLength={300}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What's on your mind?"
                className="glass h-32 w-full rounded-xl px-4 py-3 text-sm text-starlight placeholder:text-starlight/40 focus:border-gold/50 focus:outline-none"
              />
              <p className="mt-1 text-right text-xs text-starlight/40">{question.length}/300</p>
            </div>
          )}

          {showSeriousNotice && question && (
            <p className="mt-4 rounded-xl border border-gold/20 bg-nebula/40 p-4 text-xs leading-relaxed text-starlight/70">
              {SERIOUS_TOPIC_NOTICE}
            </p>
          )}

          <button
            disabled={!question}
            onClick={submitQuestion}
            className="mt-8 w-full rounded-full bg-gradient-to-r from-gold-dim to-gold px-8 py-3.5 text-base font-semibold text-void shadow-glow transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === 'focus' && (
        <div className="flex flex-col items-center gap-8 py-16 text-center">
          <span className="animate-twinkle text-5xl">✦</span>
          <h1 className="font-display text-2xl text-starlight">Take a moment to focus on your question.</h1>
          <p className="max-w-sm text-sm text-starlight/60">
            When you&rsquo;re ready, choose three cards. Trust whichever ones draw your attention.
          </p>
          <button
            onClick={beginSelection}
            className="rounded-full bg-gradient-to-r from-gold-dim to-gold px-8 py-3.5 text-base font-semibold text-void shadow-glow"
          >
            Choose 3 Cards
          </button>
        </div>
      )}

      {step === 'select' && <CardSelectionGrid needed={3} onComplete={onSelectionComplete} />}

      {step === 'reveal' && (
        <div>
          <div className="grid grid-cols-3 gap-4">
            {drawn.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                {i < revealedCount ? (
                  <RevealedCard drawn={d} positionLabel={THREE_CARD_POSITIONS[i]} />
                ) : (
                  <button
                    onClick={revealNext}
                    className="glass flex aspect-[2/3] w-full max-w-[200px] items-center justify-center rounded-xl border border-gold/30 text-xs text-gold/70"
                  >
                    Tap to reveal
                  </button>
                )}
              </div>
            ))}
          </div>

          {revealedCount === drawn.length && (
            <div className="mt-10 space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="mb-3 font-display text-xl text-gold">Your Reading</h2>
                {loading ? (
                  <p className="text-sm text-starlight/50">Weaving your interpretation…</p>
                ) : (
                  <p className="text-sm leading-relaxed text-starlight/80">{overallReading}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="glass flex-1 rounded-full px-6 py-3 text-sm font-medium text-starlight hover:border-gold/40">
                  Save This Reading
                </button>
                <ShareCard cardName={drawn[0]?.card.name} reflection={overallReading || undefined} />
              </div>

              {!loading && overallReading && category && <PremiumUpsell category={category} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
