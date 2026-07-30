import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'Tarot Blog',
  description: 'Articles on Tarot basics, card meanings, spreads, love & relationships, and self-reflection.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-10 text-center font-display text-3xl text-starlight">Tarot Blog</h1>
      <div className="space-y-4">
        {BLOG_POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="glass block rounded-2xl p-6 transition hover:border-gold/40">
            <p className="mb-1 text-xs uppercase tracking-widest text-gold/70">{p.category}</p>
            <h2 className="mb-2 font-display text-lg text-starlight">{p.title}</h2>
            <p className="text-sm text-starlight/60">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
