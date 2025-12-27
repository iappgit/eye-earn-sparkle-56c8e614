import React, { useState, useEffect } from 'react';
import { Wallet, User, Heart, MessageCircle, Share2, Settings } from 'lucide-react';
import { NeuButton } from './NeuButton';
import { cn } from '@/lib/utils';

interface FloatingControlsProps {
  onWalletClick: () => void;
  onProfileClick: () => void;
  onLikeClick: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
  onSettingsClick: () => void;
  isLiked?: boolean;
  likeCount?: number;
  commentCount?: number;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onWalletClick,
  onProfileClick,
  onLikeClick,
  onCommentClick,
  onShareClick,
  onSettingsClick,
  isLiked = false,
  likeCount = 0,
  commentCount = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

  const showControls = () => {
    setIsVisible(true);
    if (hideTimer) clearTimeout(hideTimer);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    setHideTimer(timer);
  };

  useEffect(() => {
    // Show controls on initial load
    showControls();
    
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const handleScreenTap = () => {
    showControls();
  };

  return (
    <>
      {/* Invisible tap area to show controls */}
      <div 
        className="fixed inset-0 z-30"
        onClick={handleScreenTap}
      />

      {/* Right side controls */}
      <div className={cn(
        'fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 transition-all duration-300',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
      )}>
        <div className="flex flex-col items-center gap-1">
          <NeuButton 
            onClick={onLikeClick} 
            variant={isLiked ? 'accent' : 'default'}
            isPressed={isLiked}
          >
            <Heart className={cn('w-6 h-6', isLiked && 'fill-current')} />
          </NeuButton>
          <span className="text-xs text-muted-foreground">{likeCount}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <NeuButton onClick={onCommentClick}>
            <MessageCircle className="w-6 h-6" />
          </NeuButton>
          <span className="text-xs text-muted-foreground">{commentCount}</span>
        </div>

        <NeuButton onClick={onShareClick}>
          <Share2 className="w-6 h-6" />
        </NeuButton>
      </div>

      {/* Bottom controls */}
      <div className={cn(
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-6 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      )}>
        <NeuButton onClick={onWalletClick} variant="accent" size="lg">
          <Wallet className="w-7 h-7" />
        </NeuButton>
        
        <NeuButton onClick={onProfileClick} size="lg">
          <User className="w-7 h-7" />
        </NeuButton>
        
        <NeuButton onClick={onSettingsClick} size="lg">
          <Settings className="w-7 h-7" />
        </NeuButton>
      </div>
    </>
  );
};
