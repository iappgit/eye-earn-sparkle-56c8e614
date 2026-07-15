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
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import {
  CREATOR_NAME,
  CREATOR_HANDLE,
  CREATOR_BIO,
  CREATOR_CONTENT,
  PLATFORM_META,
  getCreatorProfileStats,
} from '../demoData';
import type { CreatorTab } from '../demoTypes';

const CREATOR_TABS: { id: CreatorTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'content', label: 'Content' },
];

export const DemoCreatorProfile: React.FC = () => {
  const { state, setCreatorTab, openTipFromProfile } = useDemoState();
  const stats = getCreatorProfileStats(state);

  const dashboardViews =
    stats.verifiedViewsSession > 0
      ? `${(24.2 + stats.verifiedViewsSession * 1.8).toFixed(1)}K`
      : '24.2K';
  const dashboardEngagement = `${(
    6.2 +
    stats.connectedCount * 0.55 +
    (stats.tipsReceived > 0 ? 1.4 : 0)
  ).toFixed(1)}%`;
  const dashboardPop =
    state.popScore > 0
      ? `${state.popScore}%`
      : stats.verifiedViewsSession > 0
        ? `${Math.min(97, 84 + stats.verifiedViewsSession * 4)}%`
        : '91%';

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-4 demo-animate-fade-up">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl demo-glass-card demo-glow-ring flex items-center justify-center flex-shrink-0">
              <span className="font-display text-xl font-bold gradient-text">RS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h1 className="font-display text-lg font-bold truncate">{CREATOR_NAME}</h1>
                  <p className="text-xs text-primary">{CREATOR_HANDLE}</p>
                </div>
                <DemoPreviewChip />
              </div>
              <p className="text-[0.65rem] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                {CREATOR_BIO}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <DemoMetricCard
              label="Verified views (session)"
              value={String(stats.verifiedViewsSession)}
              highlight
            />
            <DemoMetricCard
              label="Tips / value received"
              value={`${stats.tipsReceived} i`}
            />
            <DemoMetricCard
              label="Platforms connected"
              value={`${stats.connectedCount}/4`}
            />
            <DemoMetricCard
              label="Session earned"
              value={String(stats.sessionEarned)}
            />
          </div>

          <div className="demo-chip-scroll -mx-1 px-1 mb-1">
            {(Object.keys(PLATFORM_META) as Array<keyof typeof PLATFORM_META>).map((id) => {
              const meta = PLATFORM_META[id];
              const connected = state.connectedPlatforms[id];
              return (
                <span
                  key={id}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border flex-shrink-0',
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
            })}
          </div>
        </header>

        <div className="demo-wallet-tabs -mx-4 px-4 mb-3">
          <div className="demo-chip-scroll -mx-1 px-1">
            {CREATOR_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCreatorTab(tab.id)}
                className={cn(
                  'flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all min-h-[2.5rem]',
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
          <div className="space-y-2.5 demo-animate-fade-up">
            <div className="demo-glass-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Creator dashboard</span>
                <span className="text-[0.55rem] text-muted-foreground ml-auto">
                  Session-adjusted preview
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="demo-glass-card p-2 !rounded-lg">
                  <p className="text-[0.6rem] text-muted-foreground">7d views</p>
                  <p className="font-bold text-sm">{dashboardViews}</p>
                </div>
                <div className="demo-glass-card p-2 !rounded-lg">
                  <p className="text-[0.6rem] text-muted-foreground">Engagement</p>
                  <p className="font-bold text-sm">{dashboardEngagement}</p>
                </div>
                <div className="demo-glass-card p-2 !rounded-lg">
                  <p className="text-[0.6rem] text-muted-foreground">Avg POP</p>
                  <p className="font-bold text-sm">{dashboardPop}</p>
                </div>
              </div>
            </div>

            <ActionCard
              icon={<Heart className="w-5 h-5 text-primary" />}
              title="Tip creator preview"
              description="Route to wallet tip preview."
              onClick={openTipFromProfile}
            />
            <ActionCard
              icon={<Link2 className="w-5 h-5 text-primary" />}
              title="Connect platforms"
              description="Toggle simulated platform links."
              onClick={() => setCreatorTab('platforms')}
            />
          </div>
        )}

        {state.activeCreatorTab === 'platforms' && (
          <div className="demo-animate-fade-up">
            <DemoPlatformToggle compact />
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
                        className="text-[0.55rem] font-medium px-1 py-0.5 rounded"
                        style={{ backgroundColor: `${meta.color}33`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <p className="text-[0.55rem] text-white/80 mt-0.5 truncate">
                        {item.verifiedViews} views
                      </p>
                      <p className="text-[0.55rem] text-primary font-medium">
                        +{item.earnedPreview} A
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
      className="demo-glass-card w-full p-3 flex items-center gap-3 text-left hover:border-primary/30 transition-colors min-h-[3.5rem]"
    >
      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
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
