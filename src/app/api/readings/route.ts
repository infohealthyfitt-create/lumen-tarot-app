import { NextRequest, NextResponse } from 'next/server';
import { getReadingEngine } from '@/lib/tarot/engine';
import { DECK } from '@/lib/tarot/deck';
import type { DrawnCard, ReadingCategory, Orientation } from '@/lib/tarot/types';

export const runtime = 'nodejs';

interface RequestBody {
  category: ReadingCategory;
  question: string;
  cards: { cardId: number; orientation: Orientation; position: number }[];
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    if (!body?.category || !Array.isArray(body.cards) || body.cards.length === 0) {
      return NextResponse.json({ error: 'Invalid reading request.' }, { status: 400 });
    }

    // Re-hydrate full card objects server-side from the trusted deck data —
    // the client only sends card IDs/orientation/position, never full card
    // content, so the interpretation always reflects real stored meanings.
    const drawn: DrawnCard[] = body.cards
      .map((c) => {
        const card = DECK.find((d) => d.id === c.cardId);
        if (!card) return null;
        return { card, orientation: c.orientation, position: c.position };
      })
      .filter((d): d is DrawnCard => d !== null)
      .sort((a, b) => a.position - b.position);

    if (drawn.length !== body.cards.length) {
      return NextResponse.json({ error: 'One or more cards were not recognized.' }, { status: 400 });
    }

    const engine = getReadingEngine();
    const question = (body.question || '').slice(0, 300);

    const overallReading = engine.generateOverallReading({
      question,
      category: body.category,
      cards: drawn,
    });

    const cardInterpretations = drawn.map((d) => ({
      cardId: d.card.id,
      name: d.card.name,
      position: d.position,
      orientation: d.orientation,
      interpretation: engine.generateCardInterpretation(d, body.category),
    }));

    // NOTE: Saving to Supabase `readings` / `reading_cards` for signed-in
    // users happens in Phase 2 once auth is wired up — this route already
    // returns everything needed to persist a reading record.

    return NextResponse.json({ overallReading, cardInterpretations });
  } catch (err) {
    return NextResponse.json({ error: 'We could not generate your reading. Please try again.' }, { status: 500 });
  }
}
