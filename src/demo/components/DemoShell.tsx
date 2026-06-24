import React from 'react';
import { cn } from '@/lib/utils';
import { DEMO_DISCLAIMER } from '../demoData';
import { DemoBottomNav } from './DemoBottomNav';

interface DemoShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  showDisclaimer?: boolean;
  className?: string;
  contentClassName?: string;
}

export const DemoShell: React.FC<DemoShellProps> = ({
  children,
  showNav = false,
  showDisclaimer = true,
  className,
  contentClassName,
}) => {
  return (
    <div className={cn('demo-root flex flex-col', className)}>
      <main
        className={cn(
          'flex-1 w-full max-w-lg mx-auto overflow-y-auto overflow-x-hidden',
          showNav ? 'demo-safe-pad-nav' : 'demo-safe-pad',
          contentClassName,
        )}
      >
        {children}
      </main>

      {showDisclaimer && !showNav && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <p className="demo-disclaimer pb-3">{DEMO_DISCLAIMER}</p>
        </div>
      )}

      {showNav && <DemoBottomNav />}
    </div>
  );
};
