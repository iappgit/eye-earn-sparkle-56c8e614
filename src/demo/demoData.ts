import type { DemoOffer, DemoTransaction } from './demoTypes';

export const DEMO_TAGLINE = 'Verified attention becomes value.';

export const DEMO_DISCLAIMER =
  'Simulated investor prototype. No real value, banking, payment, or external platform access.';

export const DEMO_OFFERS: DemoOffer[] = [
  {
    id: 'offer-aurora-coffee',
    brandName: 'Aurora Coffee',
    title: 'Morning Ritual Reward',
    description:
      'Watch a 15-second brand story. Simulated proof-of-presence and attention scoring unlock a demo reward.',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1080&h=720&fit=crop',
    rewardAmount: 50,
    rewardType: 'acoin',
    category: 'Food & Drink',
    distance: '0.4 mi',
    durationSeconds: 15,
    terms: 'One simulated reward per demo session. Attention threshold: 85%.',
  },
  {
    id: 'offer-pulse-fitness',
    brandName: 'Pulse Fitness',
    title: 'New Member Spotlight',
    description:
      'A high-energy promo designed to show how verified viewing converts attention into value.',
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080&h=720&fit=crop',
    rewardAmount: 3,
    rewardType: 'icoin',
    category: 'Health',
    distance: '1.2 mi',
    durationSeconds: 12,
    terms: 'Simulated engagement only. No gym membership included.',
  },
  {
    id: 'offer-nova-tech',
    brandName: 'Nova Tech',
    title: 'Product Launch Preview',
    description:
      'Experience the flagship device story — built for investors to see watch-to-earn in action.',
    imageUrl:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1080&h=720&fit=crop',
    rewardAmount: 120,
    rewardType: 'acoin',
    category: 'Technology',
    distance: 'Online',
    durationSeconds: 18,
    terms: 'Demo content. Not affiliated with any real brand.',
  },
];

export const FEATURED_OFFER_ID = 'offer-aurora-coffee';

export function getFeaturedOffer(): DemoOffer {
  return DEMO_OFFERS.find((o) => o.id === FEATURED_OFFER_ID) ?? DEMO_OFFERS[0];
}

export function createEarnTransaction(
  offer: DemoOffer,
  amount: number,
): DemoTransaction {
  return {
    id: `tx-${offer.id}`,
    type: 'earned',
    amount,
    coinType: offer.rewardType,
    label: `${offer.brandName} — verified attention`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}
