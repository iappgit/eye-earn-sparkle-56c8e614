import React from 'react';
import { ArrowLeft, Map, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { WALLET_DISCLAIMER, getStatusLabel } from '../demoData';

export const DemoReceipt: React.FC = () => {
  const { state, goToStep, setNavTab, openMoneyMap, selectReceipt } = useDemoState();

  const tx = state.selectedReceiptId
    ? state.transactions.find((t) => t.id === state.selectedReceiptId)
    : null;

  const handleBack = () => {
    selectReceipt(null);
    goToStep('wallet');
    setNavTab('wallet');
  };

  if (!tx) {
    return (
      <DemoShell showNav>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center">
          <Receipt className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">No receipt selected.</p>
          <button type="button" className="demo-cta max-w-xs" onClick={handleBack}>
            Back to wallet
          </button>
        </div>
      </DemoShell>
    );
  }

  const isIn = tx.direction === 'in';

  return (
    <DemoShell showDisclaimer>
      <div
        className="px-4 pt-4 pb-28"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-5 hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to wallet
        </button>

        <div className="demo-animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl demo-glass-card demo-glow-ring flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-xl font-bold mb-1">Receipt preview</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {tx.type} · {getStatusLabel(tx.status)}
            </p>
          </div>

          <div className="demo-glass-card p-5 mb-4 space-y-4">
            <div className="text-center pb-4 border-b border-white/10">
              <p
                className={cn(
                  'font-display text-4xl font-bold',
                  tx.coinType === 'acoin' ? 'gradient-text' : 'gradient-text-gold',
                )}
              >
                {isIn ? '+' : '−'}
                {tx.amount}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {tx.coinType === 'acoin' ? 'ACoins' : 'iCoins'}
              </p>
            </div>

            <ReceiptRow label="Type" value={tx.type} />
            <ReceiptRow label="Direction" value={isIn ? 'Incoming' : 'Outgoing'} />
            <ReceiptRow label="Status" value={getStatusLabel(tx.status)} />
            <ReceiptRow label="Transaction ID" value={tx.simulatedId} mono />
            <ReceiptRow label="Timestamp" value={tx.timestamp} />
            <ReceiptRow label="Route" value={tx.route} />
            {tx.copy && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-muted-foreground leading-relaxed">{tx.copy}</p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium text-center mb-6">{tx.label}</p>

          <div className="demo-glass-card p-4 border border-muted/30 mb-4">
            <p className="text-xs text-muted-foreground leading-relaxed text-center">
              {WALLET_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      <div
        className="demo-sticky-footer space-y-2"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button type="button" className="demo-cta max-w-lg mx-auto" onClick={handleBack}>
          Back to wallet
        </button>
        <button
          type="button"
          className="demo-cta demo-cta-secondary max-w-lg mx-auto flex items-center gap-2"
          onClick={openMoneyMap}
        >
          <Map className="w-4 h-4" />
          Open Money Movement Map
        </button>
      </div>
    </DemoShell>
  );
};

function ReceiptRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground flex-shrink-0">{label}</span>
      <span className={cn('text-right font-medium break-all', mono && 'font-mono text-xs')}>
        {value}
      </span>
    </div>
  );
}
