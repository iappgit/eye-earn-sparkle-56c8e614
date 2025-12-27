import React from 'react';
import { cn } from '@/lib/utils';

interface CoinDisplayProps {
  type: 'vicoin' | 'icoin';
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export const CoinDisplay: React.FC<CoinDisplayProps> = ({
  type,
  amount,
  size = 'md',
  showLabel = true,
  animate = false,
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn(
      'flex items-center gap-2',
      animate && 'animate-coin-bounce'
    )}>
      <div className={cn(
        'rounded-full flex items-center justify-center',
        iconSizes[size],
        type === 'vicoin' 
          ? 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground' 
          : 'bg-gradient-to-br from-icoin to-yellow-600 text-primary-foreground',
        animate && 'animate-glow'
      )}>
        <span className="font-display font-bold text-xs">
          {type === 'vicoin' ? 'V' : 'I'}
        </span>
      </div>
      <div className="flex flex-col">
        <span className={cn(
          'font-display font-semibold',
          sizeClasses[size],
          type === 'vicoin' ? 'gradient-text' : 'gradient-text-gold'
        )}>
          {amount.toLocaleString()}
        </span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">
            {type === 'vicoin' ? 'Vicoins' : 'Icoins'}
          </span>
        )}
      </div>
    </div>
  );
};
