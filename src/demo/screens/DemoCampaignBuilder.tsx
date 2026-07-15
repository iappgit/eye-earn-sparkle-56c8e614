import React from 'react';
import {
  Megaphone,
  Map,
  Play,
  Clapperboard,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import {
  CAMPAIGN_BRAND,
  CAMPAIGN_TITLE,
  CAMPAIGN_ACTIONS,
  CAMPAIGN_REWARDS,
  CAMPAIGN_STRICTNESS_OPTIONS,
  CAMPAIGN_GATE_OPTIONS,
  calculateCampaignBudget,
} from '../demoData';

export const DemoCampaignBuilder: React.FC = () => {
  const {
    state,
    setCampaignAction,
    setCampaignReward,
    setCampaignStrictness,
    toggleCampaignGate,
    publishCampaignPreview,
    setStudioPreviewReady,
    openMoneyMap,
    openFeedDemo,
    openBrandDashboard,
  } = useDemoState();

  const budget = calculateCampaignBudget(
    state.campaignReward,
    state.campaignStrictness,
    state.campaignGates,
  );

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-4 demo-animate-fade-up">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <Megaphone className="w-6 h-6 text-primary flex-shrink-0" />
              <h1 className="font-display text-2xl font-bold truncate">Campaign Builder</h1>
            </div>
            <DemoPreviewChip />
          </div>
          <p className="text-xs text-muted-foreground">
            Fund verified attention, not fake impressions.
          </p>
        </header>

        <BuilderSection step="1" title="Campaign">
          <div className="demo-glass-card demo-glow-ring p-3">
            <p className="text-[0.65rem] text-primary uppercase tracking-wider mb-0.5">
              Brand preview
            </p>
            <p className="font-display text-lg font-bold">{CAMPAIGN_BRAND}</p>
            <p className="text-sm text-muted-foreground">{CAMPAIGN_TITLE}</p>
            {state.campaignPublished && (
              <div className="flex items-center gap-1.5 mt-2 text-green-400 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live in Feed preview
              </div>
            )}
          </div>
        </BuilderSection>

        <BuilderSection step="2" title="Reward">
          <FieldLabel>Action</FieldLabel>
          <ChipRow>
            {CAMPAIGN_ACTIONS.map((a) => (
              <Chip
                key={a.id}
                active={state.campaignAction === a.id}
                onClick={() => setCampaignAction(a.id)}
              >
                {a.label}
              </Chip>
            ))}
          </ChipRow>
          <FieldLabel className="mt-3">Reward / view</FieldLabel>
          <ChipRow>
            {CAMPAIGN_REWARDS.map((r) => (
              <Chip
                key={r}
                active={state.campaignReward === r}
                onClick={() => setCampaignReward(r)}
              >
                {r} A
              </Chip>
            ))}
          </ChipRow>
          <FieldLabel className="mt-3">Strictness</FieldLabel>
          <ChipRow>
            {CAMPAIGN_STRICTNESS_OPTIONS.map((s) => (
              <Chip
                key={s.id}
                active={state.campaignStrictness === s.id}
                onClick={() => setCampaignStrictness(s.id)}
              >
                {s.label}
              </Chip>
            ))}
          </ChipRow>
        </BuilderSection>

        <BuilderSection step="3" title="POP Gates">
          <ChipRow>
            {CAMPAIGN_GATE_OPTIONS.map((g) => (
              <Chip
                key={g.id}
                active={state.campaignGates[g.id]}
                onClick={() => toggleCampaignGate(g.id)}
              >
                {g.label}
              </Chip>
            ))}
          </ChipRow>
          <div className="demo-glass-card p-3 mt-3 grid grid-cols-2 gap-2">
            <BudgetItem label="Reward pool" value={`${budget.rewardPool.toLocaleString()} A`} />
            <BudgetItem label="Est. views" value={budget.estimatedViews.toLocaleString()} />
            <BudgetItem label="Cost / attn" value={`${budget.costPerAttention} A`} />
            <BudgetItem label="Platform fee" value={`${budget.platformFee.toLocaleString()} A`} />
          </div>
        </BuilderSection>

        <BuilderSection step="4" title="Studio Preview">
          <div className="demo-glass-card p-3">
            <div className="flex gap-3">
              <div className="w-16 aspect-[9/16] rounded-lg bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Play className="w-5 h-5 text-primary opacity-60" />
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <p className="font-medium">Vertical launch clip</p>
                <p className="text-xs text-muted-foreground mt-0.5">9:16 · Shop / Learn CTA</p>
                <p
                  className={cn(
                    'text-xs mt-1.5 font-medium',
                    state.studioPreviewReady ? 'text-green-400' : 'text-amber-400',
                  )}
                >
                  {state.studioPreviewReady ? 'Ready' : 'Generate preview first'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                className="demo-cta flex-1 !min-h-0 py-2.5 text-sm"
                onClick={() => setStudioPreviewReady(true)}
                disabled={state.studioPreviewReady}
              >
                {state.studioPreviewReady ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Preview ready
                  </span>
                ) : (
                  'Generate preview'
                )}
              </button>
            </div>
          </div>
        </BuilderSection>

        <BuilderSection step="5" title="Publish / Owner Analytics">
          <div className="space-y-2">
            <button type="button" className="demo-cta" onClick={publishCampaignPreview}>
              Publish preview
            </button>
            {state.campaignPublished && (
              <p className="text-xs text-green-400 text-center px-2">
                Linked to Feed — open Feed to start the earn loop.
              </p>
            )}
            <button
              type="button"
              className="demo-cta demo-cta-secondary !min-h-0 py-3 text-sm flex items-center justify-center gap-2"
              onClick={openBrandDashboard}
            >
              <BarChart3 className="w-4 h-4" />
              Owner Analytics
            </button>
            <div className="demo-chip-scroll -mx-1 px-1">
              <button
                type="button"
                className="demo-route-chip inline-flex items-center gap-1.5"
                onClick={openMoneyMap}
              >
                <Map className="w-3.5 h-3.5" />
                Money Map
              </button>
              <button
                type="button"
                className="demo-route-chip inline-flex items-center gap-1.5"
                onClick={openFeedDemo}
              >
                <Play className="w-3.5 h-3.5" />
                Feed demo
              </button>
            </div>
          </div>
        </BuilderSection>
      </div>
    </DemoShell>
  );
};

function BuilderSection({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 demo-animate-fade-up">
      <div className="demo-builder-step">
        <span className="demo-builder-step-num">{step}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-0.5',
        className,
      )}
    >
      {children}
    </p>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="demo-chip-scroll -mx-1 px-1">{children}</div>;
}

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
        'flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all min-h-[2.5rem]',
        active
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
          : 'bg-white/5 text-muted-foreground border border-white/10',
      )}
    >
      {children}
    </button>
  );
}

function BudgetItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="demo-glass-card p-2 !rounded-lg">
      <p className="text-[0.55rem] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-display font-bold text-sm mt-0.5">{value}</p>
    </div>
  );
}
