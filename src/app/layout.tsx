import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// NOTE: fonts use safe, widely-available system stacks (see globals.css
// --font-display / --font-body) rather than next/font/google, so the build
// never depends on reaching fonts.googleapis.com at build time. To use a
// custom webfont instead, either switch to next/font/google (works fine on
// Netlify's build servers, which have full internet access) or self-host
// font files with next/font/local.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LumenTarot — Your Cards Have a Message for You',
    template: '%s | LumenTarot',
  },
  description:
    'Free Tarot-inspired guidance and reflection. Ask a question, choose your cards, and receive a personalized reading for love, career, money, and more.',
  openGraph: {
    type: 'website',
    siteName: 'LumenTarot',
    url: siteUrl,
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <div className="starfield" aria-hidden />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
