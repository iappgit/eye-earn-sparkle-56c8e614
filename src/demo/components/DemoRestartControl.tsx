import React from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESTART_DEMO_LABEL } from '../demoData';

interface DemoRestartControlProps {
  onRestart: () => void;
  variant?: 'inline' | 'footer';
  className?: string;
}

export const DemoRestartControl: React.FC<DemoRestartControlProps> = ({
  onRestart,
  variant = 'inline',
  className,
}) => (
  <button
    type="button"
    onClick={onRestart}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary',
      variant === 'footer'
        ? 'w-full py-3 text-xs bg-white/5'
        : 'px-4 py-2.5 text-sm demo-glass-card',
      className,
    )}
  >
    <RotateCcw className="w-4 h-4 flex-shrink-0" />
    {RESTART_DEMO_LABEL}
  </button>
);
