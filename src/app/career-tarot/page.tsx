import type { Metadata } from 'next';
import CategoryLandingPage from '@/components/CategoryLandingPage';

export const metadata: Metadata = {
  title: 'Career Tarot Reading',
  description: 'A Tarot-inspired reading focused on your career path, opportunities, and the energy surrounding your professional life.',
  alternates: { canonical: '/career-tarot' },
};

export default function CareerTarotPage() {
  return (
    <CategoryLandingPage
      category="career"
      h1="Career Tarot Reading"
      intro="Reflect on your professional path with a reading that explores the energy around your current role, opportunities, and next steps."
      bullets={[
        'Explore the energy around a current opportunity or decision',
        'Reflect on what may be holding you back or moving you forward',
        'Consider a possible direction for your professional path',
      ]}
    />
  );
}
