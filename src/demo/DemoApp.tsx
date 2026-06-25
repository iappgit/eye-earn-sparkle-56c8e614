import React from 'react';
import { DemoStateProvider, useDemoState } from './useDemoState';
import { DemoSplash } from './screens/DemoSplash';
import { DemoFeed } from './screens/DemoFeed';
import { DemoOffer } from './screens/DemoOffer';
import { DemoVerify } from './screens/DemoVerify';
import { DemoReward } from './screens/DemoReward';
import { DemoWallet } from './screens/DemoWallet';
import { DemoMoneyMap } from './screens/DemoMoneyMap';
import { DemoReceipt } from './screens/DemoReceipt';
import { DemoPlaceholder } from './screens/DemoPlaceholder';
import './styles/demo.css';

const FOCUSED_STEPS = new Set([
  'splash',
  'offer',
  'verify',
  'reward',
  'moneyMap',
  'receipt',
]);

const DemoRouter: React.FC = () => {
  const { state } = useDemoState();
  const { currentStep, activeNavTab } = state;

  if (
    !FOCUSED_STEPS.has(currentStep) &&
    (activeNavTab === 'create' || activeNavTab === 'profile')
  ) {
    return <DemoPlaceholder />;
  }

  switch (currentStep) {
    case 'splash':
      return <DemoSplash />;
    case 'feed':
      return <DemoFeed />;
    case 'offer':
      return <DemoOffer />;
    case 'verify':
      return <DemoVerify />;
    case 'reward':
      return <DemoReward />;
    case 'wallet':
      return <DemoWallet />;
    case 'moneyMap':
      return <DemoMoneyMap />;
    case 'receipt':
      return <DemoReceipt />;
    default:
      return <DemoSplash />;
  }
};

const DemoApp: React.FC = () => (
  <DemoStateProvider>
    <DemoRouter />
  </DemoStateProvider>
);

export default DemoApp;
