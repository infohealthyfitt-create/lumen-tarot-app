import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm leading-relaxed text-starlight/80">
      <h1 className="mb-6 font-display text-3xl text-starlight">Contact Us</h1>
      <p className="mb-4">Have a question, feedback, or a support request? We&rsquo;d love to hear from you.</p>
      <p className="glass inline-block rounded-xl px-6 py-4 text-gold">[INSERT CONTACT EMAIL]</p>
    </div>
  );
}
