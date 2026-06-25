export type DemoStep =
  | 'splash'
  | 'feed'
  | 'offer'
  | 'verify'
  | 'reward'
  | 'wallet'
  | 'moneyMap'
  | 'receipt';

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

export type DemoTransactionType =
  | 'earned'
  | 'convert'
  | 'pay'
  | 'withdraw'
  | 'tip';

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

export interface DemoState {
  currentStep: DemoStep;
  activeNavTab: DemoNavTab;
  walletBalance: number;
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
  | { type: 'CONVERT_PREVIEW' }
  | { type: 'PAY_PREVIEW' }
  | { type: 'WITHDRAW_PREVIEW' }
  | { type: 'TIP_PREVIEW' }
  | { type: 'RESET_DEMO' };
