export interface Product {
  id: string; // maps to a Stripe Price ID in production
  name: string;
  description: string;
  priceUsdCents: number;
  currency: 'usd';
}

// Single source of truth for pricing. Update here only — never hard-code
// prices inside components. In production this can instead be read from
// the `products` Supabase table so prices are editable from an admin panel
// without a redeploy.
export const PRODUCTS: Product[] = [
  {
    id: 'seven-card-reading',
    name: '7-Card Deep Dive Reading',
    description: 'A detailed spread covering your situation, influences, challenges, and possible direction.',
    priceUsdCents: 199,
    currency: 'usd',
  },
  {
    id: 'relationship-deep-dive',
    name: 'Relationship Deep Dive',
    description: 'An in-depth spread focused on the dynamics, energy, and possible direction of a specific relationship.',
    priceUsdCents: 299,
    currency: 'usd',
  },
  {
    id: 'future-path-reading',
    name: 'Future Path Reading',
    description: 'An expanded spread exploring potential paths ahead across the areas that matter most to you.',
    priceUsdCents: 499,
    currency: 'usd',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}
