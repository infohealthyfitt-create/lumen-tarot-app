import type { DrawnCard, ReadingCategory } from './types';
import { CATEGORY_LABELS, THREE_CARD_POSITIONS } from './types';

export interface ReadingEngine {
  generateCardInterpretation(drawn: DrawnCard, category: ReadingCategory): string;
  generateOverallReading(params: {
    question: string;
    category: ReadingCategory;
    cards: DrawnCard[];
  }): string;
}

const HEDGES = [
  'may suggest',
  'can represent',
  'invites you to consider',
  'could indicate',
  'one interpretation is that',
];

function hedge(i: number): string {
  return HEDGES[i % HEDGES.length];
}

function meaningForCategory(drawn: DrawnCard, category: ReadingCategory): string {
  const { card, orientation } = drawn;
  switch (category) {
    case 'love':
    case 'relationship':
    case 'ex':
      return orientation === 'upright' ? card.love_meaning : card.reversed_meaning;
    case 'career':
      return orientation === 'upright' ? card.career_meaning : card.reversed_meaning;
    case 'money':
      return orientation === 'upright' ? card.money_meaning : card.reversed_meaning;
    default:
      return orientation === 'upright' ? card.general_meaning : card.reversed_meaning;
  }
}

/**
 * Default reading engine. Assembles interpretations entirely from the
 * stored card data — no external API calls, no cost, works offline.
 * This is what powers the app when ENABLE_AI_READINGS=false (the default).
 */
export class TemplateReadingEngine implements ReadingEngine {
  generateCardInterpretation(drawn: DrawnCard, category: ReadingCategory): string {
    const { card, orientation, position } = drawn;
    const positionLabel = THREE_CARD_POSITIONS[position - 1];
    const meaning = meaningForCategory(drawn, category);
    const orientationLabel = orientation === 'reversed' ? ' (reversed)' : '';
    const posPrefix = positionLabel ? `In the "${positionLabel}" position, ` : '';
    return `${posPrefix}${card.name}${orientationLabel} ${hedge(position)} ${meaning.charAt(0).toLowerCase()}${meaning.slice(1)}`;
  }

  generateOverallReading({
    question,
    category,
    cards,
  }: {
    question: string;
    category: ReadingCategory;
    cards: DrawnCard[];
  }): string {
    const categoryLabel = CATEGORY_LABELS[category];
    const cardNames = cards
      .map((d) => `${d.card.name}${d.orientation === 'reversed' ? ' (reversed)' : ''}`)
      .join(', ');

    const intro = question
      ? `Reflecting on your question — "${question}" — through the lens of ${categoryLabel.toLowerCase()}, the cards drawn were ${cardNames}.`
      : `Reflecting on ${categoryLabel.toLowerCase()}, the cards drawn were ${cardNames}.`;

    const threads = cards
      .map((d, i) => {
        const meaning = meaningForCategory(d, category);
        return `${hedge(i + 2).charAt(0).toUpperCase()}${hedge(i + 2).slice(1)} ${meaning.charAt(0).toLowerCase()}${meaning.slice(1)}`;
      })
      .join(' ');

    const closing =
      'Consider this reading as a starting point for your own reflection rather than a fixed prediction — you remain the one who decides what to do next.';

    return `${intro} ${threads} ${closing}`;
  }
}

/**
 * Optional AI-backed engine. Disabled unless ENABLE_AI_READINGS=true.
 * IMPORTANT: the AI must only *interpret* the cards it is given — it must
 * never invent, substitute, or reorder the cards that were already drawn.
 * This class is a thin interface stub; wire it to your AI provider of
 * choice inside generateOverallReading() when you're ready to enable it.
 */
export class AIReadingEngine implements ReadingEngine {
  private fallback = new TemplateReadingEngine();

  generateCardInterpretation(drawn: DrawnCard, category: ReadingCategory): string {
    // Falls back to the template engine for individual card blurbs;
    // AI is reserved for the synthesized "overall reading" where it adds
    // the most value.
    return this.fallback.generateCardInterpretation(drawn, category);
  }

  async generateOverallReadingAsync(params: {
    question: string;
    category: ReadingCategory;
    cards: DrawnCard[];
  }): Promise<string> {
    if (process.env.ENABLE_AI_READINGS !== 'true' || !process.env.AI_API_KEY) {
      return this.fallback.generateOverallReading(params);
    }
    // Example shape only — implement against your chosen provider.
    // The prompt must pass the ALREADY-SELECTED cards as fixed, structured
    // data and instruct the model not to introduce different cards, and to
    // use reflective, non-deterministic language ("may", "can", "invites").
    try {
      const structuredCards = params.cards.map((d) => ({
        name: d.card.name,
        orientation: d.orientation,
        position: d.position,
        keywords:
          d.orientation === 'upright' ? d.card.upright_keywords : d.card.reversed_keywords,
      }));
      const res = await fetch(process.env.AI_API_BASE_URL || 'https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.AI_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content:
                `You are writing a supportive, reflective Tarot-style reading. ` +
                `Use hedged, non-deterministic language ("may suggest", "can represent", "invites you to consider"). ` +
                `Never state a certain future outcome. Do not invent or change the cards below.\n\n` +
                `Question: ${params.question || '(none provided)'}\n` +
                `Category: ${params.category}\n` +
                `Cards (fixed, do not alter): ${JSON.stringify(structuredCards)}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text = data?.content?.find((b: any) => b.type === 'text')?.text;
      return text || this.fallback.generateOverallReading(params);
    } catch {
      return this.fallback.generateOverallReading(params);
    }
  }

  generateOverallReading(params: {
    question: string;
    category: ReadingCategory;
    cards: DrawnCard[];
  }): string {
    // Synchronous interface fallback (used when a sync call site can't await).
    return this.fallback.generateOverallReading(params);
  }
}

export function getReadingEngine(): ReadingEngine {
  return process.env.ENABLE_AI_READINGS === 'true' ? new AIReadingEngine() : new TemplateReadingEngine();
}
