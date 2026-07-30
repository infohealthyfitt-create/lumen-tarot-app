export type Arcana = 'major' | 'minor';
export type Suit = 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
export type Orientation = 'upright' | 'reversed';
export type YesNoTendency = 'yes' | 'leaning yes' | 'unclear' | 'leaning no' | 'no';

export interface TarotCard {
  id: number;
  name: string;
  slug: string;
  arcana: Arcana;
  number: number;
  suit: Suit | null;
  upright_keywords: string[];
  reversed_keywords: string[];
  upright_meaning: string;
  reversed_meaning: string;
  love_meaning: string;
  career_meaning: string;
  money_meaning: string;
  general_meaning: string;
  yes_no_tendency: YesNoTendency;
  image_url: string;
}

export interface DrawnCard {
  card: TarotCard;
  orientation: Orientation;
  position: number; // 1-indexed position within the spread
}

export type ReadingCategory =
  | 'love'
  | 'relationship'
  | 'ex'
  | 'career'
  | 'money'
  | 'future'
  | 'yes-no'
  | 'general';

export const CATEGORY_LABELS: Record<ReadingCategory, string> = {
  love: 'Love',
  relationship: 'Relationship',
  ex: 'Ex',
  career: 'Career',
  money: 'Money',
  future: 'Future',
  'yes-no': 'Yes or No',
  general: 'General Guidance',
};

export type SpreadPosition = 'Past / Foundation' | 'Present Energy' | 'Possible Direction';

export const THREE_CARD_POSITIONS: SpreadPosition[] = [
  'Past / Foundation',
  'Present Energy',
  'Possible Direction',
];

export interface Reading {
  id: string;
  category: ReadingCategory;
  question: string;
  cards: DrawnCard[];
  overallReading: string;
  createdAt: string;
}
