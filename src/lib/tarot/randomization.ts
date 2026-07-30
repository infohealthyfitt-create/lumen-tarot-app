import type { TarotCard, DrawnCard, Orientation } from './types';
import { DECK } from './deck';

/**
 * Cryptographically-strong random integer in [0, max).
 * Works in both the browser (Web Crypto) and Node/serverless (crypto module).
 */
function secureRandomInt(max: number): number {
  const isBrowser = typeof globalThis.crypto?.getRandomValues === 'function';
  if (isBrowser) {
    const arr = new Uint32Array(1);
    globalThis.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  // Node fallback (server components / API routes)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = require('crypto');
  return nodeCrypto.randomInt(0, max);
}

function secureShuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomOrientation(): Orientation {
  return secureRandomInt(100) < 25 ? 'reversed' : 'upright'; // 25% reversed, a common convention
}

/**
 * Draws `count` unique cards from the full deck with secure randomization.
 * Cards never repeat within a single reading.
 */
export function drawCards(count: number, deck: TarotCard[] = DECK): DrawnCard[] {
  const shuffled = secureShuffle(deck);
  return shuffled.slice(0, count).map((card, idx) => ({
    card,
    orientation: randomOrientation(),
    position: idx + 1,
  }));
}

/** Deterministic-per-day draw for the Daily Tarot Card feature. */
export function drawDailyCard(dateKey: string, userSeed = ''): DrawnCard {
  // Simple deterministic hash so the same user gets the same card if the
  // route is re-requested the same day (idempotency), while still varying
  // day to day and user to user.
  const seedStr = `${dateKey}:${userSeed}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  const cardIndex = hash % DECK.length;
  const orientation: Orientation = hash % 4 === 0 ? 'reversed' : 'upright';
  return { card: DECK[cardIndex], orientation, position: 1 };
}
