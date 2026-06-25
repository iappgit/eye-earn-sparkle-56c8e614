import React from 'react';
import { Home, Wallet, PlusCircle, User, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import type { DemoNavTab } from '../demoTypes';
import { DEMO_DISCLAIMER } from '../demoData';

const NAV_ITEMS: { id: DemoNavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'feed', label: 'Feed', icon: <Home className="w-5 h-5" /> },
  { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
  { id: 'create', label: 'Create', icon: <PlusCircle className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'system', label: 'Map', icon: <Layers className="w-5 h-5" /> },
];

export const DemoBottomNav: React.FC = () => {
  const { state, setNavTab } = useDemoState();

  return (
    <nav className="demo-bottom-nav" aria-label="Demo navigation">
      <div className="max-w-lg mx-auto px-2 pt-2 pb-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = state.activeNavTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setNavTab(item.id)}
                className={cn(
                  'flex flex-col items-center gap-0.5 min-w-[3rem] py-1.5 rounded-xl transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full transition-all',
                    isActive && 'bg-primary/15 demo-glow-ring',
                  )}
                >
                  {item.icon}
                </span>
                <span className="text-[0.65rem] font-medium tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="demo-disclaimer mt-2 pb-1">{DEMO_DISCLAIMER}</p>
      </div>
    </nav>
  );
};
