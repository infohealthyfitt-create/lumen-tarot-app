'use client';

import { useEffect } from 'react';
import { PRODUCTS, formatPrice } from '@/lib/payments/products';
import { track } from '@/lib/analytics';
import type { ReadingCategory } from '@/lib/tarot/types';

export default function PremiumUpsell({ category }: { category: ReadingCategory }) {
  const product = PRODUCTS[0]; // 7-card deep dive

  useEffect(() => {
    track('premium_offer_viewed', { category });
  }, [category]);

  async function startCheckout() {
    track('checkout_started', { productId: product.id });
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id }),
    });
    const data = await res.json();
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else if (data.error) {
      alert(data.error);
    }
  }

  return (
    <div className="glass rounded-2xl border-gold/20 p-6">
      <h3 className="mb-2 font-display text-lg text-gold">Want to Explore This Reading More Deeply?</h3>
      <p className="mb-4 text-sm text-starlight/70">
        Your free reading explored the core energy. A deeper spread can explore your current situation,
        underlying influences, challenges, what deserves your attention, potential direction, personal
        reflection, and suggested next steps.
      </p>
      <button
        onClick={startCheckout}
        className="w-full rounded-full bg-gradient-to-r from-gold-dim to-gold px-6 py-3 text-sm font-semibold text-void shadow-glow sm:w-auto"
      >
        Unlock 7-Card Reading — {formatPrice(product.priceUsdCents)}
      </button>
    </div>
  );
}
