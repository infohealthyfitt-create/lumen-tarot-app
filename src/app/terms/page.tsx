import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-starlight/80">
      <h1 className="mb-6 font-display text-3xl text-starlight">Terms of Service</h1>
      <p className="mb-4 text-starlight/50">Last updated: [INSERT DATE]</p>

      <p className="mb-4">
        These Terms govern your use of LumenTarot, operated by [COMPANY NAME]. By using the service, you
        agree to these Terms. Replace bracketed placeholders with your business&rsquo;s specific details
        before publishing.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Nature of the Service</h2>
      <p className="mb-4">
        LumenTarot provides Tarot-inspired guidance, reflection, and entertainment. Readings are not
        guarantees of future events and are not medical, legal, financial, or professional advice.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Accounts</h2>
      <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials.</p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Purchases</h2>
      <p className="mb-4">
        Premium readings are optional paid features. Pricing is displayed at checkout. See our{' '}
        <a href="/refund-policy" className="text-gold hover:underline">Refund Policy</a> for details.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Limitation of Liability</h2>
      <p className="mb-4">[INSERT JURISDICTION-SPECIFIC LIABILITY LANGUAGE — consult legal counsel.]</p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Governing Law</h2>
      <p className="mb-4">[INSERT GOVERNING LAW / JURISDICTION]</p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Contact</h2>
      <p>Questions can be sent to [CONTACT EMAIL].</p>
    </div>
  );
}
