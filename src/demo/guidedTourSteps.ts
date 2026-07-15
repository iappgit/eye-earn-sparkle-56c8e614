import type { DemoNavTab, DemoStep, WalletTab } from './demoTypes';
import { getFeaturedOffer } from './demoData';

export interface GuidedTourStep {
  id: string;
  title: string;
  narration: string;
  targetStep: DemoStep;
  navTab?: DemoNavTab;
  walletTab?: WalletTab;
  /** Milliseconds to wait on verify before auto-advancing (recording mode). */
  dwellMs?: number;
  /** Run once when the tour lands on this step. */
  onEnter?:
    | 'selectFeaturedOffer'
    | 'approvePendingAcoins'
    | 'prepareAndPublishCampaign';
}

export const GUIDED_TOUR_STEPS: GuidedTourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to [ i ]',
    narration:
      'This is the investor educational simulator. Verified attention becomes wallet value — explore each beat or tap Next to follow the full story.',
    targetStep: 'splash',
  },
  {
    id: 'feed',
    title: 'Earning feed',
    narration:
      'Users discover immersive offers in the feed. Sponsored cards show demo rewards funded by brand attention pools.',
    targetStep: 'feed',
    navTab: 'feed',
  },
  {
    id: 'offer',
    title: 'Offer detail',
    narration:
      'Each offer shows reward amount, watch time, and POP verification requirements before the earn loop begins.',
    targetStep: 'offer',
    navTab: 'feed',
    onEnter: 'selectFeaturedOffer',
  },
  {
    id: 'verify',
    title: 'POP verification',
    narration:
      'Proof-of-presence runs locally — camera, MediaPipe, or simulation fallback. Gates illustrate attention quality; reward completes on a short timer in this preview.',
    targetStep: 'verify',
    navTab: 'feed',
    dwellMs: 6000,
  },
  {
    id: 'reward',
    title: 'Reward unlocked',
    narration:
      'Verified attention converts into demo ACoins or iCoins. ACoins enter pending review before they become usable wallet value.',
    targetStep: 'reward',
    navTab: 'feed',
    dwellMs: 2800,
  },
  {
    id: 'wallet-review',
    title: 'Wallet review',
    narration:
      'New verified attention enters a review queue before becoming wallet value — shown in the Review tab. Approve pending ACoins to unlock conversion.',
    targetStep: 'wallet',
    navTab: 'wallet',
    walletTab: 'review',
    dwellMs: 3200,
    onEnter: 'approvePendingAcoins',
  },
  {
    id: 'campaign-builder',
    title: 'Campaign builder',
    narration:
      'Brands configure action type, reward amount, POP strictness, and verification gates. Fund verified attention, not fake impressions.',
    targetStep: 'campaignBuilder',
    navTab: 'create',
    dwellMs: 4000,
  },
  {
    id: 'publish',
    title: 'Publish to feed',
    narration:
      'Publish preview links the campaign into the earning feed. Users can verify the live offer and grow brand analytics in this session.',
    targetStep: 'campaignBuilder',
    navTab: 'create',
    onEnter: 'prepareAndPublishCampaign',
    dwellMs: 2200,
  },
  {
    id: 'brand-dashboard',
    title: 'Owner analytics',
    narration:
      'Brand owners see verified views, reward pool spend, POP quality, and campaign timeline — outcomes tied to real attention verification.',
    targetStep: 'brandDashboard',
    navTab: 'create',
    dwellMs: 4000,
  },
  {
    id: 'product-map',
    title: 'Ecosystem map',
    narration:
      'The full [ i ] loop: users earn, creators monetize, brands fund, POP verifies, and value routes through wallet layers to receipts and analytics.',
    targetStep: 'productMap',
    navTab: 'system',
    dwellMs: 5000,
  },
];

export function getFeaturedOfferForTour() {
  return getFeaturedOffer();
}
