'use client';

import clsx from 'clsx';
import type { DrawnCard } from '@/lib/tarot/types';

export function CardBack({
  index,
  onClick,
  disabled,
  chosen,
}: {
  index: number;
  onClick?: () => void;
  disabled?: boolean;
  chosen?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Choose card ${index + 1}`}
      style={{ animationDelay: `${(index % 7) * 0.15}s` }}
      className={clsx(
        'perspective aspect-[2/3] w-full animate-float rounded-xl transition-transform duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        !disabled && 'hover:-translate-y-2 hover:scale-105 active:scale-95',
        chosen && 'pointer-events-none scale-95 opacity-30',
      )}
    >
      <div
        className={clsx(
          'flex h-full w-full items-center justify-center rounded-xl border shadow-card',
          'border-gold/30 bg-gradient-to-br from-nebula via-amethyst to-nebula',
          !disabled && 'hover:shadow-glow',
        )}
      >
        <div className="flex h-[80%] w-[80%] items-center justify-center rounded-lg border border-gold/20">
          <span className="font-display text-2xl text-gold/70">✦</span>
        </div>
      </div>
    </button>
  );
}

export function RevealedCard({ drawn, positionLabel }: { drawn: DrawnCard; positionLabel?: string }) {
  const { card, orientation } = drawn;
  return (
    <div className="flex flex-col items-center gap-3">
      {positionLabel && (
        <span className="text-xs uppercase tracking-widest text-gold/70">{positionLabel}</span>
      )}
      <div
        className={clsx(
          'flex aspect-[2/3] w-full max-w-[200px] flex-col items-center justify-between rounded-xl border border-gold/30 bg-gradient-to-b from-nebula to-midnight p-4 shadow-card transition-transform duration-500',
          orientation === 'reversed' && 'rotate-180',
        )}
      >
        <div className={clsx('flex flex-1 items-center justify-center', orientation === 'reversed' && 'rotate-180')}>
          <span className="font-display text-4xl text-gold">✧</span>
        </div>
        <div className={clsx('w-full text-center', orientation === 'reversed' && 'rotate-180')}>
          <p className="font-display text-sm text-starlight">{card.name}</p>
        </div>
      </div>
      {orientation === 'reversed' && (
        <span className="text-xs italic text-starlight/50">Reversed</span>
      )}
    </div>
  );
}
