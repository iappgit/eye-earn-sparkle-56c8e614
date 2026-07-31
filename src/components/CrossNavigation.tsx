import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right';

interface CrossNavigationProps {
  onNavigate: (direction: Direction) => void;
  labels?: {
    up?: string;
    down?: string;
    left?: string;
    right?: string;
  };
  activeDirection?: Direction | null;
}

export const CrossNavigation: React.FC<CrossNavigationProps> = ({
  onNavigate,
  labels = {
    up: 'Previous',
    down: 'Next',
    left: 'Friends',
    right: 'Promos',
  },
  activeDirection,
}) => {
  const [visibleDirection, setVisibleDirection] = useState<Direction | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show the direction indicator briefly when activeDirection changes
  useEffect(() => {
    if (activeDirection) {
      setVisibleDirection(activeDirection);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeDirection]);

  // Clear visible direction after fade-out animation completes
  useEffect(() => {
    if (!isAnimating && visibleDirection) {
      const timer = setTimeout(() => {
        setVisibleDirection(null);
      }, 300); // Match fade-out duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating, visibleDirection]);

  const handleClick = useCallback((direction: Direction) => {
    setVisibleDirection(direction);
    setIsAnimating(true);
    onNavigate(direction);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [onNavigate]);

  const baseClasses = "fixed z-40 flex items-center gap-2 transition-all duration-300 pointer-events-auto";
  const visibleClasses = "opacity-80 scale-100";
  const hiddenClasses = "opacity-0 scale-75 pointer-events-none";

  return (
    <>
      {/* Top indicator */}
      <button
        onClick={() => handleClick('up')}
        className={cn(
          baseClasses,
          "top-20 left-1/2 -translate-x-1/2 flex-col",
          visibleDirection === 'up' && isAnimating ? visibleClasses : hiddenClasses
        )}
      >
        <ChevronUp className="w-5 h-5 text-primary/80" />
        <span className="text-[11px] font-medium tracking-wide text-foreground/90 bg-background/60 backdrop-blur-md px-2.5 py-[3px] rounded-full">
          {labels.up}
        </span>
      </button>

      {/* Bottom indicator */}
      <button
        onClick={() => handleClick('down')}
        className={cn(
          baseClasses,
          "bottom-36 left-1/2 -translate-x-1/2 flex-col-reverse",
          visibleDirection === 'down' && isAnimating ? visibleClasses : hiddenClasses
        )}
      >
        <ChevronDown className="w-5 h-5 text-primary/80" />
        <span className="text-[11px] font-medium tracking-wide text-foreground/90 bg-background/60 backdrop-blur-md px-2.5 py-[3px] rounded-full">
          {labels.down}
        </span>
      </button>

      {/* Left indicator */}
      <button
        onClick={() => handleClick('left')}
        className={cn(
          baseClasses,
          "left-2 sm:left-6 top-1/2 -translate-y-1/2",
          visibleDirection === 'left' && isAnimating ? visibleClasses : hiddenClasses
        )}
      >
        <ChevronLeft className="w-5 h-5 text-primary/80" />
        <span className="text-[11px] font-medium tracking-wide text-foreground/90 bg-background/60 backdrop-blur-md px-2.5 py-[3px] rounded-full">
          {labels.left}
        </span>
      </button>

      {/* Right indicator */}
      <button
        onClick={() => handleClick('right')}
        className={cn(
          baseClasses,
          "right-2 sm:right-6 top-1/2 -translate-y-1/2",
          visibleDirection === 'right' && isAnimating ? visibleClasses : hiddenClasses
        )}
      >
        <span className="text-[11px] font-medium tracking-wide text-foreground/90 bg-background/60 backdrop-blur-md px-2.5 py-[3px] rounded-full">
          {labels.right}
        </span>
        <ChevronRight className="w-5 h-5 text-primary/80" />
      </button>
    </>
  );
};
