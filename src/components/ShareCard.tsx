'use client';

import { track } from '@/lib/analytics';

export default function ShareCard({ cardName, reflection }: { cardName?: string; reflection?: string }) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = cardName
    ? `${cardName} — a reflection from LumenTarot. ${siteUrl}`
    : `A Tarot-inspired reflection from LumenTarot. ${siteUrl}`;

  async function handleShare() {
    track('share_clicked', { cardName });
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await (navigator as any).share({ title: 'LumenTarot', text: shareText, url: siteUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard!');
    } catch {
      // no-op
    }
  }

  return (
    <button
      onClick={handleShare}
      className="glass flex-1 rounded-full px-6 py-3 text-sm font-medium text-starlight hover:border-gold/40"
    >
      Share My Card
    </button>
  );
}
