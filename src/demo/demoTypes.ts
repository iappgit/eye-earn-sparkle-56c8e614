export type DemoStep =
  | 'splash'
  | 'feed'
  | 'offer'
  | 'verify'
  | 'reward'
  | 'wallet';

export type DemoNavTab = 'feed' | 'wallet' | 'create' | 'profile' | 'system';

export type CoinType = 'acoin' | 'icoin';

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
  type: 'earned';
  amount: number;
  coinType: CoinType;
  label: string;
  timestamp: string;
}

export interface DemoState {
  currentStep: DemoStep;
  activeNavTab: DemoNavTab;
  walletBalance: number;
  icoinBalance: number;
  earnedThisSession: number;
  selectedOffer: DemoOffer | null;
  verificationProgress: number;
  popScore: number;
  rewardClaimed: boolean;
}

export type DemoAction =
  | { type: 'SET_STEP'; step: DemoStep }
  | { type: 'SET_NAV_TAB'; tab: DemoNavTab }
  | { type: 'SELECT_OFFER'; offer: DemoOffer }
  | { type: 'SET_VERIFICATION_PROGRESS'; progress: number }
  | { type: 'SET_POP_SCORE'; score: number }
  | { type: 'CLAIM_REWARD' }
  | { type: 'RESET_DEMO' };
