import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-4xl">🌙</span>
      <h1 className="font-display text-2xl text-starlight">This page has drifted into the void</h1>
      <p className="max-w-sm text-sm text-starlight/60">
        We couldn&rsquo;t find what you were looking for. Let&rsquo;s get you back on your path.
      </p>
      <Link
        href="/"
        className="rounded-full bg-gradient-to-r from-gold-dim to-gold px-6 py-3 text-sm font-semibold text-void"
      >
        Return Home
      </Link>
    </div>
  );
}
