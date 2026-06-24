import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { DemoAction, DemoNavTab, DemoOffer, DemoState, DemoStep } from './demoTypes';
import { getFeaturedOffer } from './demoData';

const initialState: DemoState = {
  currentStep: 'splash',
  activeNavTab: 'feed',
  walletBalance: 240,
  icoinBalance: 18,
  earnedThisSession: 0,
  selectedOffer: null,
  verificationProgress: 0,
  popScore: 0,
  rewardClaimed: false,
};

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_NAV_TAB':
      return { ...state, activeNavTab: action.tab };
    case 'SELECT_OFFER':
      return { ...state, selectedOffer: action.offer };
    case 'SET_VERIFICATION_PROGRESS':
      return { ...state, verificationProgress: action.progress };
    case 'SET_POP_SCORE':
      return { ...state, popScore: action.score };
    case 'CLAIM_REWARD': {
      const offer = state.selectedOffer;
      if (!offer || state.rewardClaimed) return state;
      const isAcoin = offer.rewardType === 'acoin';
      return {
        ...state,
        rewardClaimed: true,
        earnedThisSession: state.earnedThisSession + offer.rewardAmount,
        walletBalance: isAcoin
          ? state.walletBalance + offer.rewardAmount
          : state.walletBalance,
        icoinBalance: !isAcoin
          ? state.icoinBalance + offer.rewardAmount
          : state.icoinBalance,
        currentStep: 'reward',
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
    if (tab === 'wallet') dispatch({ type: 'SET_STEP', step: 'wallet' });
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
