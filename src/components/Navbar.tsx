'use client';

import Link from 'next/link';
import { useState } from 'react';

const LINKS = [
  { href: '/free-tarot-reading', label: 'Free Reading' },
  { href: '/love-tarot', label: 'Love' },
  { href: '/yes-no-tarot', label: 'Yes/No' },
  { href: '/daily-tarot', label: 'Daily Card' },
  { href: '/tarot-card-meanings', label: 'Card Meanings' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-void/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-wide text-starlight">
          Lumen<span className="text-gold">Tarot</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-starlight/70 transition hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/free-tarot-reading"
            className="rounded-full bg-gradient-to-r from-gold-dim to-gold px-4 py-2 text-sm font-medium text-void shadow-glow transition hover:brightness-110"
          >
            Draw Your Cards
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-starlight md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold/10 bg-void/95 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-starlight/80 active:bg-nebula"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
