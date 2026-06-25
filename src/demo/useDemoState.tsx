import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  DemoAction,
  DemoNavTab,
  DemoOffer,
  DemoState,
  DemoStep,
  WalletTab,
  WalletAction,
  CreatorTab,
  PlatformId,
  CampaignAction,
  CampaignStrictness,
  CampaignGateKey,
} from './demoTypes';
import {
  getFeaturedOffer,
  createEarnTransaction,
  createConvertTransaction,
  createPayTransaction,
  createTipTransaction,
  createWithdrawTransaction,
  CONVERT_AMOUNT,
  PAY_AMOUNT,
  TIP_AMOUNT,
  WITHDRAW_AMOUNT,
  WITHDRAW_MIN,
  DEFAULT_CONNECTED_PLATFORMS,
  DEFAULT_CAMPAIGN_GATES,
} from './demoData';

const phase3Defaults = {
  activeCreatorTab: 'profile' as CreatorTab,
  connectedPlatforms: { ...DEFAULT_CONNECTED_PLATFORMS },
  campaignAction: 'shop' as CampaignAction,
  campaignReward: 25,
  campaignStrictness: 'strong' as CampaignStrictness,
  campaignGates: { ...DEFAULT_CAMPAIGN_GATES },
  campaignPublished: false,
  studioPreviewReady: false,
};

const initialState: DemoState = {
  currentStep: 'splash',
  activeNavTab: 'feed',
  walletBalance: 240,
  icoinBalance: 18,
  pendingAcoins: 0,
  earnedThisSession: 0,
  selectedOffer: null,
  verificationProgress: 0,
  popScore: 0,
  rewardClaimed: false,
  walletTab: 'overview',
  transactions: [],
  selectedReceiptId: null,
  moneyNode: null,
  activeWalletAction: null,
  ...phase3Defaults,
};

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step, activeWalletAction: null };
    case 'SET_NAV_TAB':
      return { ...state, activeNavTab: action.tab };
    case 'SELECT_OFFER':
      return { ...state, selectedOffer: action.offer };
    case 'SET_VERIFICATION_PROGRESS':
      return { ...state, verificationProgress: action.progress };
    case 'SET_POP_SCORE':
      return { ...state, popScore: action.score };
    case 'SET_WALLET_TAB':
      return { ...state, walletTab: action.tab };
    case 'SET_MONEY_NODE':
      return { ...state, moneyNode: action.node };
    case 'SELECT_RECEIPT':
      return { ...state, selectedReceiptId: action.id };
    case 'SET_WALLET_ACTION':
      return { ...state, activeWalletAction: action.action };
    case 'SET_CREATOR_TAB':
      return { ...state, activeCreatorTab: action.tab };
    case 'TOGGLE_DEMO_PLATFORM':
      return {
        ...state,
        connectedPlatforms: {
          ...state.connectedPlatforms,
          [action.platform]: !state.connectedPlatforms[action.platform],
        },
      };
    case 'SET_CAMPAIGN_ACTION':
      return { ...state, campaignAction: action.action };
    case 'SET_CAMPAIGN_REWARD':
      return { ...state, campaignReward: action.reward };
    case 'SET_CAMPAIGN_STRICTNESS':
      return { ...state, campaignStrictness: action.strictness };
    case 'TOGGLE_CAMPAIGN_GATE':
      return {
        ...state,
        campaignGates: {
          ...state.campaignGates,
          [action.gate]: !state.campaignGates[action.gate],
        },
      };
    case 'PUBLISH_CAMPAIGN_PREVIEW':
      return { ...state, campaignPublished: true };
    case 'SET_STUDIO_PREVIEW_READY':
      return { ...state, studioPreviewReady: action.ready };
    case 'CLAIM_REWARD': {
      const offer = state.selectedOffer;
      if (!offer || state.rewardClaimed) return state;

      const tx = createEarnTransaction(offer, offer.rewardAmount);
      const isAcoin = offer.rewardType === 'acoin';

      return {
        ...state,
        rewardClaimed: true,
        earnedThisSession: state.earnedThisSession + offer.rewardAmount,
        walletBalance: isAcoin ? state.walletBalance : state.walletBalance,
        pendingAcoins: isAcoin
          ? state.pendingAcoins + offer.rewardAmount
          : state.pendingAcoins,
        icoinBalance: !isAcoin
          ? state.icoinBalance + offer.rewardAmount
          : state.icoinBalance,
        transactions: [tx, ...state.transactions],
        currentStep: 'reward',
      };
    }
    case 'CONVERT_PREVIEW': {
      if (state.walletBalance < CONVERT_AMOUNT) return state;
      const tx = createConvertTransaction(CONVERT_AMOUNT);
      return {
        ...state,
        walletBalance: state.walletBalance - CONVERT_AMOUNT,
        icoinBalance: state.icoinBalance + CONVERT_AMOUNT,
        transactions: [tx, ...state.transactions],
        activeWalletAction: null,
        walletTab: 'available',
      };
    }
    case 'PAY_PREVIEW': {
      if (state.icoinBalance < PAY_AMOUNT) return state;
      const tx = createPayTransaction(PAY_AMOUNT);
      return {
        ...state,
        icoinBalance: state.icoinBalance - PAY_AMOUNT,
        transactions: [tx, ...state.transactions],
        activeWalletAction: null,
        walletTab: 'sent',
      };
    }
    case 'TIP_PREVIEW': {
      if (state.icoinBalance < TIP_AMOUNT) return state;
      const tx = createTipTransaction(TIP_AMOUNT);
      return {
        ...state,
        icoinBalance: state.icoinBalance - TIP_AMOUNT,
        transactions: [tx, ...state.transactions],
        activeWalletAction: null,
        walletTab: 'sent',
      };
    }
    case 'WITHDRAW_PREVIEW': {
      if (state.icoinBalance < WITHDRAW_MIN) return state;
      const tx = createWithdrawTransaction(WITHDRAW_AMOUNT);
      return {
        ...state,
        icoinBalance: state.icoinBalance - WITHDRAW_AMOUNT,
        transactions: [tx, ...state.transactions],
        activeWalletAction: null,
        walletTab: 'review',
      };
    }
    case 'RESET_DEMO':
      return { ...initialState, selectedOffer: getFeaturedOffer() };
    default:
      return state;
  }
}

interface DemoContextValue {
  state: DemoState;
  goToStep: (step: DemoStep) => void;
  setNavTab: (tab: DemoNavTab) => void;
  selectOffer: (offer: DemoOffer) => void;
  setVerificationProgress: (progress: number) => void;
  setPopScore: (score: number) => void;
  claimReward: () => void;
  resetDemo: () => void;
  enterDemo: () => void;
  setWalletTab: (tab: WalletTab) => void;
  setMoneyNode: (node: string | null) => void;
  selectReceipt: (id: string | null) => void;
  setWalletAction: (action: WalletAction | null) => void;
  confirmConvert: () => void;
  confirmPay: () => void;
  confirmWithdraw: () => void;
  confirmTip: () => void;
  openReceipt: (id: string) => void;
  openMoneyMap: () => void;
  setCreatorTab: (tab: CreatorTab) => void;
  togglePlatform: (platform: PlatformId) => void;
  setCampaignAction: (action: CampaignAction) => void;
  setCampaignReward: (reward: number) => void;
  setCampaignStrictness: (strictness: CampaignStrictness) => void;
  toggleCampaignGate: (gate: CampaignGateKey) => void;
  publishCampaignPreview: () => void;
  setStudioPreviewReady: (ready: boolean) => void;
  openTipFromProfile: () => void;
  openFeedDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export const DemoStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(demoReducer, initialState);

  const goToStep = useCallback((step: DemoStep) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const setNavTab = useCallback((tab: DemoNavTab) => {
    dispatch({ type: 'SET_NAV_TAB', tab });
    if (tab === 'feed') dispatch({ type: 'SET_STEP', step: 'feed' });
    if (tab === 'wallet') {
      dispatch({ type: 'SET_STEP', step: 'wallet' });
      dispatch({ type: 'SET_WALLET_TAB', tab: 'overview' });
    }
    if (tab === 'system') dispatch({ type: 'SET_STEP', step: 'moneyMap' });
    if (tab === 'profile') dispatch({ type: 'SET_STEP', step: 'profile' });
    if (tab === 'create') dispatch({ type: 'SET_STEP', step: 'campaignBuilder' });
  }, []);

  const selectOffer = useCallback((offer: DemoOffer) => {
    dispatch({ type: 'SELECT_OFFER', offer });
  }, []);

  const setVerificationProgress = useCallback((progress: number) => {
    dispatch({ type: 'SET_VERIFICATION_PROGRESS', progress });
  }, []);

  const setPopScore = useCallback((score: number) => {
    dispatch({ type: 'SET_POP_SCORE', score });
  }, []);

  const claimReward = useCallback(() => {
    dispatch({ type: 'CLAIM_REWARD' });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET_DEMO' });
  }, []);

  const enterDemo = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: 'feed' });
    dispatch({ type: 'SET_NAV_TAB', tab: 'feed' });
  }, []);

  const setWalletTab = useCallback((tab: WalletTab) => {
    dispatch({ type: 'SET_WALLET_TAB', tab });
  }, []);

  const setMoneyNode = useCallback((node: string | null) => {
    dispatch({ type: 'SET_MONEY_NODE', node });
  }, []);

  const selectReceipt = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_RECEIPT', id });
  }, []);

  const setWalletAction = useCallback((action: WalletAction | null) => {
    dispatch({ type: 'SET_WALLET_ACTION', action });
  }, []);

  const confirmConvert = useCallback(() => {
    dispatch({ type: 'CONVERT_PREVIEW' });
  }, []);

  const confirmPay = useCallback(() => {
    dispatch({ type: 'PAY_PREVIEW' });
  }, []);

  const confirmWithdraw = useCallback(() => {
    dispatch({ type: 'WITHDRAW_PREVIEW' });
  }, []);

  const confirmTip = useCallback(() => {
    dispatch({ type: 'TIP_PREVIEW' });
  }, []);

  const openReceipt = useCallback((id: string) => {
    dispatch({ type: 'SELECT_RECEIPT', id });
    dispatch({ type: 'SET_STEP', step: 'receipt' });
  }, []);

  const openMoneyMap = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: 'moneyMap' });
    dispatch({ type: 'SET_NAV_TAB', tab: 'system' });
  }, []);

  const setCreatorTab = useCallback((tab: CreatorTab) => {
    dispatch({ type: 'SET_CREATOR_TAB', tab });
  }, []);

  const togglePlatform = useCallback((platform: PlatformId) => {
    dispatch({ type: 'TOGGLE_DEMO_PLATFORM', platform });
  }, []);

  const setCampaignAction = useCallback((action: CampaignAction) => {
    dispatch({ type: 'SET_CAMPAIGN_ACTION', action });
  }, []);

  const setCampaignReward = useCallback((reward: number) => {
    dispatch({ type: 'SET_CAMPAIGN_REWARD', reward });
  }, []);

  const setCampaignStrictness = useCallback((strictness: CampaignStrictness) => {
    dispatch({ type: 'SET_CAMPAIGN_STRICTNESS', strictness });
  }, []);

  const toggleCampaignGate = useCallback((gate: CampaignGateKey) => {
    dispatch({ type: 'TOGGLE_CAMPAIGN_GATE', gate });
  }, []);

  const publishCampaignPreview = useCallback(() => {
    dispatch({ type: 'PUBLISH_CAMPAIGN_PREVIEW' });
  }, []);

  const setStudioPreviewReady = useCallback((ready: boolean) => {
    dispatch({ type: 'SET_STUDIO_PREVIEW_READY', ready });
  }, []);

  const openTipFromProfile = useCallback(() => {
    dispatch({ type: 'SET_NAV_TAB', tab: 'wallet' });
    dispatch({ type: 'SET_STEP', step: 'wallet' });
    dispatch({ type: 'SET_WALLET_TAB', tab: 'overview' });
    dispatch({ type: 'SET_WALLET_ACTION', action: 'tip' });
  }, []);

  const openFeedDemo = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: 'feed' });
    dispatch({ type: 'SET_NAV_TAB', tab: 'feed' });
  }, []);

  const value: DemoContextValue = {
    state,
    goToStep,
    setNavTab,
    selectOffer,
    setVerificationProgress,
    setPopScore,
    claimReward,
    resetDemo,
    enterDemo,
    setWalletTab,
    setMoneyNode,
    selectReceipt,
    setWalletAction,
    confirmConvert,
    confirmPay,
    confirmWithdraw,
    confirmTip,
    openReceipt,
    openMoneyMap,
    setCreatorTab,
    togglePlatform,
    setCampaignAction,
    setCampaignReward,
    setCampaignStrictness,
    toggleCampaignGate,
    publishCampaignPreview,
    setStudioPreviewReady,
    openTipFromProfile,
    openFeedDemo,
  };

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
};

export function useDemoState(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error('useDemoState must be used within DemoStateProvider');
  }
  return ctx;
}
