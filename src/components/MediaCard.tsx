import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Eye } from 'lucide-react';

interface MediaCardProps {
  type: 'video' | 'image' | 'promo';
  src: string;
  duration?: number;
  reward?: { amount: number; type: 'vicoin' | 'icoin' };
  onComplete?: () => void;
  isActive?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  type,
  src,
  duration = 30,
  reward,
  onComplete,
  isActive = true,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEyeTracking, setShowEyeTracking] = useState(false);

  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prev + (100 / (duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isPlaying, duration, onComplete]);

  useEffect(() => {
    if (type === 'promo' && isActive) {
      setShowEyeTracking(true);
      // Auto-start for promo content
      const timer = setTimeout(() => setIsPlaying(true), 500);
      return () => clearTimeout(timer);
    }
  }, [type, isActive]);

  return (
    <div className="relative w-full h-full bg-secondary overflow-hidden">
      {/* Background media */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />

      {/* Eye tracking indicator for promos */}
      {showEyeTracking && type === 'promo' && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-destructive/80 backdrop-blur-sm animate-scale-in">
          <Eye className="w-4 h-4 text-destructive-foreground animate-pulse" />
          <span className="text-xs font-medium text-destructive-foreground">Tracking</span>
        </div>
      )}

      {/* Play button overlay */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="w-20 h-20 rounded-full neu-button flex items-center justify-center">
            <Play className="w-8 h-8 text-foreground ml-1" />
          </div>
        </button>
      )}

      {/* Progress bar for promos */}
      {type === 'promo' && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
          <div 
            className={cn(
              'h-full transition-all duration-100',
              reward?.type === 'vicoin' ? 'bg-primary' : 'bg-icoin'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Promo badge */}
      {type === 'promo' && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-primary/30">
          <span className="text-xs font-medium gradient-text">PROMO</span>
        </div>
      )}
    </div>
  );
};
