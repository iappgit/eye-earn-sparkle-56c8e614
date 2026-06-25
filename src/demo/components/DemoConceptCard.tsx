import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoConceptCardProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  accent?: 'primary' | 'gold' | 'violet';
  onClick: () => void;
  className?: string;
  delay?: string;
}

export const DemoConceptCard: React.FC<DemoConceptCardProps> = ({
  title,
  subtitle,
  icon,
  accent = 'primary',
  onClick,
  className,
  delay,
}) => {
  const accentClass =
    accent === 'gold'
      ? 'border-amber-400/25 demo-concept-gold'
      : accent === 'violet'
        ? 'border-violet-400/25 demo-concept-violet'
        : 'border-primary/25';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'demo-glass-card demo-concept-card w-full text-left p-4 flex gap-3 items-center demo-animate-fade-up',
        accentClass,
        className,
      )}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {icon && (
        <span className="demo-concept-icon flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  );
};
