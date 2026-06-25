import React from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Circle,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import {
  CAMPAIGN_ACTIONS,
  CAMPAIGN_BRAND,
  CAMPAIGN_GATE_OPTIONS,
  CAMPAIGN_TITLE,
  getBrandDashboardMetrics,
} from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoMetricCard } from '../components/DemoMetricCard';
import { DemoRestartControl } from '../components/DemoRestartControl';

export const DemoBrandDashboard: React.FC = () => {
  const { state, openAttentionAnalytics, goToStep, setNavTab, restartDemoToFeed } =
    useDemoState();

  const metrics = getBrandDashboardMetrics(state);
  const gateCount = Object.values(state.campaignGates).filter(Boolean).length;

  const timeline = [
    { label: 'Campaign drafted', done: true },
    { label: 'Studio preview ready', done: state.studioPreviewReady },
    { label: 'POP gates selected', done: gateCount > 0 },
    { label: 'Published preview', done: state.campaignPublished },
    {
      label: 'Verified attention collected',
      done: state.campaignVerifiedViews > 0,
    },
  ];

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-6 demo-safe-pad-nav"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-4 demo-animate-fade-up flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setNavTab('create');
              goToStep('campaignBuilder');
            }}
            className="w-10 h-10 rounded-full demo-glass-card flex items-center justify-center flex-shrink-0"
            aria-label="Back to campaign builder"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="font-display text-xl font-bold truncate">Owner Analytics</h1>
              <DemoPreviewChip />
            </div>
            <p className="text-xs text-muted-foreground">Verified outcomes for campaign owners</p>
          </div>
        </header>

        <div className="demo-glass-card demo-glow-ring demo-hero-metric mb-4 demo-animate-fade-up">
          <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider mb-1">
            Verified views this session
          </p>
          <p className="font-display text-5xl font-bold gradient-text leading-none">
            {state.campaignVerifiedViews}
          </p>
          <p className="text-xs text-muted-foreground mt-2 max-w-[16rem] mx-auto">
            {state.campaignPublished
              ? 'Publish + earn in Feed to grow this number.'
              : 'Publish campaign, then complete the Feed earn loop.'}
          </p>
        </div>

        <div className="demo-glass-card p-4 mb-4 demo-animate-fade-up">
          <p className="text-xs text-primary uppercase tracking-wider mb-1">{CAMPAIGN_BRAND}</p>
          <p className="font-display font-bold">{CAMPAIGN_TITLE}</p>
          <p
            className={cn(
              'text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
              state.campaignPublished
                ? 'bg-green-500/15 text-green-400'
                : 'bg-amber-500/15 text-amber-400',
            )}
          >
            {state.campaignPublished ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Published Preview
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" />
                Draft Preview
              </>
            )}
          </p>
        </div>

        <section className="mb-4 demo-animate-fade-up">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
            Top KPIs
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <DemoMetricCard label="Verified views" value={metrics.verifiedViews} highlight />
            <DemoMetricCard
              label="Pool remaining"
              value={`${metrics.rewardPoolRemaining.toLocaleString()} A`}
            />
            <DemoMetricCard label="Cost / attention" value={metrics.costPerAttention} />
            <DemoMetricCard label="CTA completion" value={metrics.ctaCompletionRate} />
            <DemoMetricCard label="Fraud screen" value={metrics.fraudScreenPreview} />
            <DemoMetricCard
              label="Est. reach"
              value={metrics.estimatedReach.toLocaleString()}
              sub="preview"
            />
          </div>
        </section>

        <section className="demo-glass-card p-4 mb-4 space-y-3 demo-animate-fade-up">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Reward pool preview
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <PoolRow label="Budget cap" value={`${metrics.budgetCap.toLocaleString()} A`} />
            <PoolRow label="Spent preview" value={`${metrics.spentPreview} A`} />
            <PoolRow label="Remaining" value={`${metrics.rewardPoolRemaining.toLocaleString()} A`} />
            <PoolRow label="Viewer rewards" value={`${metrics.viewerRewards} A`} />
            <PoolRow label="Creator / share" value={`${metrics.creatorShareValue} A`} />
            <PoolRow label="Platform fee" value={`${metrics.platformFeePreview.toLocaleString()} A`} />
          </div>
        </section>

        <section className="demo-glass-card p-4 mb-4 demo-animate-fade-up">
          <h2 className="text-sm font-semibold mb-3">POP quality panel</h2>
          <div className="space-y-2 text-sm">
            <QualityRow label="Attention confidence" value={metrics.attentionConfidence} />
            <QualityRow label="Session integrity" value={metrics.sessionIntegrity} />
            <QualityRow label="Completion quality" value={metrics.completionQuality} />
            <QualityRow label="Review passed" value={metrics.reviewPassedPreview} />
          </div>
        </section>

        <section className="mb-4 demo-animate-fade-up">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
            CTA performance
          </h2>
          <div className="flex flex-wrap gap-2">
            {CAMPAIGN_ACTIONS.map((action) => (
              <span
                key={action.id}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold border',
                  state.campaignAction === action.id
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-white/5 border-white/10 text-muted-foreground',
                )}
              >
                {action.label}
              </span>
            ))}
          </div>
        </section>

        <section className="demo-glass-card p-4 mb-4 demo-animate-fade-up">
          <h2 className="text-sm font-semibold mb-3">Campaign timeline</h2>
          <div className="space-y-2">
            {timeline.map((step) => (
              <div key={step.label} className="flex items-center gap-2 text-sm">
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={step.done ? 'text-foreground' : 'text-muted-foreground'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            Gates active: {gateCount} ·{' '}
            {CAMPAIGN_GATE_OPTIONS.filter((g) => state.campaignGates[g.id])
              .map((g) => g.label)
              .join(', ') || 'None'}
          </p>
        </section>

        <button
          type="button"
          className="demo-cta mb-3 !min-h-11 text-sm flex items-center justify-center gap-2"
          onClick={() => openAttentionAnalytics()}
        >
          <BarChart3 className="w-4 h-4" />
          Attention Analytics
        </button>

        <DemoRestartControl onRestart={restartDemoToFeed} variant="footer" className="mb-2" />
      </div>
    </DemoShell>
  );
};

function PoolRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="demo-glass-card p-2.5 !rounded-lg">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-sm mt-0.5">{value}</p>
    </div>
  );
}

function QualityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-medium text-right">{value}</span>
    </div>
  );
}
