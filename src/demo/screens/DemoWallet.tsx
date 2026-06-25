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
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoWalletTabs } from '../components/DemoWalletTabs';
import { DemoActionSheet } from '../components/DemoActionSheet';
import { DemoRestartControl } from '../components/DemoRestartControl';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import {
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
      className="demo-glass-card w-full p-3 flex items-center gap-3 text-left hover:border-primary/30 transition-colors min-h-[3.25rem]"
    >
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold',
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
  hint?: string;
  icon: React.ReactNode;
}[] = [
  {
    action: 'convert',
    label: 'Convert',
    hint: 'Approved A',
    icon: <RefreshCw className="w-5 h-5" />,
  },
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
    restartDemoToFeed,
    approvePendingAcoins,
  } = useDemoState();

  const { walletTab, transactions } = state;

  const latestTx = transactions[0] ?? null;
  const hasTransactions = transactions.length > 0;

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
        <header className="mb-3 demo-animate-fade-up">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <Wallet className="w-6 h-6 text-primary flex-shrink-0" />
              <h1 className="font-display text-2xl font-bold truncate">Wallet</h1>
            </div>
            <DemoPreviewChip />
          </div>
          <p className="text-xs text-muted-foreground">
            Pending → Approved → Available iCoins
          </p>
        </header>

        <DemoWalletTabs />

        {walletTab === 'overview' && (
          <div className="space-y-3 demo-animate-fade-up">
            <div className="demo-glass-card demo-glow-ring p-3">
              <div className="demo-ledger-strip">
                <div className="demo-ledger-cell">
                  <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wide">
                    Pending
                  </p>
                  <p className="font-display text-lg font-bold gradient-text leading-tight mt-0.5">
                    {state.pendingAcoins}
                  </p>
                  <p className="text-[0.55rem] text-muted-foreground mt-0.5">ACoins</p>
                </div>
                <div className="demo-ledger-cell">
                  <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wide">
                    Approved
                  </p>
                  <p className="font-display text-lg font-bold gradient-text leading-tight mt-0.5">
                    {state.approvedAcoins}
                  </p>
                  <p className="text-[0.55rem] text-muted-foreground mt-0.5">ACoins</p>
                </div>
                <div className="demo-ledger-cell">
                  <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wide">
                    Available
                  </p>
                  <p className="font-display text-lg font-bold gradient-text-gold leading-tight mt-0.5">
                    {state.icoinBalance}
                  </p>
                  <p className="text-[0.55rem] text-muted-foreground mt-0.5">iCoins</p>
                </div>
              </div>
            </div>

            {state.earnedThisSession > 0 && (
              <div className="demo-glass-card p-2.5 flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-xs">
                  <span className="font-semibold text-green-400">
                    +{state.earnedThisSession}
                  </span>{' '}
                  earned this session
                </span>
              </div>
            )}

            <details className="demo-glass-card demo-collapsible p-3">
              <summary className="text-sm font-semibold flex items-center justify-between gap-2">
                How value moves
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </summary>
              <div className="mt-3 space-y-2.5 pt-2 border-t border-white/10">
                <div className="flex gap-2">
                  <span className="demo-coin-badge demo-coin-acoin text-[0.6rem] min-w-[1.75rem] h-[1.75rem] flex-shrink-0">
                    A
                  </span>
                  <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
                    {ACOIN_EXPLANATION}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="demo-coin-badge demo-coin-icoin text-[0.6rem] min-w-[1.75rem] h-[1.75rem] flex-shrink-0">
                    i
                  </span>
                  <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
                    {ICOIN_EXPLANATION}
                  </p>
                </div>
                <p className="text-[0.65rem] text-foreground/70 leading-relaxed">
                  {VALUE_FLOW_EXPLANATION}
                </p>
              </div>
            </details>

            <section>
              <h2 className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Latest activity
              </h2>
              {latestTx ? (
                <TransactionRow tx={latestTx} onOpen={openReceipt} />
              ) : (
                <div className="demo-glass-card p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Complete the earn flow to see your first transaction.
                  </p>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Actions
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {ACTION_GRID.map((item) => {
                  const isReceipts = item.action === 'receipts';
                  const disabled = isReceipts && !hasTransactions;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleAction(item.action)}
                      disabled={disabled}
                      className={cn(
                        'demo-glass-card p-2.5 flex flex-col items-center gap-1 hover:border-primary/30 transition-colors min-h-[4.25rem]',
                        disabled && 'opacity-40 cursor-not-allowed hover:border-transparent',
                      )}
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span className="text-[0.65rem] font-medium text-center leading-tight">
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="text-[0.55rem] text-muted-foreground">{item.hint}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!hasTransactions && (
                <p className="text-[0.65rem] text-muted-foreground text-center mt-2 px-2">
                  No receipts yet. Complete an earning, pay, tip, or Click-and-Earn preview first.
                </p>
              )}
            </section>
          </div>
        )}

        {walletTab === 'available' && (
          <div className="space-y-3 demo-animate-fade-up">
            <div className="demo-glass-card demo-glow-ring p-4 text-center">
              <p className="text-[0.65rem] text-muted-foreground mb-1 uppercase tracking-wide">
                Available iCoins
              </p>
              <p className="font-display text-4xl font-bold gradient-text-gold">
                {state.icoinBalance}
              </p>
            </div>
            <div className="demo-glass-card p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.65rem] text-muted-foreground">Approved ACoins</p>
                <p className="font-display text-xl font-bold gradient-text">
                  {state.approvedAcoins}
                </p>
              </div>
              <button
                type="button"
                className="demo-route-chip"
                onClick={() => setWalletAction('convert')}
              >
                Convert → iCoins
              </button>
            </div>
            {filteredTx.length > 0 && (
              <TxList txs={filteredTx} onOpen={openReceipt} emptyLabel="" />
            )}
          </div>
        )}

        {walletTab === 'pending' && (
          <div className="space-y-3 demo-animate-fade-up">
            <div className="demo-glass-card p-4 flex items-center gap-3">
              <Clock className="w-7 h-7 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">{state.pendingAcoins} Pending ACoins</p>
                <p className="text-xs text-muted-foreground">
                  Approve in Review tab before convert
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
          <div className="space-y-3 demo-animate-fade-up">
            {state.pendingAcoins > 0 ? (
              <button
                type="button"
                className="demo-cta w-full !min-h-11 text-sm demo-glow-ring"
                onClick={approvePendingAcoins}
              >
                Approve {state.pendingAcoins} pending ACoins
              </button>
            ) : (
              <div className="demo-glass-card p-3 flex items-start gap-2">
                <Eye className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Earn ACoins from the feed to populate the review queue.
                </p>
              </div>
            )}
            <TxList
              txs={filteredTx}
              onOpen={openReceipt}
              emptyLabel="Nothing in review — withdraw preview or earn ACoins to populate."
            />
          </div>
        )}

        <DemoRestartControl onRestart={restartDemoToFeed} variant="footer" className="mt-4 mb-2" />
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
      <div className="demo-glass-card p-5 text-center">
        <Send className="w-7 h-7 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-xs text-muted-foreground">{emptyLabel}</p>
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
