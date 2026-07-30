import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-starlight/80">
      <h1 className="mb-6 font-display text-3xl text-starlight">Privacy Policy</h1>
      <p className="mb-4 text-starlight/50">Last updated: [INSERT DATE]</p>

      <p className="mb-4">
        [COMPANY NAME] (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates LumenTarot. This page explains what
        information we collect, how we use it, and the choices you have. Replace the bracketed
        placeholders below with your business&rsquo;s specific details before publishing.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Information We Collect</h2>
      <p className="mb-4">
        Account information (email address) if you create an account; reading questions and card
        selections you choose to save; anonymous usage identifiers for free/anonymous readings and
        daily card streaks; payment confirmation data from our payment processor (we never store your
        card number).
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">How We Use Information</h2>
      <p className="mb-4">To provide and improve the service, maintain your reading history and streaks, process payments, and communicate with you about your account.</p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Data Sharing</h2>
      <p className="mb-4">
        We use third-party service providers (e.g., [SUPABASE / HOSTING PROVIDER], [PAYMENT PROCESSOR])
        to operate the service. We do not sell your personal information.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Your Choices</h2>
      <p className="mb-4">
        You may request deletion of your account and associated data by contacting [CONTACT EMAIL].
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg text-gold">Contact</h2>
      <p>Questions about this policy can be sent to [CONTACT EMAIL].</p>
    </div>
  );
}
