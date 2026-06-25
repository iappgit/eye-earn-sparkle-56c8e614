import React from 'react';
import { cn } from '@/lib/utils';

interface DemoPreviewChipProps {
  label?: string;
  className?: string;
}

export const DemoPreviewChip: React.FC<DemoPreviewChipProps> = ({
  label = 'Preview only',
  className,
}) => (
  <span className={cn('demo-preview-chip', className)}>{label}</span>
);
