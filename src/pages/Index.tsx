import React, { useState, useCallback } from 'react';
import { MediaCard } from '@/components/MediaCard';
import { FloatingControls } from '@/components/FloatingControls';
import { RewardNotification } from '@/components/RewardNotification';
import { WalletScreen } from '@/components/WalletScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { CrossNavigation } from '@/components/CrossNavigation';
import { toast } from 'sonner';

// Mock data
const mockMedia = [
  {
    id: '1',
    type: 'promo' as const,
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1080',
    duration: 15,
    reward: { amount: 50, type: 'vicoin' as const },
    title: 'Holiday Special',
  },
  {
    id: '2',
    type: 'video' as const,
    src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1080',
    title: 'Trending Now',
  },
  {
    id: '3',
    type: 'promo' as const,
    src: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1080',
    duration: 30,
    reward: { amount: 1, type: 'icoin' as const },
    title: 'Coffee Shop Reward',
  },
];

const mockUser = {
  name: 'Alex Chen',
  username: 'alexchen',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  isVerified: true,
  joinDate: new Date('2024-01-15'),
  location: 'San Francisco, CA',
  vicoins: 12450,
  icoins: 85,
};

const mockTransactions = [
  { id: '1', type: 'earned' as const, amount: 50, coinType: 'vicoin' as const, description: 'Watched Holiday Special promo', timestamp: new Date() },
  { id: '2', type: 'received' as const, amount: 100, coinType: 'vicoin' as const, description: 'Gift from @maria', timestamp: new Date(Date.now() - 86400000) },
  { id: '3', type: 'earned' as const, amount: 1, coinType: 'icoin' as const, description: 'Coffee Shop promotion', timestamp: new Date(Date.now() - 172800000) },
  { id: '4', type: 'spent' as const, amount: 500, coinType: 'vicoin' as const, description: 'Promoted your video', timestamp: new Date(Date.now() - 259200000) },
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState<{ amount: number; type: 'vicoin' | 'icoin' } | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [vicoins, setVicoins] = useState(mockUser.vicoins);
  const [icoins, setIcoins] = useState(mockUser.icoins);

  const currentMedia = mockMedia[currentIndex];

  const handleMediaComplete = useCallback(() => {
    if (currentMedia.reward) {
      setCurrentReward(currentMedia.reward);
      setShowReward(true);
      
      // Update balance
      if (currentMedia.reward.type === 'vicoin') {
        setVicoins(prev => prev + currentMedia.reward!.amount);
      } else {
        setIcoins(prev => prev + currentMedia.reward!.amount);
      }
    }
  }, [currentMedia]);

  const handleRewardComplete = () => {
    setShowReward(false);
    setCurrentReward(null);
  };

  const handleNavigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (direction === 'down') {
      setCurrentIndex(prev => (prev + 1) % mockMedia.length);
      setIsLiked(false);
    } else if (direction === 'up') {
      setCurrentIndex(prev => (prev - 1 + mockMedia.length) % mockMedia.length);
      setIsLiked(false);
    } else {
      toast(`Navigating ${direction}...`, {
        description: `This would show ${direction === 'left' ? 'friends feed' : 'promotions'}`,
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast('Liked!', { description: 'Added to your favorites' });
    }
  };

  const handleComment = () => {
    toast('Comments', { description: 'Comments panel coming soon...' });
  };

  const handleShare = () => {
    toast('Share', { description: 'Share options coming soon...' });
  };

  const handleSettings = () => {
    toast('Settings', { description: 'Settings panel coming soon...' });
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Main Media Display */}
      <MediaCard
        type={currentMedia.type}
        src={currentMedia.src}
        duration={currentMedia.duration}
        reward={currentMedia.reward}
        onComplete={handleMediaComplete}
        isActive={true}
      />

      {/* Cross Navigation */}
      <CrossNavigation onNavigate={handleNavigate} />

      {/* Floating Controls */}
      <FloatingControls
        onWalletClick={() => setShowWallet(true)}
        onProfileClick={() => setShowProfile(true)}
        onLikeClick={handleLike}
        onCommentClick={handleComment}
        onShareClick={handleShare}
        onSettingsClick={handleSettings}
        isLiked={isLiked}
        likeCount={1234}
        commentCount={89}
      />

      {/* Reward Notification */}
      {currentReward && (
        <RewardNotification
          amount={currentReward.amount}
          type={currentReward.type}
          isVisible={showReward}
          onComplete={handleRewardComplete}
        />
      )}

      {/* Wallet Screen */}
      <WalletScreen
        isOpen={showWallet}
        onClose={() => setShowWallet(false)}
        vicoins={vicoins}
        icoins={icoins}
        transactions={mockTransactions}
      />

      {/* Profile Screen */}
      <ProfileScreen
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={{ ...mockUser, vicoins, icoins }}
      />
    </div>
  );
};

export default Index;
