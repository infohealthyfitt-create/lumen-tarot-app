export interface CheckoutParams {
  userId: string | null; // null for anonymous checkout (guest email required instead)
  guestEmail?: string;
  productId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  providerReference: string;
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface PaymentRecord {
  paymentId: string;
  userId: string | null;
  provider: string;
  productId: string;
  amount: number; // in smallest currency unit (e.g. cents)
  currency: string;
  status: PaymentStatus;
  providerReference: string;
}

/**
 * Provider-agnostic payment interface. The rest of the app should only ever
 * talk to this interface, never to Stripe (or any other gateway) directly.
 * This lets the payment backend be swapped later without touching UI code.
 */
export interface PaymentProvider {
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>;
  /** Verifies a payment status directly with the provider (defense in depth; the source of truth is the webhook). */
  getPaymentStatus(providerReference: string): Promise<PaymentStatus>;
  /** Verifies an incoming webhook's signature and parses it into a normalized event. */
  verifyAndParseWebhook(rawBody: string, signatureHeader: string | null): WebhookEvent;
}

export type WebhookEvent =
  | { type: 'payment_succeeded'; providerReference: string; productId: string; userId: string | null }
  | { type: 'payment_failed'; providerReference: string }
  | { type: 'unhandled' };
