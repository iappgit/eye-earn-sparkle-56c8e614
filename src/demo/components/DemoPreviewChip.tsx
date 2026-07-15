import React from 'react';
import { cn } from '@/lib/utils';
import { useDemoRecording } from '../demoRecordingContext';

interface DemoPreviewChipProps {
  label?: string;
  className?: string;
}

export const DemoPreviewChip: React.FC<DemoPreviewChipProps> = ({
  label = 'Preview only',
  className,
}) => {
  const { hidePreviewChips } = useDemoRecording();
  if (hidePreviewChips) return null;

  return <span className={cn('demo-preview-chip', className)}>{label}</span>;
};
