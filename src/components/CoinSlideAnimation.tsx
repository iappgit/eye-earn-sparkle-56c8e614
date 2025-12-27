import React from 'react';
import { cn } from '@/lib/utils';

interface CoinSlideAnimationProps {
  type: 'vicoin' | 'icoin';
  isAnimating: boolean;
  onComplete?: () => void;
}

export const CoinSlideAnimation: React.FC<CoinSlideAnimationProps> = ({
  type,
  isAnimating,
  onComplete,
}) => {
  React.useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onComplete]);

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {/* Coin that slides from center-right toward bottom wallet */}
      <div
        className={cn(
          'absolute w-12 h-12 rounded-full flex items-center justify-center',
          'animate-slide-to-wallet',
          type === 'vicoin' 
            ? 'bg-gradient-to-br from-primary to-primary/70' 
            : 'bg-gradient-to-br from-icoin to-yellow-600'
        )}
        style={{
          top: '50%',
          right: '24px',
        }}
      >
        <span className="font-display font-bold text-lg text-primary-foreground">
          {type === 'vicoin' ? 'V' : 'I'}
        </span>
      </div>

      {/* Sparkle trail effect */}
      <div className="absolute top-1/2 right-6 w-1 h-1 bg-primary/50 rounded-full animate-sparkle-1" />
      <div className="absolute top-1/2 right-10 w-1 h-1 bg-primary/30 rounded-full animate-sparkle-2" />
      <div className="absolute top-1/2 right-14 w-1 h-1 bg-primary/20 rounded-full animate-sparkle-3" />
    </div>
  );
};
