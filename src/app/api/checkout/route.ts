import { NextRequest, NextResponse } from 'next/server';
import { StripeProvider, isPaymentsEnabled } from '@/lib/payments/stripe';
import { getProduct } from '@/lib/payments/products';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isPaymentsEnabled()) {
    return NextResponse.json(
      { error: 'Premium checkout is not yet available. Please check back soon.' },
      { status: 503 },
    );
  }

  try {
    const { productId } = await req.json();
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: 'Unknown product.' }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const provider = new StripeProvider();

    const { checkoutUrl } = await provider.createCheckout({
      userId: user?.id ?? null,
      guestEmail: user?.email,
      productId: product.id,
      successUrl: `${siteUrl}/dashboard?purchase=success`,
      cancelUrl: `${siteUrl}/dashboard?purchase=cancelled`,
    });

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 });
  }
}
