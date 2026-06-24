import React from 'react';
import { DemoStateProvider, useDemoState } from './useDemoState';
import { DemoSplash } from './screens/DemoSplash';
import { DemoFeed } from './screens/DemoFeed';
import { DemoOffer } from './screens/DemoOffer';
import { DemoVerify } from './screens/DemoVerify';
import { DemoReward } from './screens/DemoReward';
import { DemoWallet } from './screens/DemoWallet';
import { DemoPlaceholder } from './screens/DemoPlaceholder';
import './styles/demo.css';

const DemoRouter: React.FC = () => {
  const { state } = useDemoState();
  const { currentStep, activeNavTab } = state;

  // Nav tabs that aren't part of the linear flow
  if (
    currentStep !== 'splash' &&
    currentStep !== 'offer' &&
    currentStep !== 'verify' &&
    currentStep !== 'reward' &&
    (activeNavTab === 'create' || activeNavTab === 'profile' || activeNavTab === 'system')
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
