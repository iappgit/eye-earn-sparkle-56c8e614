import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  DemoAction,
  DemoNavTab,
  DemoOffer,
  DemoState,
  DemoStep,
  WalletTab,
  WalletAction,
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
} from './demoData';

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
    case 'CLAIM_REWARD': {
      const offer = state.selectedOffer;
      if (!offer || state.rewardClaimed) return state;

      const tx = createEarnTransaction(offer, offer.rewardAmount);
      const isAcoin = offer.rewardType === 'acoin';

      return {
        ...state,
        rewardClaimed: true,
        earnedThisSession: state.earnedThisSession + offer.rewardAmount,
        walletBalance: isAcoin
          ? state.walletBalance
          : state.walletBalance,
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
