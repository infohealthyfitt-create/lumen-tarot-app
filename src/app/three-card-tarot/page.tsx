import type { Metadata } from 'next';
import CategoryLandingPage from '@/components/CategoryLandingPage';

export const metadata: Metadata = {
  title: 'Three Card Tarot Reading — Past, Present, Direction',
  description: 'A classic three-card Tarot spread covering your past or foundation, present energy, and possible direction ahead.',
  alternates: { canonical: '/three-card-tarot' },
};

export default function ThreeCardTarotPage() {
  return (
    <CategoryLandingPage
      category="general"
      h1="Three Card Tarot Reading"
      intro="The three-card spread is one of Tarot's most versatile layouts, offering a simple but meaningful look at where you've been, where you are, and where things may be heading."
      bullets={[
        'Card 1: Past / Foundation — what has shaped the current situation',
        'Card 2: Present Energy — what is most active right now',
        'Card 3: Possible Direction — an energy that may be emerging',
      ]}
    />
  );
}
