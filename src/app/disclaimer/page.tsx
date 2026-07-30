import type { Metadata } from 'next';
import { DISCLAIMER_SHORT, POSITIONING_STATEMENT } from '@/data/safety-copy';

export const metadata: Metadata = { title: 'Disclaimer', alternates: { canonical: '/disclaimer' } };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-starlight/80">
      <h1 className="mb-6 font-display text-3xl text-starlight">Disclaimer</h1>
      <p className="mb-4 font-medium text-starlight">{POSITIONING_STATEMENT}</p>
      <p className="mb-4">{DISCLAIMER_SHORT}</p>
      <p className="mb-4">
        We do not guarantee outcomes related to pregnancy, death, disease, investment returns, gambling,
        or legal proceedings, or any other future event. Readings reflect one possible interpretation
        among many and are meant to support personal reflection, not to predict or determine your future.
      </p>
      <p>
        If you are facing a medical, legal, financial, or safety-related decision, please consult a
        qualified professional.
      </p>
    </div>
  );
}
