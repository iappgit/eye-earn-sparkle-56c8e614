import React from 'react';
import { Wallet, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DEMO_DISCLAIMER, createEarnTransaction } from '../demoData';

export const DemoWallet: React.FC = () => {
  const { state } = useDemoState();
  const latestTx =
    state.selectedOffer && state.rewardClaimed
      ? createEarnTransaction(state.selectedOffer, state.selectedOffer.rewardAmount)
      : null;

  return (
    <DemoShell showNav>
      <div className="px-4 pt-4">
        <header className="mb-6 demo-animate-fade-up">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Wallet</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Your demo balances and latest activity.
          </p>
        </header>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-3 mb-6 demo-animate-fade-up">
          <div className="demo-glass-card demo-glow-ring p-4">
            <p className="text-xs text-muted-foreground mb-1">ACoins</p>
            <p className="font-display text-3xl font-bold gradient-text">
              {state.walletBalance}
            </p>
            {state.earnedThisSession > 0 && state.selectedOffer?.rewardType === 'acoin' && (
              <p className="text-xs text-green-400 mt-1">
                +{state.earnedThisSession} this session
              </p>
            )}
          </div>
          <div className="demo-glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">iCoins</p>
            <p className="font-display text-3xl font-bold gradient-text-gold">
              {state.icoinBalance}
            </p>
            {state.earnedThisSession > 0 && state.selectedOffer?.rewardType === 'icoin' && (
              <p className="text-xs text-green-400 mt-1">
                +{state.earnedThisSession} this session
              </p>
            )}
          </div>
        </div>

        {/* Convert teaser — visual only */}
        <div className="demo-glass-card p-4 mb-6 flex items-center gap-3 demo-animate-fade-up">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Convert iCoins → ACoins</p>
            <p className="text-xs text-muted-foreground">
              Available in full product — disabled in investor preview.
            </p>
          </div>
        </div>

        {/* Latest transaction */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
            Latest activity
          </h2>
          {latestTx ? (
            <div className="demo-glass-card p-4 flex items-center gap-4 demo-animate-fade-up">
              <div className="w-11 h-11 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <ArrowDownLeft className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{latestTx.label}</p>
                <p className="text-xs text-muted-foreground">{latestTx.timestamp}</p>
              </div>
              <span
                className={cn(
                  'font-display font-bold whitespace-nowrap',
                  latestTx.coinType === 'acoin' ? 'gradient-text' : 'gradient-text-gold',
                )}
              >
                +{latestTx.amount}
              </span>
            </div>
          ) : (
            <div className="demo-glass-card p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Complete the earn flow to see your first transaction.
              </p>
            </div>
          )}
        </section>

        {/* Disclaimer card */}
        <div className="demo-glass-card p-4 border border-muted/30 mb-4">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {DEMO_DISCLAIMER}
          </p>
        </div>
      </div>
    </DemoShell>
  );
};
