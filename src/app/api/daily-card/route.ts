import { NextRequest, NextResponse } from 'next/server';
import { drawDailyCard } from '@/lib/tarot/randomization';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const seed = req.nextUrl.searchParams.get('seed') || 'anonymous';
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const drawn = drawDailyCard(todayKey, seed);

  // NOTE: for signed-in users, Phase 2 persists this draw into the
  // `daily_cards` table (see supabase/schema.sql) keyed by user_id + date,
  // which is also what powers the streak calculation in `user_streaks`.

  return NextResponse.json({
    date: todayKey,
    card: drawn.card,
    orientation: drawn.orientation,
  });
}
