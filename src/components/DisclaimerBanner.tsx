import { DISCLAIMER_SHORT } from '@/data/safety-copy';

export default function DisclaimerBanner() {
  return (
    <p className="mx-auto max-w-3xl px-4 py-3 text-center text-xs leading-relaxed text-starlight/50">
      {DISCLAIMER_SHORT}
    </p>
  );
}
