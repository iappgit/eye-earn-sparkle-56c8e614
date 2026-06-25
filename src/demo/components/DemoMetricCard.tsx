import React from 'react';
import { cn } from '@/lib/utils';

interface DemoMetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

export const DemoMetricCard: React.FC<DemoMetricCardProps> = ({
  label,
  value,
  sub,
  highlight,
}) => (
  <div
    className={cn(
      'demo-glass-card p-3 text-center',
      highlight && 'demo-glow-ring',
    )}
  >
    <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider mb-1">
      {label}
    </p>
    <p
      className={cn(
        'font-display text-lg font-bold',
        highlight ? 'gradient-text' : 'text-foreground',
      )}
    >
      {value}
    </p>
    {sub && <p className="text-[0.65rem] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);
