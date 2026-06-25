import React from 'react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import type { PlatformId } from '../demoTypes';
import { PLATFORM_META } from '../demoData';
import { DemoPreviewChip } from '../components/DemoPreviewChip';

const PLATFORMS: PlatformId[] = ['youtube', 'tiktok', 'instagram', 'twitch'];

interface DemoPlatformToggleProps {
  compact?: boolean;
}

export const DemoPlatformToggle: React.FC<DemoPlatformToggleProps> = ({
  compact = false,
}) => {
  const { state, togglePlatform } = useDemoState();

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {!compact && (
        <DemoPreviewChip label="Simulated connections" />
      )}
      <div className={cn('grid gap-2', compact ? 'grid-cols-2' : 'grid-cols-2')}>
        {PLATFORMS.map((id) => {
          const meta = PLATFORM_META[id];
          const connected = state.connectedPlatforms[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => togglePlatform(id)}
              className={cn(
                'demo-glass-card p-3 text-left transition-all',
                connected
                  ? 'demo-glow-ring border-primary/30'
                  : 'opacity-50 grayscale-[0.3]',
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="text-sm font-medium">{meta.label}</span>
              </div>
              <p className="text-[0.65rem] text-muted-foreground mt-1">
                {connected ? 'Connected preview' : 'Tap to connect preview'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
