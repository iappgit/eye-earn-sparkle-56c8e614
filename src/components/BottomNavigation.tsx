import React, { useState, useRef, useCallback } from 'react';
import { Home, Compass, MessageCircle, User, Plus, Zap, Settings, Bookmark, Bell, Wallet, ArrowDownUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useControlsVisibility } from './FloatingControls';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  isPrimary?: boolean;
  shortcuts?: { label: string; icon: React.ReactNode; action: () => void }[];
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  const { isVisible } = useControlsVisibility();
  const navigate = useNavigate();
  const haptic = useHapticFeedback();
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const navItems: NavItem[] = [
    {
      id: 'feed',
      icon: <Home className="w-[22px] h-[22px]" strokeWidth={1.75} />,
      label: 'Feed',
      shortcuts: [
        { label: 'Refresh', icon: <Zap className="w-4 h-4" />, action: () => window.location.reload() },
        { label: 'Messages', icon: <MessageCircle className="w-4 h-4" />, action: () => onTabChange('messages') },
        { label: 'Saved', icon: <Bookmark className="w-4 h-4" />, action: () => onTabChange('bookmarks') },
      ],
    },
    {
      id: 'explore',
      icon: <Compass className="w-[22px] h-[22px]" strokeWidth={1.75} />,
      label: 'Explore',
      shortcuts: [
        { label: 'Near Me', icon: <Compass className="w-4 h-4" />, action: () => onTabChange('explore') },
      ],
    },
    { id: 'create', icon: <Plus className="w-6 h-6" strokeWidth={2.25} />, label: '+', isPrimary: true },
    {
      id: 'wallet',
      icon: <Wallet className="w-[22px] h-[22px]" strokeWidth={1.75} />,
      label: 'Wallet',
      shortcuts: [
        { label: 'Transfer', icon: <ArrowDownUp className="w-4 h-4" />, action: () => navigate('/my-page?tab=wallet') },
      ],
    },
    {
      id: 'profile',
      icon: <User className="w-[22px] h-[22px]" strokeWidth={1.75} />,
      label: 'Profile',
      shortcuts: [
        { label: 'Settings', icon: <Settings className="w-4 h-4" />, action: () => navigate('/my-page?tab=settings') },
        { label: 'Notifications', icon: <Bell className="w-4 h-4" />, action: () => onTabChange('notifications') },
      ],
    },
  ];

  const handleLongPressStart = useCallback((itemId: string) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      haptic.medium();
      setActiveShortcut(itemId);
    }, 500);
  }, [haptic]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleShortcutSelect = useCallback((action: () => void) => {
    haptic.light();
    action();
    setActiveShortcut(null);
  }, [haptic]);

  const handleClick = useCallback((item: NavItem) => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    haptic.light();
    if (item.id === 'create') {
      navigate('/create');
    } else if (item.id === 'profile') {
      navigate('/my-page');
    } else {
      onTabChange(item.id);
    }
  }, [navigate, onTabChange, haptic]);

  return (
    <>
      {/* Shortcut popup overlay */}
      {activeShortcut && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveShortcut(null)}
        />
      )}

      <nav className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        'bottom-[max(1.25rem,env(safe-area-inset-bottom,6px))]',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none',
        className
      )}>
        <div className="glass-neon rounded-full px-2.5 py-1.5 flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleClick(item)}
                  onTouchStart={() => handleLongPressStart(item.id)}
                  onTouchEnd={handleLongPressEnd}
                  onMouseDown={() => handleLongPressStart(item.id)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  aria-label={item.id === 'create' ? 'Create' : item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center justify-center gap-[3px] rounded-full transition-all duration-200',
                    'min-w-[52px] min-h-[46px] px-2.5 py-1.5',
                    item.isPrimary
                      ? 'bg-primary/25 neon-border text-primary'
                      : isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-primary/10'
                  )}
                >
                  <span className={cn(
                    'transition-all duration-200',
                    isActive && !item.isPrimary && 'drop-shadow-[0_0_8px_hsl(270_95%_65%/0.8)]'
                  )}>
                    {item.icon}
                  </span>
                  <span className={cn(
                    'text-[9px] font-medium leading-none tracking-wide',
                    item.isPrimary && 'sr-only'
                  )}>
                    {item.label}
                  </span>
                </button>

                {/* Shortcuts popup */}
                {activeShortcut === item.id && item.shortcuts && (
                  <div className={cn(
                    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                    'glass-card rounded-xl p-2 min-w-[130px]',
                    'animate-scale-in origin-bottom'
                  )}>
                    {item.shortcuts.map((shortcut, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleShortcutSelect(shortcut.action)}
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-2 rounded-lg',
                          'text-sm text-foreground hover:bg-primary/10 transition-colors'
                        )}
                      >
                        {shortcut.icon}
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
};
