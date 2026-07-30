import type { ReadingCategory } from '@/lib/tarot/types';

export const POPULAR_QUESTIONS: Record<ReadingCategory, string[]> = {
  love: [
    'What are their feelings for me?',
    'Where is this relationship heading?',
    'What should I understand about this connection?',
  ],
  relationship: [
    'What energy surrounds this relationship right now?',
    'What does this relationship need from me?',
    'What should I pay attention to in this partnership?',
  ],
  ex: [
    'What energy surrounds this past relationship?',
    'What should I understand before reconnecting?',
    'What can I learn from this connection?',
  ],
  career: [
    'What should I focus on in my career right now?',
    'Is this the right path for me professionally?',
    'What energy surrounds this opportunity?',
  ],
  money: [
    'What should I understand about my finances right now?',
    'What energy surrounds this financial decision?',
    'What mindset would serve me around money right now?',
  ],
  future: [
    'What energy is approaching in my near future?',
    'What should I prepare for in the months ahead?',
    'What is this next chapter inviting me to consider?',
  ],
  'yes-no': ['Will this work out?', 'Is this the right choice?', 'Should I move forward?'],
  general: [
    'What do I most need to understand right now?',
    'What energy surrounds my life at this moment?',
    'What is asking for my attention?',
  ],
};

export const CATEGORY_ICONS: Record<ReadingCategory, string> = {
  love: '💗',
  relationship: '🤝',
  ex: '🕯️',
  career: '🧭',
  money: '🪙',
  future: '🔮',
  'yes-no': '⚖️',
  general: '✨',
};
