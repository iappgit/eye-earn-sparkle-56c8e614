import type { DemoOffer, DemoTransaction, CoinType } from './demoTypes';

export const DEMO_TAGLINE = 'Verified attention becomes value.';

export const DEMO_DISCLAIMER =
  'Simulated investor prototype. No real value, banking, payment, or external platform access.';

export const WALLET_DISCLAIMER =
  'Simulated wallet preview. No real value, banking, payment, or settlement.';

export const CONVERT_AMOUNT = 25;
export const PAY_AMOUNT = 5;
export const PAY_MERCHANT = 'iGo Partner Café';
export const TIP_AMOUNT = 10;
export const TIP_CREATOR = 'Rafaela Studio';
export const WITHDRAW_MIN = 50;
export const WITHDRAW_AMOUNT = 50;

export const ACOIN_EXPLANATION =
  'ACoins track verified attention value — an internal accounting layer after POP review.';

export const ICOIN_EXPLANATION =
  'iCoins represent usable demo wallet balance for previews like pay, tip, and withdraw routing.';

export const VALUE_FLOW_EXPLANATION =
  'Attention verified by POP becomes wallet value after review — then routes through ACoins and iCoins layers.';

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

export interface MoneyMapNode {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  order: number;
}

export const MONEY_MAP_NODES: MoneyMapNode[] = [
  {
    id: 'brand-pool',
    title: 'Brand reward pool',
    subtitle: 'Campaign funding',
    explanation:
      'Brands allocate a simulated reward pool for attention-verified views. No real funds move in this preview.',
    order: 1,
  },
  {
    id: 'pop-verify',
    title: 'POP verification',
    subtitle: 'Proof-of-presence',
    explanation:
      'Simulated presence and attention scoring validates that a viewer genuinely engaged with the offer.',
    order: 2,
  },
  {
    id: 'pending-review',
    title: 'Pending review',
    subtitle: 'Quality gate',
    explanation:
      'New verified attention enters a review queue before becoming wallet value — shown in the Review tab.',
    order: 3,
  },
  {
    id: 'acoin-layer',
    title: 'ACoins layer',
    subtitle: 'Attention accounting',
    explanation:
      'ACoins record verified attention value internally. They are not cash and have no real-world equivalence.',
    order: 4,
  },
  {
    id: 'icoin-layer',
    title: 'iCoins layer',
    subtitle: 'Usable balance',
    explanation:
      'iCoins are the usable demo wallet balance after conversion — routing to pay, tip, and withdraw previews.',
    order: 5,
  },
  {
    id: 'available-wallet',
    title: 'Available wallet',
    subtitle: 'Ready to route',
    explanation:
      'Usable iCoin balance available for simulated pay, tip, and withdraw routing previews.',
    order: 6,
  },
  {
    id: 'tip-creator',
    title: 'Tip creator',
    subtitle: 'Creator support',
    explanation:
      'Simulated tip preview sends iCoins to a creator profile. No real transfer occurs.',
    order: 7,
  },
  {
    id: 'pay-merchant',
    title: 'Pay merchant',
    subtitle: 'Partner preview',
    explanation:
      'Simulated merchant payment preview with a partner brand. No real merchant or payment processing.',
    order: 8,
  },
  {
    id: 'withdraw-preview',
    title: 'Withdraw preview',
    subtitle: 'Review routing',
    explanation:
      'Withdrawal preview routes to a review state. No real banking or settlement in this demo.',
    order: 9,
  },
  {
    id: 'receipt-preview',
    title: 'Receipt preview',
    subtitle: 'Audit trail',
    explanation:
      'Every simulated action generates a receipt preview with status, route, and disclaimer for investors.',
    order: 10,
  },
];

export function getFeaturedOffer(): DemoOffer {
  return DEMO_OFFERS.find((o) => o.id === FEATURED_OFFER_ID) ?? DEMO_OFFERS[0];
}

let txCounter = 0;

export function nextSimulatedId(): string {
  txCounter += 1;
  return `SIM-${Date.now().toString(36).toUpperCase()}-${txCounter.toString().padStart(3, '0')}`;
}

export function formatDemoTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function createEarnTransaction(
  offer: DemoOffer,
  amount: number,
): DemoTransaction {
  const isAcoin = offer.rewardType === 'acoin';
  return {
    id: `tx-earn-${offer.id}-${Date.now()}`,
    simulatedId: nextSimulatedId(),
    type: 'earned',
    amount,
    coinType: offer.rewardType,
    label: `${offer.brandName} — verified attention`,
    timestamp: formatDemoTime(),
    status: isAcoin ? 'pending-review' : 'completed-preview',
    direction: 'in',
    route: `Feed → Verify → ${isAcoin ? 'Review' : 'Wallet'}`,
    copy: isAcoin
      ? 'Verified attention pending review before ACoin credit.'
      : 'Verified attention credited to usable iCoin balance.',
  };
}

export function createConvertTransaction(amount: number): DemoTransaction {
  return {
    id: `tx-convert-${Date.now()}`,
    simulatedId: nextSimulatedId(),
    type: 'convert',
    amount,
    coinType: 'icoin',
    label: 'ACoins → iCoins conversion',
    timestamp: formatDemoTime(),
    status: 'completed-preview',
    direction: 'in',
    route: 'ACoins layer → iCoins layer',
    copy: 'Converted verified demo value into usable wallet balance.',
  };
}

export function createPayTransaction(amount: number): DemoTransaction {
  return {
    id: `tx-pay-${Date.now()}`,
    simulatedId: nextSimulatedId(),
    type: 'pay',
    amount,
    coinType: 'icoin',
    label: `${PAY_MERCHANT} — payment preview`,
    timestamp: formatDemoTime(),
    status: 'completed-preview',
    direction: 'out',
    route: 'Wallet → Partner merchant preview',
    copy: 'Simulated merchant payment preview. No real value moved.',
  };
}

export function createTipTransaction(amount: number): DemoTransaction {
  return {
    id: `tx-tip-${Date.now()}`,
    simulatedId: nextSimulatedId(),
    type: 'tip',
    amount,
    coinType: 'icoin',
    label: `Tip to ${TIP_CREATOR}`,
    timestamp: formatDemoTime(),
    status: 'completed-preview',
    direction: 'out',
    route: 'Wallet → Creator profile preview',
    copy: 'Simulated tip preview. No real transfer to creator.',
  };
}

export function createWithdrawTransaction(amount: number): DemoTransaction {
  return {
    id: `tx-withdraw-${Date.now()}`,
    simulatedId: nextSimulatedId(),
    type: 'withdraw',
    amount,
    coinType: 'icoin',
    label: 'Withdrawal routing preview',
    timestamp: formatDemoTime(),
    status: 'review-preview',
    direction: 'out',
    route: 'Wallet → Withdraw review queue',
    copy: 'Withdrawal preview. No real banking or settlement.',
  };
}

export function getTransactionIcon(type: DemoTransaction['type']): string {
  const map: Record<DemoTransaction['type'], string> = {
    earned: '↓',
    convert: '⇄',
    pay: '◎',
    withdraw: '↗',
    tip: '♥',
  };
  return map[type];
}

export function getStatusLabel(status: DemoTransaction['status']): string {
  const map: Record<DemoTransaction['status'], string> = {
    'completed-preview': 'Preview complete',
    'review-preview': 'Review preview',
    'pending-review': 'Pending review',
  };
  return map[status];
}
