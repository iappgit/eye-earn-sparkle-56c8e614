import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, CreditCard, Building2 } from 'lucide-react';
import { NeuButton } from './NeuButton';
import { CoinDisplay } from './CoinDisplay';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'received' | 'sent';
  amount: number;
  coinType: 'vicoin' | 'icoin';
  description: string;
  timestamp: Date;
}

interface WalletScreenProps {
  isOpen: boolean;
  onClose: () => void;
  vicoins: number;
  icoins: number;
  transactions: Transaction[];
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  isOpen,
  onClose,
  vicoins,
  icoins,
  transactions,
}) => {
  if (!isOpen) return null;

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'earned':
      case 'received':
        return <ArrowDownLeft className="w-4 h-4 text-primary" />;
      case 'spent':
      case 'sent':
        return <ArrowUpRight className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg animate-slide-up">
      <div className="max-w-md mx-auto h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">Wallet</h1>
          <NeuButton onClick={onClose} size="sm">
            <X className="w-5 h-5" />
          </NeuButton>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="neu-card rounded-3xl p-5">
            <CoinDisplay type="vicoin" amount={vicoins} size="lg" />
          </div>
          <div className="neu-card rounded-3xl p-5">
            <CoinDisplay type="icoin" amount={icoins} size="lg" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 neu-button rounded-2xl py-4 flex flex-col items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Withdraw</span>
          </button>
          <button className="flex-1 neu-button rounded-2xl py-4 flex flex-col items-center gap-2">
            <Building2 className="w-6 h-6 text-icoin" />
            <span className="text-sm font-medium">Transfer</span>
          </button>
        </div>

        {/* Transactions */}
        <div className="flex-1 overflow-hidden">
          <h2 className="font-display text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 p-4 neu-inset rounded-2xl">
                <div className="w-10 h-10 rounded-full neu-button flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <div className={cn(
                  'font-display font-semibold',
                  tx.type === 'earned' || tx.type === 'received' ? 'text-primary' : 'text-destructive'
                )}>
                  {tx.type === 'earned' || tx.type === 'received' ? '+' : '-'}
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
