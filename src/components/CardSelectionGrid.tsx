'use client';

import { useMemo, useState } from 'react';
import { CardBack } from './TarotCard';

export default function CardSelectionGrid({
  needed,
  poolSize = 18,
  onComplete,
}: {
  needed: number;
  poolSize?: number;
  onComplete: (chosenIndexes: number[]) => void;
}) {
  const pool = useMemo(() => Array.from({ length: poolSize }, (_, i) => i), [poolSize]);
  const [chosen, setChosen] = useState<number[]>([]);

  function handlePick(i: number) {
    if (chosen.includes(i) || chosen.length >= needed) return;
    const next = [...chosen, i];
    setChosen(next);
    if (next.length === needed) {
      // Small delay so the user sees the final card selection animation.
      setTimeout(() => onComplete(next), 400);
    }
  }

  return (
    <div>
      <p className="mb-6 text-center text-sm text-starlight/60">
        {chosen.length} of {needed} cards chosen — trust your instinct
      </p>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-9">
        {pool.map((i) => (
          <CardBack
            key={i}
            index={i}
            chosen={chosen.includes(i)}
            disabled={chosen.length >= needed && !chosen.includes(i)}
            onClick={() => handlePick(i)}
          />
        ))}
      </div>
    </div>
  );
}
