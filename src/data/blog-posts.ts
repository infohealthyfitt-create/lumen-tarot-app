export interface BlogPost {
  slug: string;
  title: string;
  category: 'Tarot Basics' | 'Love & Relationships' | 'Card Meanings' | 'Self Reflection' | 'Tarot Spreads';
  excerpt: string;
  body: string[]; // paragraphs
  publishedAt: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-read-tarot-cards-for-beginners',
    title: 'How to Read Tarot Cards: A Beginner\u2019s Guide',
    category: 'Tarot Basics',
    excerpt: 'New to Tarot? Here\u2019s a simple, judgment-free starting point for understanding what the cards can offer.',
    body: [
      'Tarot is often misunderstood as fortune-telling, but at its core it\u2019s a tool for reflection. Each card carries a set of themes and imagery that can prompt you to think about your situation from a new angle.',
      'A simple way to begin is with a single-card daily draw. Pull one card, read its meaning, and ask yourself how it relates to your day. Over time you\u2019ll build an intuitive sense of how the cards speak to you.',
      'As you get more comfortable, three-card spreads (past, present, possible direction) are a natural next step, offering a bit more narrative structure without becoming overwhelming.',
      'Remember: a Tarot reading is one perspective among many, not a fixed prediction. The goal is insight, not certainty.',
    ],
    publishedAt: '2026-01-15',
  },
  {
    slug: 'understanding-reversed-tarot-cards',
    title: 'Understanding Reversed Tarot Cards',
    category: 'Tarot Basics',
    excerpt: 'What does it actually mean when a card shows up upside down? Here\u2019s a grounded explanation.',
    body: [
      'When a Tarot card is drawn reversed, many readers interpret it as a variation on the card\u2019s upright meaning — sometimes a blocked, delayed, or internalized version of that energy.',
      'Reversed cards aren\u2019t inherently "bad." A reversed Sun, for example, might simply suggest a temporary dip in optimism rather than a lasting negative outcome.',
      'If reversed meanings feel confusing at first, it\u2019s completely fine to read every card upright while you\u2019re building your foundation — you can layer in reversals later.',
    ],
    publishedAt: '2026-01-22',
  },
  {
    slug: 'love-tarot-what-to-ask',
    title: 'Love Tarot: What to Ask (and What Not To)',
    category: 'Love & Relationships',
    excerpt: 'Getting a meaningful love reading often comes down to asking the right kind of question.',
    body: [
      'Open, reflective questions tend to produce more useful readings than closed, outcome-focused ones. "What should I understand about this connection?" invites more insight than "Will they marry me?"',
      'It also helps to focus questions on your own perspective and choices rather than trying to read someone else\u2019s mind — Tarot works best as a mirror for your own situation.',
      'Whatever the cards suggest, remember that you\u2019re always the one who decides what to do with that reflection.',
    ],
    publishedAt: '2026-02-03',
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
