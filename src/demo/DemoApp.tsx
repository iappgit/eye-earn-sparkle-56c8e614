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
import { DemoCreatorProfile } from './screens/DemoCreatorProfile';
import { DemoCampaignBuilder } from './screens/DemoCampaignBuilder';
import { DemoClickEarn } from './screens/DemoClickEarn';
import { DemoEloOverlay } from './screens/DemoEloOverlay';
import { DemoProductMap } from './screens/DemoProductMap';
import { DemoBrandDashboard } from './screens/DemoBrandDashboard';
import { DemoAttentionAnalytics } from './screens/DemoAttentionAnalytics';
import './styles/demo.css';

const DemoRouter: React.FC = () => {
  const { state } = useDemoState();
  const { currentStep } = state;

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
    case 'profile':
      return <DemoCreatorProfile />;
    case 'campaignBuilder':
      return <DemoCampaignBuilder />;
    case 'clickEarn':
      return <DemoClickEarn />;
    case 'elo':
      return <DemoEloOverlay />;
    case 'productMap':
      return <DemoProductMap />;
    case 'brandDashboard':
      return <DemoBrandDashboard />;
    case 'attentionAnalytics':
      return <DemoAttentionAnalytics />;
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
