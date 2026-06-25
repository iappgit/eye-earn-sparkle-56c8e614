import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import {
  getAttentionAnalyticsData,
} from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoMetricCard } from '../components/DemoMetricCard';
import type { AnalyticsRange, AnalyticsView } from '../demoTypes';

const VIEW_CHIPS: { id: AnalyticsView; label: string }[] = [
  { id: 'user', label: 'User' },
  { id: 'creator', label: 'Creator' },
  { id: 'brand', label: 'Brand' },
  { id: 'system', label: 'System' },
];

const RANGE_CHIPS: { id: AnalyticsRange; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

export const DemoAttentionAnalytics: React.FC = () => {
  const {
    state,
    setAnalyticsView,
    setAnalyticsRange,
    setAnalyticsInsight,
    openBrandDashboard,
    openFeedDemo,
  } = useDemoState();

  const data = getAttentionAnalyticsData(state);

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-6 demo-safe-pad-nav"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-4 demo-animate-fade-up flex items-center gap-3">
          <button
            type="button"
            onClick={() => openBrandDashboard()}
            className="w-10 h-10 rounded-full demo-glass-card flex items-center justify-center flex-shrink-0"
            aria-label="Back to brand dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="font-display text-xl font-bold truncate">Attention Analytics</h1>
              <DemoPreviewChip />
            </div>
            <p className="text-xs text-muted-foreground">Verified attention across [ i ]</p>
          </div>
        </header>

        <div className="demo-glass-card p-3 mb-3 demo-animate-fade-up">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-0.5">
            View
          </p>
          <div className="demo-chip-scroll -mx-1 px-1">
            {VIEW_CHIPS.map((chip) => (
              <Chip
                key={chip.id}
                active={state.analyticsView === chip.id}
                onClick={() => setAnalyticsView(chip.id)}
              >
                {chip.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="demo-glass-card p-3 mb-4 demo-animate-fade-up">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-0.5">
            Range
          </p>
          <div className="demo-chip-scroll -mx-1 px-1">
            {RANGE_CHIPS.map((chip) => (
              <Chip
                key={chip.id}
                active={state.analyticsRange === chip.id}
                onClick={() => setAnalyticsRange(chip.id)}
              >
                {chip.label}
              </Chip>
            ))}
          </div>
        </div>

        <section className="mb-4 demo-animate-fade-up">
          <div className="grid grid-cols-2 gap-2">
            {data.kpis.map((kpi) => (
              <DemoMetricCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                sub={kpi.sub}
              />
            ))}
          </div>
        </section>

        <section className="mb-4 demo-animate-fade-up">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
            Loop breakdown
          </h2>
          <div className="space-y-2">
            {data.loops.map((loop) => (
              <div key={loop.id} className="demo-glass-card p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm">{loop.label}</p>
                  <span className="text-xs text-primary font-medium">{loop.value}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{loop.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 demo-animate-fade-up">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
            Insights
          </h2>
          <div className="space-y-2">
            {data.insights.map((insight) => (
              <button
                key={insight.id}
                type="button"
                onClick={() =>
                  setAnalyticsInsight(
                    state.selectedAnalyticsInsight === insight.id ? null : insight.id,
                  )
                }
                className={cn(
                  'demo-glass-card w-full p-3 text-left transition-colors',
                  state.selectedAnalyticsInsight === insight.id && 'demo-glow-ring border-primary/30',
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <p className="font-semibold text-sm">{insight.label}</p>
                </div>
                {(state.selectedAnalyticsInsight === insight.id ||
                  state.selectedAnalyticsInsight === null) && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.detail}
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2 mb-4 demo-animate-fade-up">
          <button
            type="button"
            className="demo-cta-secondary demo-cta !min-h-10 text-xs"
            onClick={() => openBrandDashboard()}
          >
            Brand Dashboard
          </button>
          <button
            type="button"
            className="demo-cta-secondary demo-cta !min-h-10 text-xs"
            onClick={() => openFeedDemo()}
          >
            Feed
          </button>
        </div>
      </div>
    </DemoShell>
  );
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex-shrink-0 min-h-[2.25rem]',
        active
          ? 'bg-primary/20 border-primary/40 text-primary'
          : 'bg-white/5 border-white/10 text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
}
