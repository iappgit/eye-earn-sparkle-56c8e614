export type DemoStep =
  | 'splash'
  | 'feed'
  | 'offer'
  | 'verify'
  | 'reward'
  | 'wallet'
  | 'moneyMap'
  | 'receipt'
  | 'profile'
  | 'campaignBuilder'
  | 'clickEarn'
  | 'elo'
  | 'productMap'
  | 'brandDashboard'
  | 'attentionAnalytics';

export type DemoNavTab = 'feed' | 'wallet' | 'create' | 'profile' | 'system';

export type CoinType = 'acoin' | 'icoin';

export type WalletTab =
  | 'overview'
  | 'available'
  | 'pending'
  | 'earned'
  | 'sent'
  | 'review';

export type WalletAction = 'convert' | 'pay' | 'withdraw' | 'tip';

export type CreatorTab = 'profile' | 'platforms' | 'content';

export type PlatformId = 'youtube' | 'tiktok' | 'instagram' | 'twitch';

export type CampaignAction = 'follow' | 'visit' | 'shop' | 'save';

export type CampaignStrictness = 'standard' | 'strong' | 'maximum';

export type CampaignGateKey =
  | 'watchTime'
  | 'gazeConfidence'
  | 'completion'
  | 'ctaAction';

export type ClickEarnMode =
  | 'idle'
  | 'liked'
  | 'holding'
  | 'preview'
  | 'confirmed';

export type EloMode = 'user' | 'creator' | 'brand' | 'system';

export type AnalyticsView = 'user' | 'creator' | 'brand' | 'system';

export type AnalyticsRange = 'today' | 'week' | 'month';

export type FeaturedOfferSource = 'default' | 'campaign';

export type DemoTransactionType =
  | 'earned'
  | 'convert'
  | 'pay'
  | 'withdraw'
  | 'tip'
  | 'clickEarn';

export type DemoTransactionStatus =
  | 'completed-preview'
  | 'review-preview'
  | 'pending-review';

export type DemoTransactionDirection = 'in' | 'out';

export interface DemoOffer {
  id: string;
  brandName: string;
  title: string;
  description: string;
  imageUrl: string;
  rewardAmount: number;
  rewardType: CoinType;
  category: string;
  distance: string;
  durationSeconds: number;
  terms: string;
}

export interface DemoTransaction {
  id: string;
  simulatedId: string;
  type: DemoTransactionType;
  amount: number;
  coinType: CoinType;
  label: string;
  timestamp: string;
  status: DemoTransactionStatus;
  direction: DemoTransactionDirection;
  route: string;
  copy?: string;
}

export interface ConnectedPlatforms {
  youtube: boolean;
  tiktok: boolean;
  instagram: boolean;
  twitch: boolean;
}

export interface CampaignGates {
  watchTime: boolean;
  gazeConfidence: boolean;
  completion: boolean;
  ctaAction: boolean;
}

export interface DemoState {
  currentStep: DemoStep;
  activeNavTab: DemoNavTab;
  approvedAcoins: number;
  icoinBalance: number;
  pendingAcoins: number;
  earnedThisSession: number;
  selectedOffer: DemoOffer | null;
  verificationProgress: number;
  popScore: number;
  rewardClaimed: boolean;
  walletTab: WalletTab;
  transactions: DemoTransaction[];
  selectedReceiptId: string | null;
  moneyNode: string | null;
  activeWalletAction: WalletAction | null;
  activeCreatorTab: CreatorTab;
  connectedPlatforms: ConnectedPlatforms;
  campaignAction: CampaignAction;
  campaignReward: number;
  campaignStrictness: CampaignStrictness;
  campaignGates: CampaignGates;
  campaignPublished: boolean;
  studioPreviewReady: boolean;
  featuredDemoOfferSource: FeaturedOfferSource;
  campaignVerifiedViews: number;
  claimedOfferIds: string[];
  clickEarnMode: ClickEarnMode;
  clickEarnAmount: number;
  clickEarnMessage: string | null;
  eloMode: EloMode;
  selectedEloPrompt: string | null;
  selectedProductNode: string | null;
  analyticsView: AnalyticsView;
  analyticsRange: AnalyticsRange;
  selectedAnalyticsInsight: string | null;
}

export type DemoAction =
  | { type: 'SET_STEP'; step: DemoStep }
  | { type: 'SET_NAV_TAB'; tab: DemoNavTab }
  | { type: 'SELECT_OFFER'; offer: DemoOffer }
  | { type: 'SET_VERIFICATION_PROGRESS'; progress: number }
  | { type: 'SET_POP_SCORE'; score: number }
  | { type: 'CLAIM_REWARD' }
  | { type: 'SET_WALLET_TAB'; tab: WalletTab }
  | { type: 'SET_MONEY_NODE'; node: string | null }
  | { type: 'SELECT_RECEIPT'; id: string | null }
  | { type: 'SET_WALLET_ACTION'; action: WalletAction | null }
  | { type: 'APPROVE_PENDING_ACOINS' }
  | { type: 'CONVERT_PREVIEW' }
  | { type: 'PAY_PREVIEW' }
  | { type: 'WITHDRAW_PREVIEW' }
  | { type: 'TIP_PREVIEW' }
  | { type: 'SET_CREATOR_TAB'; tab: CreatorTab }
  | { type: 'TOGGLE_DEMO_PLATFORM'; platform: PlatformId }
  | { type: 'SET_CAMPAIGN_ACTION'; action: CampaignAction }
  | { type: 'SET_CAMPAIGN_REWARD'; reward: number }
  | { type: 'SET_CAMPAIGN_STRICTNESS'; strictness: CampaignStrictness }
  | { type: 'TOGGLE_CAMPAIGN_GATE'; gate: CampaignGateKey }
  | { type: 'PUBLISH_CAMPAIGN_PREVIEW' }
  | { type: 'SET_STUDIO_PREVIEW_READY'; ready: boolean }
  | { type: 'OPEN_CLICK_EARN' }
  | { type: 'LIKE_CLICK_EARN' }
  | { type: 'START_CLICK_EARN' }
  | { type: 'SET_CLICK_EARN_AMOUNT'; amount: number }
  | { type: 'PREVIEW_CLICK_EARN' }
  | { type: 'CONFIRM_CLICK_EARN' }
  | { type: 'CANCEL_CLICK_EARN' }
  | { type: 'OPEN_ELO' }
  | { type: 'SET_ELO_MODE'; mode: EloMode }
  | { type: 'SELECT_ELO_PROMPT'; promptId: string }
  | { type: 'OPEN_PRODUCT_MAP' }
  | { type: 'OPEN_MONEY_MAP' }
  | { type: 'SET_PRODUCT_NODE'; node: string | null }
  | { type: 'OPEN_BRAND_DASHBOARD' }
  | { type: 'OPEN_ATTENTION_ANALYTICS' }
  | { type: 'SET_ANALYTICS_VIEW'; view: AnalyticsView }
  | { type: 'SET_ANALYTICS_RANGE'; range: AnalyticsRange }
  | { type: 'SET_ANALYTICS_INSIGHT'; insight: string | null }
  | { type: 'RESET_DEMO'; target?: 'splash' | 'feed' };
