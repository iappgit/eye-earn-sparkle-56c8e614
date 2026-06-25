import type {
  DemoOffer,
  DemoTransaction,
  PlatformId,
  CampaignAction,
  CampaignStrictness,
  CampaignGates,
  ConnectedPlatforms,
  AnalyticsView,
  AnalyticsRange,
  FeaturedOfferSource,
} from './demoTypes';

export const DEMO_TAGLINE = 'Verified attention becomes value.';

export const DEMO_DISCLAIMER =
  'Simulated prototype — no real value, banking, or external access.';

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

export const CLICK_EARN_DISCLAIMER =
  'Simulated creator value action. No real payment, transfer, or settlement.';

export const ELO_DISCLAIMER =
  'Simulated assistant preview. No live AI call or external data access.';

export const PRODUCT_MAP_DISCLAIMER =
  'Product map uses simulated demo flows. No real financial movement or external platform access.';

export const CLICK_EARN_MIN = 1;
export const CLICK_EARN_MAX = 25;
export const CLICK_EARN_DEFAULT = 10;

export const CREATOR_NAME = 'Rafaela Studio';
export const CREATOR_HANDLE = '@rafaela.creates';
export const CREATOR_BIO =
  'Creator profile combining verified attention, content value, and connected platforms.';

export const CAMPAIGN_BRAND = 'Nike Running';
export const CAMPAIGN_TITLE = 'Pegasus 41 Launch';
export const CAMPAIGN_OFFER_ID = 'offer-campaign-preview';

export const BRAND_DASHBOARD_DISCLAIMER =
  'Simulated owner analytics. No real ad spend, reporting, payment, or delivery.';

export const ANALYTICS_DISCLAIMER =
  'Simulated analytics preview. No real tracking, platform reporting, or external data access.';

export const RESTART_DEMO_LABEL = 'Restart simulated walkthrough';

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

export function getCreatorProfileStats(state: {
  connectedPlatforms: ConnectedPlatforms;
  transactions: DemoTransaction[];
  campaignVerifiedViews: number;
  claimedOfferIds: string[];
  earnedThisSession: number;
}) {
  const connectedCount = Object.values(state.connectedPlatforms).filter(Boolean).length;
  const tipsReceived = state.transactions
    .filter((t) => t.type === 'tip' || t.type === 'clickEarn')
    .reduce((sum, t) => sum + t.amount, 0);
  const verifiedViewsSession = state.campaignVerifiedViews + state.claimedOfferIds.length;

  return {
    connectedCount,
    tipsReceived,
    verifiedViewsSession,
    sessionEarned: state.earnedThisSession,
  };
}

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

export function buildCampaignOffer(params: {
  campaignAction: CampaignAction;
  campaignReward: number;
  campaignStrictness: CampaignStrictness;
  campaignGates: CampaignGates;
}): DemoOffer {
  const actionLabel =
    CAMPAIGN_ACTIONS.find((a) => a.id === params.campaignAction)?.label ?? 'Shop';
  const gateCount = Object.values(params.campaignGates).filter(Boolean).length;

  return {
    id: CAMPAIGN_OFFER_ID,
    brandName: CAMPAIGN_BRAND,
    title: CAMPAIGN_TITLE,
    description: `Published preview · ${actionLabel} CTA with ${params.campaignStrictness} POP strictness and ${gateCount} verification gates enabled.`,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1080&h=720&fit=crop',
    rewardAmount: params.campaignReward,
    rewardType: 'acoin',
    category: 'Campaign',
    distance: 'Live in feed',
    durationSeconds: 15,
    terms: `${CAMPAIGN_DISCLAIMER} One simulated reward per offer per session.`,
  };
}

export interface FeaturedOfferParams {
  featuredDemoOfferSource: FeaturedOfferSource;
  campaignPublished: boolean;
  campaignAction: CampaignAction;
  campaignReward: number;
  campaignStrictness: CampaignStrictness;
  campaignGates: CampaignGates;
}

export function getActiveFeaturedOffer(params: FeaturedOfferParams): DemoOffer {
  if (params.featuredDemoOfferSource === 'campaign' && params.campaignPublished) {
    return buildCampaignOffer(params);
  }
  return getFeaturedOffer();
}

export interface BrandDashboardMetrics {
  verifiedViews: number;
  rewardPoolRemaining: number;
  costPerAttention: string;
  ctaCompletionRate: string;
  fraudScreenPreview: string;
  estimatedReach: number;
  budgetCap: number;
  spentPreview: number;
  viewerRewards: number;
  creatorShareValue: number;
  platformFeePreview: number;
  attentionConfidence: string;
  sessionIntegrity: string;
  completionQuality: string;
  reviewPassedPreview: string;
}

export function getBrandDashboardMetrics(state: {
  campaignPublished: boolean;
  campaignReward: number;
  campaignStrictness: CampaignStrictness;
  campaignGates: CampaignGates;
  campaignVerifiedViews: number;
  studioPreviewReady: boolean;
  popScore: number;
}): BrandDashboardMetrics {
  const budget = calculateCampaignBudget(
    state.campaignReward,
    state.campaignStrictness,
    state.campaignGates,
  );
  const verifiedViews = state.campaignVerifiedViews;
  const spentPreview = verifiedViews * state.campaignReward;
  const creatorShareValue = Math.round(spentPreview * 0.12);
  const viewerRewards = spentPreview - creatorShareValue;

  const strictnessBoost =
    state.campaignStrictness === 'maximum'
      ? 94
      : state.campaignStrictness === 'strong'
        ? 88
        : 81;

  return {
    verifiedViews,
    rewardPoolRemaining: Math.max(0, budget.rewardPool - spentPreview),
    costPerAttention: `${state.campaignReward} A`,
    ctaCompletionRate: verifiedViews > 0 ? `${Math.min(92, 68 + verifiedViews * 8)}%` : '—',
    fraudScreenPreview: verifiedViews > 0 ? '1 flagged · preview cleared' : '0 flagged · preview idle',
    estimatedReach: budget.estimatedViews,
    budgetCap: budget.rewardPool,
    spentPreview,
    viewerRewards,
    creatorShareValue,
    platformFeePreview: budget.platformFee,
    attentionConfidence: `${strictnessBoost + Math.min(verifiedViews * 2, 6)}%`,
    sessionIntegrity: state.studioPreviewReady ? 'Studio preview aligned' : 'Awaiting studio preview',
    completionQuality: `${Math.min(97, strictnessBoost + 4)}%`,
    reviewPassedPreview: verifiedViews > 0 ? `${verifiedViews} passed review preview` : 'Pending first verification',
  };
}

export interface AnalyticsKpi {
  label: string;
  value: string;
  sub?: string;
}

export interface AnalyticsLoop {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface AnalyticsInsight {
  id: string;
  label: string;
  detail: string;
}

export const ANALYTICS_INSIGHTS: AnalyticsInsight[] = [
  {
    id: 'best-loop',
    label: 'Best loop',
    detail: 'Campaign loop shows strongest verified-attention efficiency when POP gates are enabled.',
  },
  {
    id: 'highest-value',
    label: 'Highest value content',
    detail: 'Published campaign creative drives the highest reward-per-minute preview in this session.',
  },
  {
    id: 'strongest-cta',
    label: 'Strongest CTA',
    detail: 'Shop action preview leads completion among configured campaign CTAs.',
  },
  {
    id: 'wallet-trend',
    label: 'Wallet conversion trend',
    detail: 'ACoins pending review convert to usable iCoins after simulated review routing.',
  },
];

const RANGE_MULTIPLIER: Record<AnalyticsRange, number> = {
  today: 1,
  week: 4.2,
  month: 14,
};

export function getAttentionAnalyticsData(state: {
  analyticsView: AnalyticsView;
  analyticsRange: AnalyticsRange;
  earnedThisSession: number;
  pendingAcoins: number;
  icoinBalance: number;
  campaignPublished: boolean;
  campaignVerifiedViews: number;
  campaignReward: number;
  campaignAction: CampaignAction;
  popScore: number;
  transactions: DemoTransaction[];
}): {
  kpis: AnalyticsKpi[];
  loops: AnalyticsLoop[];
  insights: AnalyticsInsight[];
} {
  const mult = RANGE_MULTIPLIER[state.analyticsRange];
  const verifiedMinutes = Math.round(
    (state.campaignVerifiedViews * 0.25 + state.transactions.filter((t) => t.type === 'earned').length * 0.18) *
      mult,
  );
  const popAvg = state.popScore > 0 ? `${state.popScore}%` : `${78 + state.campaignVerifiedViews * 4}%`;
  const actionLabel =
    CAMPAIGN_ACTIONS.find((a) => a.id === state.campaignAction)?.label ?? 'Shop';

  const viewKpis: Record<AnalyticsView, AnalyticsKpi[]> = {
    user: [
      { label: 'Verified attention min', value: `${verifiedMinutes}`, sub: 'preview' },
      { label: 'POP confidence avg', value: popAvg },
      { label: 'Rewards earned', value: `${Math.round(state.earnedThisSession * mult)}`, sub: 'A/i preview' },
      { label: 'Campaign efficiency', value: state.campaignPublished ? 'High preview' : '—' },
      { label: 'Review / fraud screen', value: state.pendingAcoins > 0 ? '1 pending review' : 'Clear preview' },
      { label: 'Creator value routed', value: `${Math.round(state.earnedThisSession * 0.12 * mult)}`, sub: 'A preview' },
    ],
    creator: [
      { label: 'Verified attention min', value: `${Math.round(verifiedMinutes * 1.4)}` },
      { label: 'POP confidence avg', value: popAvg },
      { label: 'Tips + hold value', value: `${Math.round(10 * mult)}`, sub: 'i preview' },
      { label: 'Creator value routed', value: `${Math.round(186 * (mult / 14))}`, sub: 'A preview' },
      { label: 'Campaign efficiency', value: 'Creator loop strong' },
      { label: 'Review / fraud screen', value: '0 flagged preview' },
    ],
    brand: [
      { label: 'Verified views', value: `${Math.round(state.campaignVerifiedViews * mult)}` },
      { label: 'POP confidence avg', value: popAvg },
      { label: 'Reward pool spent', value: `${state.campaignVerifiedViews * state.campaignReward} A`, sub: 'preview' },
      { label: 'Campaign efficiency', value: state.campaignPublished ? `${actionLabel} CTA leading` : 'Draft' },
      { label: 'Review / fraud screen', value: 'Preview queue clear' },
      { label: 'Estimated reach', value: `${Math.round(1200 * mult / 14)}`, sub: 'preview' },
    ],
    system: [
      { label: 'Verified attention min', value: `${verifiedMinutes}` },
      { label: 'POP confidence avg', value: popAvg },
      { label: 'Ledger events', value: `${state.transactions.length}` },
      { label: 'Campaign loop status', value: state.campaignPublished ? 'Published preview' : 'Draft preview' },
      { label: 'Review / fraud screen', value: 'Simulated gate active' },
      { label: 'Wallet conversion', value: `${state.icoinBalance} i`, sub: 'usable preview' },
    ],
  };

  const loops: AnalyticsLoop[] = [
    {
      id: 'watch',
      label: 'Watch loop',
      value: `${Math.round(verifiedMinutes * 0.55)} min`,
      description: 'Feed → verify → reward preview for immersive offers.',
    },
    {
      id: 'igo',
      label: 'iGo / local loop',
      value: `${Math.round(verifiedMinutes * 0.2)} min`,
      description: 'Nearby merchant and partner routing previews.',
    },
    {
      id: 'creator',
      label: 'Creator value loop',
      value: `${Math.round(verifiedMinutes * 0.15)} min`,
      description: 'Tips, hold-to-value, and profile-attention previews.',
    },
    {
      id: 'campaign',
      label: 'Campaign loop',
      value: state.campaignPublished
        ? `${state.campaignVerifiedViews} verified`
        : 'Awaiting publish',
      description: 'Brand pool → POP → wallet value → owner analytics.',
    },
  ];

  return {
    kpis: viewKpis[state.analyticsView],
    loops,
    insights: ANALYTICS_INSIGHTS.map((insight) => ({
      ...insight,
      detail:
        insight.id === 'strongest-cta'
          ? `${actionLabel} action preview leads completion among configured campaign CTAs.`
          : insight.detail,
    })),
  };
}

export interface EloContext {
  icoinBalance: number;
  pendingAcoins: number;
  approvedAcoins: number;
  earnedThisSession: number;
  rewardClaimed: boolean;
  selectedOffer: DemoOffer | null;
  campaignPublished: boolean;
  campaignReward: number;
  campaignAction: CampaignAction;
  campaignVerifiedViews: number;
  connectedPlatforms: ConnectedPlatforms;
  transactions: DemoTransaction[];
}

export function getConnectedPlatformCount(platforms: ConnectedPlatforms): number {
  return Object.values(platforms).filter(Boolean).length;
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

export function resetTransactionCounter(): void {
  txCounter = 0;
}

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
    copy: 'Converted approved demo ACoins into available iCoin balance.',
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

export function createClickEarnTransaction(amount: number): DemoTransaction {
  return {
    id: `tx-click-earn-${Date.now()}`,
    simulatedId: nextSimulatedId(),
    type: 'clickEarn',
    amount,
    coinType: 'icoin',
    label: `Hold-to-value · ${TIP_CREATOR}`,
    timestamp: formatDemoTime(),
    status: 'completed-preview',
    direction: 'out',
    route: 'Hold-to-value creator offer',
    copy: CLICK_EARN_DISCLAIMER,
  };
}

export interface EloPrompt {
  id: string;
  label: string;
}

export const ELO_PROMPTS: EloPrompt[] = [
  { id: 'explain-reward', label: 'Explain this reward' },
  { id: 'summarize-wallet', label: 'Summarize my wallet' },
  { id: 'build-campaign', label: 'Help build a campaign' },
  { id: 'explain-pop', label: 'Explain POP verification' },
  { id: 'optimize-profile', label: 'Optimize creator profile' },
];

export type EloModeKey = 'user' | 'creator' | 'brand' | 'system';

const ELO_RESPONSES: Record<EloModeKey, Record<string, string>> = {
  user: {
    'explain-reward':
      'Rewards in this demo come from verified attention. Watch an offer, pass POP checks, and value routes to ACoins (review) or iCoins (usable). Nothing here is real money.',
    'summarize-wallet':
      'Your demo wallet holds ACoins (attention accounting) and iCoins (usable preview balance). Convert, pay, tip, withdraw, and click-and-earn are all simulated routing previews.',
    'build-campaign':
      'As a user you see campaigns in the feed. Brands fund pools; creators distribute offers. Tap Create in the nav to preview how a brand would configure gates and rewards.',
    'explain-pop':
      'POP (proof-of-presence) simulates gaze and watch-time confidence during verify. It gates whether attention counts toward wallet value — no camera or real biometrics in this demo.',
    'optimize-profile':
      'Connect platforms on the creator profile to show cross-channel reach. In this preview, toggles are local only — no OAuth or external APIs.',
  },
  creator: {
    'explain-reward':
      'Creators earn when audiences verify attention on their content or receive hold-to-value iCoins. Rafaela Studio shows profile stats and tip routing in this investor flow.',
    'summarize-wallet':
      'Creator-side value accumulates as verified attention and tips. Wallet Sent tab shows outbound previews; Earned shows inbound simulated credits.',
    'build-campaign':
      'Use Campaign Builder to set action type, reward amount, strictness, and POP gates. Publish preview marks the campaign ready for Studio — no real ad delivery.',
    'explain-pop':
      'Stronger POP gates increase trust for brand partners. Creators benefit when verification is strict because rewards represent genuine attention.',
    'optimize-profile':
      'Enable YouTube, TikTok, Instagram, and Twitch chips to demonstrate connected reach. Add content tiles and open tip preview from profile actions.',
  },
  brand: {
    'explain-reward':
      'Brand reward pools fund verified views. Each completion debits the pool and credits the user after POP + review — all simulated in this prototype.',
    'summarize-wallet':
      'Brands track pool allocation vs. verified completions via the money movement map. No real invoicing or payment rails in demo mode.',
    'build-campaign':
      'Nike Running preview: pick shop/visit/follow action, set iCoin reward, choose strictness, toggle gates, then publish preview. Budget estimate updates locally.',
    'explain-pop':
      'POP is the quality layer brands buy into. Higher strictness means fewer but higher-confidence verifications — shown in campaign builder chips.',
    'optimize-profile':
      'Partner with creators like Rafaela Studio who show connected platforms and content performance. Profile is a routing surface, not a live CRM.',
  },
  system: {
    'explain-reward':
      'System layer: Feed → Offer → Verify → Reward → Wallet. Each hop is a deterministic demo step with receipt previews for audit storytelling.',
    'summarize-wallet':
      'Ledger stores all simulated transactions with status, route, and copy. Receipt screen is the investor-facing audit trail.',
    'build-campaign':
      'Campaign Builder connects brand intent to feed offers. Product Map shows how builder, POP, and wallet layers interlock.',
    'explain-pop':
      'POP sits between brand pool and pending review. It outputs a score used in verify UI — deterministic animation, no ML inference.',
    'optimize-profile':
      'Creator profile is the identity node in the ecosystem map. ELO routes investors to profile, wallet, and campaign surfaces on demand.',
  },
};

export function getEloResponse(mode: EloModeKey, promptId: string, ctx?: EloContext): string {
  const base =
    ELO_RESPONSES[mode][promptId] ??
    'Select a prompt to see a deterministic explanation for this demo layer.';

  if (!ctx) return base;

  const contextLines: string[] = [];
  const actionLabel =
    CAMPAIGN_ACTIONS.find((a) => a.id === ctx.campaignAction)?.label ?? ctx.campaignAction;
  const lastTx = ctx.transactions[0];
  const offerLabel = ctx.selectedOffer
    ? `${ctx.selectedOffer.brandName} — ${ctx.selectedOffer.title}`
    : 'No offer selected';

  if (promptId === 'summarize-wallet') {
    contextLines.push(
      `Your wallet currently shows ${ctx.icoinBalance} available iCoins, ${ctx.pendingAcoins} pending ACoins awaiting review, and ${ctx.approvedAcoins} approved ACoins ready to convert.`,
    );
    if (ctx.earnedThisSession > 0) {
      contextLines.push(`Earned this session (preview): ${ctx.earnedThisSession} value units.`);
    }
  }

  if (promptId === 'explain-reward') {
    contextLines.push(`Active offer context: ${offerLabel}.`);
    if (ctx.rewardClaimed) {
      contextLines.push('A reward preview has already been claimed this session for at least one offer.');
    }
    if (ctx.campaignPublished) {
      contextLines.push(
        `The published campaign preview is ${CAMPAIGN_TITLE} with a ${ctx.campaignReward} ACoin reward.`,
      );
    }
  }

  if (promptId === 'build-campaign') {
    if (ctx.campaignPublished) {
      contextLines.push(
        `${CAMPAIGN_BRAND} campaign is published in feed preview with ${actionLabel} CTA and ${ctx.campaignReward} A reward.`,
      );
      contextLines.push(`Verified views collected (preview): ${ctx.campaignVerifiedViews}.`);
    } else {
      contextLines.push('Campaign is still in draft preview — publish to link it to the earning feed.');
    }
  }

  if (promptId === 'explain-pop') {
    contextLines.push(
      ctx.campaignPublished
        ? 'Published campaign uses configured POP gates from Campaign Builder.'
        : 'Configure POP gates in Campaign Builder before publishing preview.',
    );
  }

  if (promptId === 'optimize-profile') {
    contextLines.push(
      `${getConnectedPlatformCount(ctx.connectedPlatforms)} platforms connected in creator profile preview.`,
    );
  }

  if (lastTx) {
    contextLines.push(`Last ledger event (preview): ${lastTx.type} · ${lastTx.label}.`);
  }

  contextLines.push('This is simulated guidance. No live AI call or external account access.');

  return [base, ...contextLines].join(' ');
}

export interface ProductMapNode {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  icon: string;
}

export const PRODUCT_MAP_NODES: ProductMapNode[] = [
  {
    id: 'users',
    title: 'Users',
    subtitle: 'Attention participants',
    explanation:
      'Users discover offers in the feed, verify attention, earn value, and route iCoins through wallet previews.',
    icon: '👤',
  },
  {
    id: 'creators',
    title: 'Creators',
    subtitle: 'Value publishers',
    explanation:
      'Creators like Rafaela Studio publish content, receive tips and hold-to-value, and connect platforms in profile.',
    icon: '✦',
  },
  {
    id: 'brands',
    title: 'Brands',
    subtitle: 'Campaign funders',
    explanation:
      'Brands configure campaigns, publish to the earning feed, and review verified attention in Owner Analytics.',
    icon: '◎',
  },
  {
    id: 'merchants',
    title: 'Merchants',
    subtitle: 'Partner checkout',
    explanation:
      'Pay preview routes iCoins to partner merchants like iGo Partner Café — no real POS or settlement.',
    icon: '🏪',
  },
  {
    id: 'pop',
    title: 'POP verification',
    subtitle: 'Proof-of-presence',
    explanation:
      'Simulated gaze and watch-time scoring validates attention before value enters review or wallet.',
    icon: '👁',
  },
  {
    id: 'wallet',
    title: 'Wallet / ACoins / iCoins',
    subtitle: 'Value layers',
    explanation:
      'ACoins track verified attention; iCoins are usable demo balance. Tabs show overview, pending, sent, and review states.',
    icon: '💎',
  },
  {
    id: 'campaign-builder',
    title: 'Campaign Builder',
    subtitle: 'Brand studio',
    explanation:
      'Configure Nike Running-style campaigns with actions, rewards, POP gates, and publish preview.',
    icon: '🎯',
  },
  {
    id: 'creator-profile',
    title: 'Creator Profile',
    subtitle: 'Identity surface',
    explanation:
      'Rafaela Studio profile with platforms, stats, content grid, and tip entry — all local simulation.',
    icon: '★',
  },
  {
    id: 'money-movement',
    title: 'Money Movement',
    subtitle: 'Flow diagram',
    explanation:
      'Step-through map from brand pool to receipt preview. Complements the ecosystem product map.',
    icon: '↻',
  },
  {
    id: 'elo',
    title: 'ELO / Ni',
    subtitle: 'Assistant layer',
    explanation:
      'Deterministic product assistant explaining rewards, wallet, POP, and campaigns — no live AI.',
    icon: '◈',
  },
  {
    id: 'brand-dashboard',
    title: 'Brand Dashboard',
    subtitle: 'Owner analytics',
    explanation:
      'Nike Running owner view — verified views, reward pool, POP quality, and CTA performance previews.',
    icon: '📊',
  },
  {
    id: 'attention-analytics',
    title: 'Attention Analytics',
    subtitle: 'Cross-layer metrics',
    explanation:
      'Measure verified attention across user, creator, brand, and system views — all simulated.',
    icon: '📈',
  },
  {
    id: 'published-campaign',
    title: 'Published Campaign',
    subtitle: 'Feed linkage loop',
    explanation:
      'Brand publishes in Campaign Builder → offer appears in Feed → user verifies → wallet updates → brand sees analytics.',
    icon: '🔗',
  },
];

export function getTransactionIcon(type: DemoTransaction['type']): string {
  const map: Record<DemoTransaction['type'], string> = {
    earned: '↓',
    convert: '⇄',
    pay: '◎',
    withdraw: '↗',
    tip: '♥',
    clickEarn: '♥',
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
