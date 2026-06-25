import React from 'react';
import {
  Wallet,
  RefreshCw,
  CreditCard,
  ArrowUpRight,
  Heart,
  Map,
  Receipt,
  ArrowDownLeft,
  Clock,
  Send,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoWalletTabs } from '../components/DemoWalletTabs';
import { DemoActionSheet } from '../components/DemoActionSheet';
import { DemoRestartControl } from '../components/DemoRestartControl';
import { DemoRestartControl } from '../components/DemoRestartControl';
import {
  WALLET_DISCLAIMER,
  ACOIN_EXPLANATION,
  ICOIN_EXPLANATION,
  VALUE_FLOW_EXPLANATION,
  getStatusLabel,
} from '../demoData';
import type { DemoTransaction, WalletAction } from '../demoTypes';

function TransactionRow({
  tx,
  onOpen,
}: {
  tx: DemoTransaction;
  onOpen: (id: string) => void;
}) {
  const isIn = tx.direction === 'in';
  return (
    <button
      type="button"
      onClick={() => onOpen(tx.id)}
      className="demo-glass-card w-full p-4 flex items-center gap-3 text-left hover:border-primary/30 transition-colors"
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold',
          isIn ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400',
        )}
      >
        {isIn ? '+' : '−'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{tx.label}</p>
        <p className="text-xs text-muted-foreground">
          {tx.timestamp} · {getStatusLabel(tx.status)}
        </p>
      </div>
      <span
        className={cn(
          'font-display font-bold text-sm whitespace-nowrap',
          tx.coinType === 'acoin' ? 'gradient-text' : 'gradient-text-gold',
        )}
      >
        {isIn ? '+' : '−'}
        {tx.amount}
      </span>
    </button>
  );
}

const ACTION_GRID: {
  action: WalletAction | 'moneyMap' | 'receipts';
  label: string;
  icon: React.ReactNode;
}[] = [
  { action: 'convert', label: 'Convert', icon: <RefreshCw className="w-5 h-5" /> },
  { action: 'pay', label: 'Pay', icon: <CreditCard className="w-5 h-5" /> },
  { action: 'withdraw', label: 'Withdraw', icon: <ArrowUpRight className="w-5 h-5" /> },
  { action: 'tip', label: 'Tip', icon: <Heart className="w-5 h-5" /> },
  { action: 'moneyMap', label: 'Money Map', icon: <Map className="w-5 h-5" /> },
  { action: 'receipts', label: 'Receipts', icon: <Receipt className="w-5 h-5" /> },
];

export const DemoWallet: React.FC = () => {
  const {
    state,
    setWalletAction,
    openReceipt,
    openMoneyMap,
    goToStep,
    restartDemoToFeed,
  } = useDemoState();

  const { walletTab, transactions } = state;

  const latestTx = transactions[0] ?? null;

  const filteredTx = (() => {
    switch (walletTab) {
      case 'available':
        return transactions.filter(
          (t) =>
            t.coinType === 'icoin' &&
            (t.type === 'convert' || t.type === 'earned') &&
            t.direction === 'in',
        );
      case 'pending':
        return transactions.filter((t) => t.status === 'pending-review');
      case 'earned':
        return transactions.filter((t) => t.type === 'earned');
      case 'sent':
        return transactions.filter(
          (t) =>
            t.type === 'pay' ||
            t.type === 'tip' ||
            t.type === 'withdraw' ||
            t.type === 'clickEarn',
        );
      case 'review':
        return transactions.filter(
          (t) =>
            t.status === 'review-preview' || t.status === 'pending-review',
        );
      default:
        return transactions;
    }
  })();

  const handleAction = (action: WalletAction | 'moneyMap' | 'receipts') => {
    if (action === 'moneyMap') {
      openMoneyMap();
      return;
    }
    if (action === 'receipts') {
      if (latestTx) openReceipt(latestTx.id);
      else goToStep('receipt');
      return;
    }
    setWalletAction(action);
  };

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-4 demo-animate-fade-up">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Wallet</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Simulated value layers and routing previews.
          </p>
        </header>

        <DemoWalletTabs />

        {walletTab === 'overview' && (
          <div className="space-y-4 demo-animate-fade-up">
            {/* Balances */}
            <div className="grid grid-cols-2 gap-3">
              <div className="demo-glass-card demo-glow-ring p-4">
                <p className="text-xs text-muted-foreground mb-1">ACoins</p>
                <p className="font-display text-2xl font-bold gradient-text">
                  {state.walletBalance}
                </p>
                {state.pendingAcoins > 0 && (
                  <p className="text-xs text-amber-400 mt-1">
                    +{state.pendingAcoins} pending review
                  </p>
                )}
              </div>
              <div className="demo-glass-card p-4">
                <p className="text-xs text-muted-foreground mb-1">iCoins</p>
                <p className="font-display text-2xl font-bold gradient-text-gold">
                  {state.icoinBalance}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Usable balance</p>
              </div>
            </div>

            {state.earnedThisSession > 0 && (
              <div className="demo-glass-card p-3 flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-green-400" />
                <span className="text-sm">
                  <span className="font-semibold text-green-400">
                    +{state.earnedThisSession}
                  </span>{' '}
                  earned this session
                </span>
              </div>
            )}

            {/* ACoins / iCoins explanation */}
            <div className="demo-glass-card p-4 space-y-3">
              <h3 className="text-sm font-semibold">Value layers</h3>
              <div className="flex gap-3">
                <span className="demo-coin-badge demo-coin-acoin text-xs flex-shrink-0">A</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ACOIN_EXPLANATION}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="demo-coin-badge demo-coin-icoin text-xs flex-shrink-0">i</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ICOIN_EXPLANATION}
                </p>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed border-t border-white/10 pt-3">
                {VALUE_FLOW_EXPLANATION}
              </p>
            </div>

            {/* Latest transaction */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Latest activity
              </h2>
              {latestTx ? (
                <TransactionRow tx={latestTx} onOpen={openReceipt} />
              ) : (
                <div className="demo-glass-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Complete the earn flow to see your first transaction.
                  </p>
                </div>
              )}
            </section>

            {/* Action grid */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                Actions
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {ACTION_GRID.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleAction(item.action)}
                    className="demo-glass-card p-3 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
                  >
                    <span className="text-primary">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {walletTab === 'available' && (
          <div className="space-y-4 demo-animate-fade-up">
            <div className="demo-glass-card demo-glow-ring p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Usable iCoins</p>
              <p className="font-display text-4xl font-bold gradient-text-gold">
                {state.icoinBalance}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Available for pay, tip, and withdraw previews
              </p>
            </div>
            <div className="demo-glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Verified ACoins</p>
              <p className="font-display text-xl font-bold gradient-text">
                {state.walletBalance}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Convert to iCoins via action preview
              </p>
            </div>
            {filteredTx.length > 0 && (
              <TxList txs={filteredTx} onOpen={openReceipt} emptyLabel="" />
            )}
          </div>
        )}

        {walletTab === 'pending' && (
          <div className="space-y-4 demo-animate-fade-up">
            <div className="demo-glass-card p-5 flex items-center gap-4">
              <Clock className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-semibold">{state.pendingAcoins} ACoins</p>
                <p className="text-xs text-muted-foreground">
                  Awaiting review before verified credit
                </p>
              </div>
            </div>
            <TxList
              txs={filteredTx}
              onOpen={openReceipt}
              emptyLabel="No pending items — earn from the feed to see review queue."
            />
          </div>
        )}

        {walletTab === 'earned' && (
          <TxList
            txs={filteredTx}
            onOpen={openReceipt}
            emptyLabel="No earned transactions yet."
          />
        )}

        {walletTab === 'sent' && (
          <TxList
            txs={filteredTx}
            onOpen={openReceipt}
            emptyLabel="No sent transactions — try Pay, Tip, or Click-and-Earn."
          />
        )}

        {walletTab === 'review' && (
          <div className="space-y-4 demo-animate-fade-up">
            <div className="demo-glass-card p-4 flex items-start gap-3">
              <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review queue shows attention rewards and withdrawal previews awaiting
                simulated approval. No real settlement occurs.
              </p>
            </div>
            <TxList
              txs={filteredTx}
              onOpen={openReceipt}
              emptyLabel="Nothing in review — withdraw preview or earn ACoins to populate."
            />
          </div>
        )}

        <div className="demo-glass-card p-4 border border-muted/30 mt-6 mb-2">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {WALLET_DISCLAIMER}
          </p>
        </div>

        <DemoRestartControl onRestart={restartDemoToFeed} variant="footer" className="mt-3 mb-2" />
      </div>

      <DemoActionSheet />
    </DemoShell>
  );
};

function TxList({
  txs,
  onOpen,
  emptyLabel,
}: {
  txs: DemoTransaction[];
  onOpen: (id: string) => void;
  emptyLabel: string;
}) {
  if (txs.length === 0 && emptyLabel) {
    return (
      <div className="demo-glass-card p-6 text-center">
        <Send className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }
  if (txs.length === 0) return null;
  return (
    <div className="space-y-2">
      {txs.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} onOpen={onOpen} />
      ))}
    </div>
  );
}
