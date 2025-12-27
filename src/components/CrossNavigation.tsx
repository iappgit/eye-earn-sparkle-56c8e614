import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrossNavigationProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  labels?: {
    up?: string;
    down?: string;
    left?: string;
    right?: string;
  };
  isVisible?: boolean;
}

export const CrossNavigation: React.FC<CrossNavigationProps> = ({
  onNavigate,
  labels = {
    up: 'Previous',
    down: 'Next',
    left: 'Friends',
    right: 'Promos',
  },
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Top indicator */}
      <button
        onClick={() => onNavigate('up')}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
      >
        <ChevronUp className="w-6 h-6 text-foreground animate-bounce" />
        <span className="text-xs text-muted-foreground">{labels.up}</span>
      </button>

      {/* Bottom indicator */}
      <button
        onClick={() => onNavigate('down')}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="text-xs text-muted-foreground">{labels.down}</span>
        <ChevronDown className="w-6 h-6 text-foreground animate-bounce" />
      </button>

      {/* Left indicator */}
      <button
        onClick={() => onNavigate('left')}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
        <span className="text-xs text-muted-foreground writing-vertical">{labels.left}</span>
      </button>

      {/* Right indicator - hidden when controls visible */}
      <button
        onClick={() => onNavigate('right')}
        className="fixed right-24 top-1/2 -translate-y-1/2 z-35 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="text-xs text-muted-foreground">{labels.right}</span>
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>
    </>
  );
};
