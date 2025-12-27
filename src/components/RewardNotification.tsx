import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RewardNotificationProps {
  amount: number;
  type: 'vicoin' | 'icoin';
  isVisible: boolean;
  onComplete?: () => void;
}

export const RewardNotification: React.FC<RewardNotificationProps> = ({
  amount,
  type,
  isVisible,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'show' | 'slide' | 'hidden'>('hidden');

  useEffect(() => {
    if (isVisible) {
      setPhase('show');
      const slideTimer = setTimeout(() => {
        setPhase('slide');
      }, 3000);

      const hideTimer = setTimeout(() => {
        setPhase('hidden');
        onComplete?.();
      }, 4000);

      return () => {
        clearTimeout(slideTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible, onComplete]);

  if (phase === 'hidden') return null;

  return (
    <div
      className={cn(
        'fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl neu-card',
        phase === 'show' && 'animate-float-in',
        phase === 'slide' && 'animate-coin-slide'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center animate-coin-pulse',
        type === 'vicoin' 
          ? 'bg-gradient-to-br from-primary to-primary/70' 
          : 'bg-gradient-to-br from-icoin to-yellow-600'
      )}>
        <span className="font-display font-bold text-primary-foreground">
          {type === 'vicoin' ? 'V' : 'I'}
        </span>
      </div>
      <div className="flex flex-col">
        <span className={cn(
          'font-display font-bold text-xl',
          type === 'vicoin' ? 'gradient-text' : 'gradient-text-gold'
        )}>
          +{amount}
        </span>
        <span className="text-xs text-muted-foreground">
          {type === 'vicoin' ? 'Vicoins earned' : 'Icoins earned'}
        </span>
      </div>
    </div>
  );
};
