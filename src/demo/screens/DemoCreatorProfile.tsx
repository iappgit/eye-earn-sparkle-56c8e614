import React from 'react';
import {
  BarChart3,
  Heart,
  Link2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoMetricCard } from '../components/DemoMetricCard';
import { DemoPlatformToggle } from '../components/DemoPlatformToggle';
import {
  CREATOR_NAME,
  CREATOR_HANDLE,
  CREATOR_BIO,
  CREATOR_STATS,
  CREATOR_CONTENT,
  CREATOR_DISCLAIMER,
  PLATFORM_META,
} from '../demoData';
import type { CreatorTab } from '../demoTypes';

const CREATOR_TABS: { id: CreatorTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'content', label: 'Content' },
];

export const DemoCreatorProfile: React.FC = () => {
  const {
    state,
    setCreatorTab,
    openTipFromProfile,
  } = useDemoState();

  const connectedCount = Object.values(state.connectedPlatforms).filter(Boolean).length;

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        {/* Header */}
        <header className="mb-5 demo-animate-fade-up">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl demo-glass-card demo-glow-ring flex items-center justify-center flex-shrink-0">
              <span className="font-display text-2xl font-bold gradient-text">RS</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl font-bold truncate">{CREATOR_NAME}</h1>
              <p className="text-sm text-primary">{CREATOR_HANDLE}</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {CREATOR_BIO}
              </p>
            </div>
          </div>

          {/* Platform chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(PLATFORM_META) as Array<keyof typeof PLATFORM_META>).map(
              (id) => {
                const meta = PLATFORM_META[id];
                const connected = state.connectedPlatforms[id];
                return (
                  <span
                    key={id}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                      connected
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-white/10 bg-white/5 text-muted-foreground opacity-60',
                    )}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.label}
                  </span>
                );
              },
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <DemoMetricCard label="Verified views" value={CREATOR_STATS.verifiedViews} />
            <DemoMetricCard
              label="Earned ACoins"
              value={CREATOR_STATS.earnedAcoins}
              highlight
            />
            <DemoMetricCard label="Tips received" value={CREATOR_STATS.tipsReceived} />
            <DemoMetricCard label="Active campaigns" value={CREATOR_STATS.activeCampaigns} />
          </div>
        </header>

        {/* Sub-tabs */}
        <div className="demo-wallet-tabs -mx-4 px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CREATOR_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCreatorTab(tab.id)}
                className={cn(
                  'flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all',
                  state.activeCreatorTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/5 text-muted-foreground border border-white/10',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {state.activeCreatorTab === 'profile' && (
          <div className="space-y-3 demo-animate-fade-up">
            <div className="demo-glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Creator dashboard preview</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Simulated analytics across {connectedCount} connected platform
                {connectedCount !== 1 ? 's' : ''}. Verified attention drives
                internal ACoin value — not cash equivalents.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="demo-glass-card p-2 !rounded-lg">
                  <p className="text-xs text-muted-foreground">7d views</p>
                  <p className="font-bold text-sm">24.2K</p>
                </div>
                <div className="demo-glass-card p-2 !rounded-lg">
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="font-bold text-sm">8.4%</p>
                </div>
                <div className="demo-glass-card p-2 !rounded-lg">
                  <p className="text-xs text-muted-foreground">Avg POP</p>
                  <p className="font-bold text-sm">91%</p>
                </div>
              </div>
            </div>

            <ActionCard
              icon={<Heart className="w-5 h-5 text-primary" />}
              title="Tip creator preview"
              description="Route to wallet tip preview for Rafaela Studio."
              onClick={openTipFromProfile}
            />
            <ActionCard
              icon={<Link2 className="w-5 h-5 text-primary" />}
              title="Connect platforms preview"
              description="Toggle simulated YouTube, TikTok, Instagram, Twitch."
              onClick={() => setCreatorTab('platforms')}
            />
          </div>
        )}

        {state.activeCreatorTab === 'platforms' && (
          <div className="demo-animate-fade-up">
            <DemoPlatformToggle />
          </div>
        )}

        {state.activeCreatorTab === 'content' && (
          <div className="demo-animate-fade-up">
            <div className="grid grid-cols-3 gap-1.5">
              {CREATOR_CONTENT.map((item) => {
                const meta = PLATFORM_META[item.platform];
                const platformConnected = state.connectedPlatforms[item.platform];
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden demo-glass-card !rounded-lg',
                      !platformConnected && 'opacity-40',
                    )}
                  >
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5">
                      <span
                        className="text-[0.6rem] font-medium px-1 py-0.5 rounded"
                        style={{ backgroundColor: `${meta.color}33`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <p className="text-[0.6rem] text-white/80 mt-0.5 truncate">
                        {item.verifiedViews} views
                      </p>
                      <p className="text-[0.6rem] text-primary font-medium">
                        +{item.earnedPreview} A
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Simulated cross-platform content grid. Earned values are previews only.
            </p>
          </div>
        )}

        <div className="demo-glass-card p-4 border border-muted/30 mt-6">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {CREATOR_DISCLAIMER}
          </p>
        </div>
      </div>
    </DemoShell>
  );
};

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="demo-glass-card w-full p-4 flex items-center gap-3 text-left hover:border-primary/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}
