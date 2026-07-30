import deckData from './deck-data.json';
import type { TarotCard } from './types';

// The full 78-card deck. In production this could instead be fetched from
// the `tarot_cards` Supabase table (see supabase/schema.sql) so that an
// admin dashboard can edit meanings without a redeploy. Falling back to the
// bundled JSON keeps the app fully functional with zero external services.
export const DECK: TarotCard[] = deckData as TarotCard[];

export const MAJOR_ARCANA = DECK.filter((c) => c.arcana === 'major');
export const MINOR_ARCANA = DECK.filter((c) => c.arcana === 'minor');

export function getCardBySlug(slug: string): TarotCard | undefined {
  return DECK.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return DECK.map((c) => c.slug);
}

export function relatedCards(card: TarotCard, count = 3): TarotCard[] {
  const pool = card.suit
    ? DECK.filter((c) => c.suit === card.suit && c.id !== card.id)
    : DECK.filter((c) => c.arcana === 'major' && c.id !== card.id);
  return pool.slice(0, count);
}
