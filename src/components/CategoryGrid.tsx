'use client';

import { CATEGORY_LABELS, type ReadingCategory } from '@/lib/tarot/types';
import { CATEGORY_ICONS } from '@/data/questions';
import clsx from 'clsx';

const ORDER: ReadingCategory[] = [
  'love', 'relationship', 'ex', 'career', 'money', 'future', 'yes-no', 'general',
];

export default function CategoryGrid({
  onSelect,
  selected,
}: {
  onSelect: (c: ReadingCategory) => void;
  selected?: ReadingCategory | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ORDER.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={clsx(
            'glass group flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center transition-all duration-200',
            'hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow active:scale-95',
            selected === cat && 'border-gold/60 shadow-glow',
          )}
        >
          <span className="text-3xl transition-transform group-hover:scale-110">
            {CATEGORY_ICONS[cat]}
          </span>
          <span className="text-sm font-medium text-starlight/90">{CATEGORY_LABELS[cat]}</span>
        </button>
      ))}
    </div>
  );
}
