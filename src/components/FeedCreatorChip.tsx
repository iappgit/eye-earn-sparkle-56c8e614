import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useControlsVisibility } from './FloatingControls';

interface FeedCreatorChipProps {
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  title?: string;
  onClick?: () => void;
}

/** Lower-left creator chip on the feed: avatar, handle, and content title. */
export const FeedCreatorChip: React.FC<FeedCreatorChipProps> = ({
  displayName,
  username,
  avatarUrl,
  isVerified,
  title,
  onClick,
}) => {
  const { isVisible } = useControlsVisibility();
  const name = displayName || username || 'Creator';

  return (
    <div
      className={cn(
        'fixed left-4 z-30 max-w-[58%] transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      style={{ bottom: 'calc(104px + env(safe-area-inset-bottom, 0px))' }}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2.5 text-left group"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            loading="lazy"
            className="w-9 h-9 rounded-full object-cover border border-border/60"
          />
        ) : (
          <span className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="min-w-0">
          <span className="flex items-center gap-1">
            <span className="text-[13px] font-semibold text-foreground truncate">
              {username ? `@${username}` : name}
            </span>
            {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
          </span>
          {title && (
            <span className="block text-[12px] leading-snug text-muted-foreground truncate">
              {title}
            </span>
          )}
        </span>
      </button>
    </div>
  );
};
