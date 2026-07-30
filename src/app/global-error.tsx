'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-void px-4 text-center text-starlight">
        <span className="mb-4 text-4xl">✦</span>
        <h1 className="mb-2 font-display text-2xl">Something went off course</h1>
        <p className="mb-6 max-w-sm text-sm text-starlight/60">
          We ran into an unexpected issue. Please try again — your reading data is safe.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-gradient-to-r from-gold-dim to-gold px-6 py-3 text-sm font-semibold text-void"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
