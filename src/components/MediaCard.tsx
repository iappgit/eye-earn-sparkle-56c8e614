import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Play, Eye, Volume2, VolumeX } from 'lucide-react';
import { RewardBadge } from './RewardBadge';

interface MediaCardProps {
  type: 'video' | 'image' | 'promo';
  src: string;
  videoSrc?: string;
  duration?: number;
  reward?: { amount: number; type: 'vicoin' | 'icoin' };
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isActive?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  type,
  src,
  videoSrc,
  duration = 30,
  reward,
  onComplete,
  onProgress,
  isActive = true,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEyeTracking, setShowEyeTracking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showRewardBadge, setShowRewardBadge] = useState(false);
  const hasCompleted = useRef(false);

  // Reset state when media changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    setShowEyeTracking(false);
    setShowRewardBadge(false);
    hasCompleted.current = false;
  }, [src]);

  // Show reward badge when promo starts
  useEffect(() => {
    if (type === 'promo' && isActive && reward) {
      setShowRewardBadge(true);
    }
  }, [type, isActive, reward]);

  // Progress tracking
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration * 10));
        if (newProgress >= 100 && !hasCompleted.current) {
          hasCompleted.current = true;
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        onProgress?.(Math.min(newProgress, 100));
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isPlaying, duration, onComplete, onProgress]);

  // Auto-start promo content
  useEffect(() => {
    if (type === 'promo' && isActive) {
      setShowEyeTracking(true);
      const timer = setTimeout(() => setIsPlaying(true), 500);
      return () => clearTimeout(timer);
    }
  }, [type, isActive]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-full bg-background overflow-hidden select-none">
      {/* Fullscreen media background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
        style={{ backgroundImage: `url(${src})` }}
      />
      
      {/* Subtle vignette overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/60" />
      
      {/* Bottom gradient for controls visibility */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />

      {/* Eye tracking indicator for promos */}
      {showEyeTracking && type === 'promo' && (
        <div className="absolute top-16 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-destructive/80 backdrop-blur-sm animate-scale-in z-20">
          <Eye className="w-4 h-4 text-destructive-foreground animate-pulse" />
          <span className="text-xs font-medium text-destructive-foreground">Tracking</span>
        </div>
      )}

      {/* Reward badge - appears for 3 seconds */}
      {reward && (
        <RewardBadge
          amount={reward.amount}
          type={reward.type}
          isVisible={showRewardBadge}
        />
      )}

      {/* Play button overlay */}
      {!isPlaying && type !== 'image' && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="w-24 h-24 rounded-full neu-button flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
            <Play className="w-10 h-10 text-foreground ml-1" />
          </div>
        </button>
      )}

      {/* Mute toggle for video/promo content */}
      {isPlaying && type !== 'image' && (
        <button
          onClick={toggleMute}
          className="absolute bottom-24 right-4 z-20 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background/70"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </button>
      )}

      {/* Progress bar for promos - thin line at very bottom */}
      {type === 'promo' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30 z-30">
          <div 
            className={cn(
              'h-full transition-all duration-100 ease-linear',
              reward?.type === 'vicoin' ? 'bg-primary' : 'bg-icoin'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Promo label - subtle top left */}
      {type === 'promo' && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/50 backdrop-blur-md border border-primary/30 z-20">
          <span className="text-xs font-medium gradient-text">PROMOTED</span>
        </div>
      )}
    </div>
  );
};
