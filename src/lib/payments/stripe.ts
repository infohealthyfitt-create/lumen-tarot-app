import Stripe from 'stripe';
import type { CheckoutParams, CheckoutResult, PaymentProvider, PaymentStatus, WebhookEvent } from './provider';

export function isPaymentsEnabled(): boolean {
  return (
    process.env.ENABLE_PAYMENTS === 'true' &&
    !!process.env.STRIPE_SECRET_KEY &&
    !!process.env.STRIPE_WEBHOOK_SECRET
  );
}

function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY and ENABLE_PAYMENTS=true.');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
}

export class StripeProvider implements PaymentProvider {
  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    if (!isPaymentsEnabled()) {
      throw new Error('Payments are currently disabled.');
    }
    const stripe = getStripeClient();

    // productId maps to a Stripe Price ID configured in your Stripe dashboard.
    // Keep this mapping in one config source (see src/lib/payments/products.ts)
    // rather than hard-coding prices throughout the UI.
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: params.productId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.guestEmail,
      client_reference_id: params.userId ?? undefined,
      metadata: {
        userId: params.userId ?? 'anonymous',
        productId: params.productId,
      },
    });

    if (!session.url) throw new Error('Stripe did not return a checkout URL.');

    return { checkoutUrl: session.url, providerReference: session.id };
  }

  async getPaymentStatus(providerReference: string): Promise<PaymentStatus> {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(providerReference);
    if (session.payment_status === 'paid') return 'succeeded';
    if (session.status === 'expired') return 'failed';
    return 'pending';
  }

  verifyAndParseWebhook(rawBody: string, signatureHeader: string | null): WebhookEvent {
    if (!signatureHeader) return { type: 'unhandled' };
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signatureHeader,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        type: 'payment_succeeded',
        providerReference: session.id,
        productId: session.metadata?.productId || '',
        userId: session.metadata?.userId && session.metadata.userId !== 'anonymous' ? session.metadata.userId : null,
      };
    }
    if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
      const obj = event.data.object as any;
      return { type: 'payment_failed', providerReference: obj.id };
    }
    return { type: 'unhandled' };
  }
}
