import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import type { WalletAction } from '../demoTypes';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import {
  CONVERT_AMOUNT,
  PAY_AMOUNT,
  PAY_MERCHANT,
  TIP_AMOUNT,
  TIP_CREATOR,
  WITHDRAW_AMOUNT,
  WITHDRAW_MIN,
} from '../demoData';

interface ActionConfig {
  title: string;
  description: string;
  amount: number;
  coinLabel: string;
  canConfirm: boolean;
  disabledReason?: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export const DemoActionSheet: React.FC = () => {
  const {
    state,
    setWalletAction,
    confirmConvert,
    confirmPay,
    confirmWithdraw,
    confirmTip,
  } = useDemoState();

  const action = state.activeWalletAction;
  if (!action) return null;

  const configs: Record<WalletAction, ActionConfig> = {
    convert: {
      title: 'Convert preview',
      description:
        'Convert approved ACoins into available iCoins — internal value routing only.',
      amount: CONVERT_AMOUNT,
      coinLabel: `${CONVERT_AMOUNT} ACoins → ${CONVERT_AMOUNT} iCoins`,
      canConfirm: state.approvedAcoins >= CONVERT_AMOUNT,
      disabledReason:
        state.approvedAcoins < CONVERT_AMOUNT
          ? `Need at least ${CONVERT_AMOUNT} approved ACoins`
          : undefined,
      confirmLabel: 'Confirm conversion preview',
      onConfirm: confirmConvert,
    },
    pay: {
      title: 'Pay preview',
      description: `Simulated payment to ${PAY_MERCHANT}. No real merchant or payment processing.`,
      amount: PAY_AMOUNT,
      coinLabel: `${PAY_AMOUNT} iCoins`,
      canConfirm: state.icoinBalance >= PAY_AMOUNT,
      disabledReason:
        state.icoinBalance < PAY_AMOUNT
          ? `Need at least ${PAY_AMOUNT} usable iCoins`
          : undefined,
      confirmLabel: 'Confirm payment preview',
      onConfirm: confirmPay,
    },
    withdraw: {
      title: 'Withdraw preview',
      description:
        'Withdrawal preview routes to review queue. No real banking or settlement.',
      amount: WITHDRAW_AMOUNT,
      coinLabel: `${WITHDRAW_AMOUNT} iCoins`,
      canConfirm: state.icoinBalance >= WITHDRAW_MIN,
      disabledReason:
        state.icoinBalance < WITHDRAW_MIN
          ? `Minimum ${WITHDRAW_MIN} iCoins required for withdraw preview`
          : undefined,
      confirmLabel: 'Submit withdraw preview',
      onConfirm: confirmWithdraw,
    },
    tip: {
      title: 'Tip preview',
      description: `Simulated tip to ${TIP_CREATOR}. No real transfer to creator.`,
      amount: TIP_AMOUNT,
      coinLabel: `${TIP_AMOUNT} iCoins`,
      canConfirm: state.icoinBalance >= TIP_AMOUNT,
      disabledReason:
        state.icoinBalance < TIP_AMOUNT
          ? `Need at least ${TIP_AMOUNT} usable iCoins`
          : undefined,
      confirmLabel: 'Confirm tip preview',
      onConfirm: confirmTip,
    },
  };

  const config = configs[action];

  return (
    <div className="demo-action-overlay" onClick={() => setWalletAction(null)}>
      <div
        className="demo-action-sheet demo-animate-fade-up"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">{config.title}</h2>
          <button
            type="button"
            onClick={() => setWalletAction(null)}
            className="w-9 h-9 rounded-full demo-glass-card flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {config.description}
        </p>

        <div className="demo-glass-card p-4 mb-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Preview amount</p>
          <p className="font-display text-2xl font-bold gradient-text-gold">
            {config.coinLabel}
          </p>
        </div>

        {!config.canConfirm && config.disabledReason && (
          <p className="text-xs text-amber-400/90 mb-3 text-center">
            {config.disabledReason}
          </p>
        )}

        <button
          type="button"
          className="demo-cta mb-2"
          disabled={!config.canConfirm}
          onClick={config.onConfirm}
        >
          {config.confirmLabel}
        </button>

        <button
          type="button"
          className={cn('demo-cta demo-cta-secondary')}
          onClick={() => setWalletAction(null)}
        >
          Cancel
        </button>

        <div className="flex justify-center mt-3">
          <DemoPreviewChip />
        </div>
      </div>
    </div>
  );
};
