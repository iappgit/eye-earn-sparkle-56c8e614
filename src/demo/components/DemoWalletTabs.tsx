import React from 'react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import type { WalletTab } from '../demoTypes';

const TABS: { id: WalletTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'available', label: 'Available' },
  { id: 'pending', label: 'Pending' },
  { id: 'earned', label: 'Earned' },
  { id: 'sent', label: 'Sent' },
  { id: 'review', label: 'Review' },
];

export const DemoWalletTabs: React.FC = () => {
  const { state, setWalletTab } = useDemoState();

  return (
    <div className="demo-wallet-tabs -mx-4 px-4 mb-4">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setWalletTab(tab.id)}
            className={cn(
              'flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all',
              state.walletTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-white/5 text-muted-foreground border border-white/10',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
