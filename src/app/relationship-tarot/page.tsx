import type { Metadata } from 'next';
import CategoryLandingPage from '@/components/CategoryLandingPage';

export const metadata: Metadata = {
  title: 'Relationship Tarot Reading',
  description: 'A Tarot-inspired reading exploring the dynamics, energy, and possible direction of a relationship in your life.',
  alternates: { canonical: '/relationship-tarot' },
};

export default function RelationshipTarotPage() {
  return (
    <CategoryLandingPage
      category="relationship"
      h1="Relationship Tarot Reading"
      intro="Whether it's a partnership, friendship, or family dynamic, this reading offers a reflective look at the energy currently surrounding the relationship."
      bullets={[
        'Explore the current dynamic between you and the other person',
        'Reflect on what the relationship may need right now',
        'Consider a possible direction this connection could take',
      ]}
    />
  );
}
