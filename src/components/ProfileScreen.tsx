import React from 'react';
import { X, Shield, CheckCircle2, Camera, Mail, Calendar, MapPin } from 'lucide-react';
import { NeuButton } from './NeuButton';
import { CoinDisplay } from './CoinDisplay';
import { cn } from '@/lib/utils';

interface ProfileScreenProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    joinDate: Date;
    location: string;
    vicoins: number;
    icoins: number;
  };
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg animate-slide-up">
      <div className="max-w-md mx-auto h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">Profile</h1>
          <NeuButton onClick={onClose} size="sm">
            <X className="w-5 h-5" />
          </NeuButton>
        </div>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full neu-card overflow-hidden">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full neu-button flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-xl font-bold">{user.name}</h2>
            {user.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-primary fill-primary" />
            )}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        {/* Verification Status */}
        <div className={cn(
          'flex items-center gap-3 p-4 rounded-2xl mb-6',
          user.isVerified ? 'neu-inset border border-primary/20' : 'neu-button'
        )}>
          <Shield className={cn(
            'w-6 h-6',
            user.isVerified ? 'text-primary' : 'text-muted-foreground'
          )} />
          <div className="flex-1">
            <p className="font-medium text-sm">
              {user.isVerified ? 'Verified Account' : 'Verification Required'}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.isVerified 
                ? 'Your identity has been confirmed' 
                : 'Complete verification to unlock all features'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="neu-card rounded-2xl p-4">
            <CoinDisplay type="vicoin" amount={user.vicoins} size="md" />
          </div>
          <div className="neu-card rounded-2xl p-4">
            <CoinDisplay type="icoin" amount={user.icoins} size="md" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 neu-inset rounded-2xl">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.username}@i-app.io</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 neu-inset rounded-2xl">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="text-sm font-medium">
                {user.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 neu-inset rounded-2xl">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{user.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
