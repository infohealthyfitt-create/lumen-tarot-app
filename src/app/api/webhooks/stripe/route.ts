import { NextRequest, NextResponse } from 'next/server';
import { StripeProvider, isPaymentsEnabled } from '@/lib/payments/stripe';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { getProduct } from '@/lib/payments/products';

export const runtime = 'nodejs';

// Required so Next.js does not attempt to parse the body before we read the
// raw text — Stripe signature verification needs the exact, unmodified
// payload bytes.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!isPaymentsEnabled()) {
    return NextResponse.json({ error: 'Payments disabled' }, { status: 503 });
  }

  const rawBody = await req.text(); // raw body, read BEFORE any JSON parsing
  const signature = req.headers.get('stripe-signature');

  const provider = new StripeProvider();
  let event;
  try {
    event = provider.verifyAndParseWebhook(rawBody, signature);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'payment_succeeded') {
    const product = getProduct(event.productId);
    const supabase = createSupabaseServiceClient();

    if (supabase && product) {
      // Idempotent upsert keyed on provider_reference so retried webhooks
      // never double-grant access.
      await supabase.from('payments').upsert(
        {
          user_id: event.userId,
          provider: 'stripe',
          product_id: product.id,
          amount: product.priceUsdCents,
          currency: product.currency,
          status: 'succeeded',
          provider_reference: event.providerReference,
        },
        { onConflict: 'provider_reference' },
      );
      // Premium access is granted purely by this verified DB row existing —
      // the dashboard/reading views check `payments.status = 'succeeded'`,
      // never the client-side success-page redirect.
    }
  } else if (event.type === 'payment_failed') {
    const supabase = createSupabaseServiceClient();
    await supabase
      ?.from('payments')
      .upsert({ provider_reference: event.providerReference, status: 'failed' }, { onConflict: 'provider_reference' });
  }

  return NextResponse.json({ received: true });
}
