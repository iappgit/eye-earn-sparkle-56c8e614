import React from 'react';
import { cn } from '@/lib/utils';

interface NeuButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent' | 'gold';
  isPressed?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

export const NeuButton: React.FC<NeuButtonProps> = ({
  children,
  onClick,
  className,
  size = 'md',
  variant = 'default',
  isPressed = false,
}) => {
  const [pressed, setPressed] = React.useState(false);

  const handlePress = () => {
    setPressed(true);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleRelease = () => {
    setPressed(false);
    onClick?.();
  };

  const accentStyles = variant === 'accent' 
    ? 'text-primary border border-primary/20' 
    : variant === 'gold' 
    ? 'text-icoin border border-icoin/20' 
    : 'text-foreground';

  return (
    <button
      className={cn(
        'rounded-2xl flex items-center justify-center transition-all duration-200',
        sizeClasses[size],
        pressed || isPressed ? 'neu-inset scale-95' : 'neu-button',
        accentStyles,
        className
      )}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
    >
      {children}
    </button>
  );
};
