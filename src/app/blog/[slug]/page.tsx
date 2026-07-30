import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getPostBySlug } from '@/data/blog-posts';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, url: `/blog/${post.slug}` },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <p className="mb-2 text-center text-xs uppercase tracking-widest text-gold/70">{post.category}</p>
      <h1 className="mb-8 text-center font-display text-3xl text-starlight">{post.title}</h1>
      <div className="space-y-4 text-sm leading-relaxed text-starlight/80">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
