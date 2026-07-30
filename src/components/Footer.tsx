import Link from 'next/link';
import DisclaimerBanner from './DisclaimerBanner';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gold/10 bg-midnight/60">
      <DisclaimerBanner />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-starlight/50 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} LumenTarot. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className="hover:text-gold">Privacy</Link>
          <Link href="/terms" className="hover:text-gold">Terms</Link>
          <Link href="/refund-policy" className="hover:text-gold">Refunds</Link>
          <Link href="/disclaimer" className="hover:text-gold">Disclaimer</Link>
          <Link href="/contact" className="hover:text-gold">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
