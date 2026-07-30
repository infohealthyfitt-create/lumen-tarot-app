import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Refund Policy', alternates: { canonical: '/refund-policy' } };

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-starlight/80">
      <h1 className="mb-6 font-display text-3xl text-starlight">Refund Policy</h1>
      <p className="mb-4 text-starlight/50">Last updated: [INSERT DATE]</p>
      <p className="mb-4">
        [INSERT YOUR REFUND POLICY HERE — e.g., whether premium readings are refundable, the window for
        requesting a refund, and how to request one. Because premium readings are digital content
        delivered immediately after purchase, many businesses treat them as non-refundable except where
        required by law; confirm your policy and applicable consumer-protection requirements for the
        regions you serve before publishing.]
      </p>
      <h2 className="mb-2 mt-6 font-display text-lg text-gold">How to Request a Refund</h2>
      <p>Contact [CONTACT EMAIL] with your order details.</p>
    </div>
  );
}
