import type {
  DemoOffer,
  DemoTransaction,
  PlatformId,
  CampaignAction,
  CampaignStrictness,
  CampaignGates,
  ConnectedPlatforms,
} from './demoTypes';

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

export const CREATOR_DISCLAIMER =
  'Simulated creator profile. No external platform account access.';

export const CAMPAIGN_DISCLAIMER =
  'Simulated campaign preview. No real ad spend, reporting, payment, or delivery.';

export const PLATFORM_DISCLAIMER =
  'Simulated platform connection. No external account access.';

export const CREATOR_NAME = 'Rafaela Studio';
export const CREATOR_HANDLE = '@rafaela.creates';
export const CREATOR_BIO =
  'Creator profile combining verified attention, content value, and connected platforms.';

export const CAMPAIGN_BRAND = 'Nike Running';
export const CAMPAIGN_TITLE = 'Pegasus 41 Launch';

export const DEFAULT_CONNECTED_PLATFORMS: ConnectedPlatforms = {
  youtube: true,
  tiktok: true,
  instagram: false,
  twitch: false,
};

export const DEFAULT_CAMPAIGN_GATES: CampaignGates = {
  watchTime: true,
  gazeConfidence: true,
  completion: true,
  ctaAction: false,
};

export const PLATFORM_META: Record<
  PlatformId,
  { label: string; color: string }
> = {
  youtube: { label: 'YouTube', color: 'hsl(0 80% 55%)' },
  tiktok: { label: 'TikTok', color: 'hsl(180 80% 45%)' },
  instagram: { label: 'Instagram', color: 'hsl(320 70% 55%)' },
  twitch: { label: 'Twitch', color: 'hsl(270 70% 55%)' },
};

export const CREATOR_STATS = {
  verifiedViews: '128.4K',
  earnedAcoins: '2,840',
  tipsReceived: '186',
  activeCampaigns: 3,
};

export interface CreatorContentItem {
  id: string;
  platform: PlatformId;
  title: string;
  thumbnail: string;
  verifiedViews: string;
  earnedPreview: number;
}

export const CREATOR_CONTENT: CreatorContentItem[] = [
  {
    id: 'c1',
    platform: 'youtube',
    title: 'Studio setup tour',
    thumbnail:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    verifiedViews: '42K',
    earnedPreview: 420,
  },
  {
    id: 'c2',
    platform: 'tiktok',
    title: 'Morning routine',
    thumbnail:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    verifiedViews: '89K',
    earnedPreview: 890,
  },
  {
    id: 'c3',
    platform: 'instagram',
    title: 'Behind the lens',
    thumbnail:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    verifiedViews: '31K',
    earnedPreview: 310,
  },
  {
    id: 'c4',
    platform: 'youtube',
    title: 'Edit workflow tips',
    thumbnail:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop',
    verifiedViews: '18K',
    earnedPreview: 180,
  },
  {
    id: 'c5',
    platform: 'twitch',
    title: 'Live Q&A replay',
    thumbnail:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=400&fit=crop',
    verifiedViews: '12K',
    earnedPreview: 120,
  },
  {
    id: 'c6',
    platform: 'tiktok',
    title: 'Gear review clip',
    thumbnail:
      'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=400&fit=crop',
    verifiedViews: '56K',
    earnedPreview: 560,
  },
];

export const CAMPAIGN_ACTIONS: { id: CampaignAction; label: string }[] = [
  { id: 'follow', label: 'Follow' },
  { id: 'visit', label: 'Visit' },
  { id: 'shop', label: 'Shop' },
  { id: 'save', label: 'Save' },
];

export const CAMPAIGN_REWARDS = [5, 10, 25, 50];

export const CAMPAIGN_STRICTNESS_OPTIONS: {
  id: CampaignStrictness;
  label: string;
}[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'strong', label: 'Strong' },
  { id: 'maximum', label: 'Maximum' },
];

export const CAMPAIGN_GATE_OPTIONS: {
  id: keyof CampaignGates;
  label: string;
}[] = [
  { id: 'watchTime', label: 'Watch time' },
  { id: 'gazeConfidence', label: 'Gaze confidence' },
  { id: 'completion', label: 'Completion' },
  { id: 'ctaAction', label: 'CTA action' },
];

export function calculateCampaignBudget(
  reward: number,
  strictness: CampaignStrictness,
  gates: CampaignGates,
): {
  rewardPool: number;
  estimatedViews: number;
  costPerAttention: string;
  platformFee: number;
} {
  const strictnessMultiplier =
    strictness === 'maximum' ? 0.72 : strictness === 'strong' ? 0.85 : 0.92;
  const activeGates = Object.values(gates).filter(Boolean).length;
  const gateBonus = 1 + activeGates * 0.03;

  const estimatedViews = Math.round(1200 * strictnessMultiplier * gateBonus);
  const rewardPool = reward * estimatedViews;
  const costPerAttention = (rewardPool / estimatedViews / gateBonus).toFixed(2);
  const platformFee = Math.round(rewardPool * 0.08);

  return {
    rewardPool,
    estimatedViews,
    costPerAttention,
    platformFee,
  };
}

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
