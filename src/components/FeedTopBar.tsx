import React from 'react';
import { Info, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useControlsVisibility } from './FloatingControls';
import { useNotifications } from '@/hooks/useNotifications';

interface FeedTopBarProps {
  /** Total spendable balance shown in the gold pill */
  balance: number;
  onInfoClick?: () => void;
  onBalanceClick?: () => void;
  onNotificationsClick?: () => void;
}

/**
 * Minimal feed header: small info button (left), gold balance pill (center),
 * notification button (right). Auto-hides with the rest of the feed chrome.
 */
export const FeedTopBar: React.FC<FeedTopBarProps> = ({
  balance,
  onInfoClick,
  onBalanceClick,
  onNotificationsClick,
}) => {
  const { isVisible } = useControlsVisibility();
  const { unreadCount } = useNotifications();

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 flex items-center justify-between px-4',
        'top-[max(0.75rem,env(safe-area-inset-top,0px))]',
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      {/* Info */}
      <button
        type="button"
        onClick={onInfoClick}
        aria-label="About Eye Rewards"
        className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="w-[18px] h-[18px]" strokeWidth={1.75} />
      </button>

      {/* Gold balance pill */}
      <button
        type="button"
        onClick={onBalanceClick}
        aria-label="Open wallet"
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-1.5',
          'bg-icoin/15 border border-icoin/40 backdrop-blur-md',
          'shadow-[0_0_18px_hsl(var(--icoin)/0.25)] transition-transform active:scale-95'
        )}
      >
        <span className="w-4 h-4 rounded-full bg-icoin text-background text-[10px] font-bold flex items-center justify-center">
          i
        </span>
        <span className="text-[13px] font-semibold tabular-nums text-icoin">
          {balance.toLocaleString()}
        </span>
      </button>

      {/* Notifications */}
      <button
        type="button"
        onClick={onNotificationsClick}
        aria-label="Notifications"
        className="relative w-9 h-9 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
