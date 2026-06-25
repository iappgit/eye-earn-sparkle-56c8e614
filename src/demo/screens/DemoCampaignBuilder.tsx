import React from 'react';
import {
  Megaphone,
  Map,
  Play,
  Clapperboard,
  CheckCircle2,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import {
  CAMPAIGN_BRAND,
  CAMPAIGN_TITLE,
  CAMPAIGN_DISCLAIMER,
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
        <header className="mb-5 demo-animate-fade-up">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Campaign Builder</h1>
          </div>
          <p className="text-sm text-foreground/90 font-medium">
            Fund verified attention, not fake impressions.
          </p>
        </header>

        {/* Brand preview */}
        <div className="demo-glass-card demo-glow-ring p-4 mb-4 demo-animate-fade-up">
          <p className="text-xs text-primary uppercase tracking-wider mb-1">Brand preview</p>
          <p className="font-display text-lg font-bold">{CAMPAIGN_BRAND}</p>
          <p className="text-sm text-muted-foreground">{CAMPAIGN_TITLE}</p>
          {state.campaignPublished && (
            <div className="flex items-center gap-2 mt-3 text-green-400 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              Campaign publish preview active
            </div>
          )}
        </div>

        {/* Action selector */}
        <Section label="Required action">
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
        </Section>

        {/* Reward */}
        <Section label="Reward per verified view">
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
        </Section>

        {/* Strictness */}
        <Section label="POP strictness">
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
        </Section>

        {/* Gates */}
        <Section label="Verification gates">
          <ChipRow wrap>
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
        </Section>

        {/* Budget preview */}
        <div className="demo-glass-card p-4 mb-4 space-y-3 demo-animate-fade-up">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Budget preview
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <BudgetItem label="Reward pool" value={`${budget.rewardPool.toLocaleString()} A`} />
            <BudgetItem
              label="Est. verified views"
              value={budget.estimatedViews.toLocaleString()}
            />
            <BudgetItem
              label="Cost / attention"
              value={`${budget.costPerAttention} A`}
            />
            <BudgetItem
              label="Platform fee preview"
              value={`${budget.platformFee.toLocaleString()} A`}
            />
          </div>
          <p className="text-[0.65rem] text-muted-foreground">
            Simulated estimates only. No real ad spend or delivery.
          </p>
        </div>

        {/* Studio Preview */}
        <div className="demo-glass-card p-4 mb-4 demo-animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <Clapperboard className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">Studio Preview</h3>
          </div>
          <div className="flex gap-3">
            <div className="w-20 aspect-[9/16] rounded-lg bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Play className="w-6 h-6 text-primary opacity-60" />
            </div>
            <div className="flex-1 min-w-0 text-sm">
              <p className="font-medium">Vertical launch clip</p>
              <p className="text-xs text-muted-foreground mt-1">Format: 9:16</p>
              <p className="text-xs text-muted-foreground">CTA overlay: Shop / Learn</p>
              <p
                className={cn(
                  'text-xs mt-2 font-medium',
                  state.studioPreviewReady ? 'text-green-400' : 'text-amber-400',
                )}
              >
                {state.studioPreviewReady
                  ? 'Ready for campaign preview'
                  : 'Awaiting preview generation'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              className="demo-cta flex-1 !min-h-0 py-2.5 text-sm"
              onClick={() => setStudioPreviewReady(true)}
            >
              Generate preview
            </button>
            <button
              type="button"
              className="demo-cta demo-cta-secondary flex-1 !min-h-0 py-2.5 text-sm"
              disabled={!state.studioPreviewReady}
              onClick={() => setStudioPreviewReady(true)}
            >
              Use in campaign
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2 mb-4">
          <button
            type="button"
            className="demo-cta"
            onClick={publishCampaignPreview}
          >
            Publish preview
          </button>
          {state.campaignPublished && (
            <p className="text-xs text-green-400 text-center px-2">
              Campaign linked to Feed — open Feed to start the earn loop preview.
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
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="demo-cta demo-cta-secondary !min-h-0 py-3 text-sm flex items-center justify-center gap-1.5"
              onClick={openMoneyMap}
            >
              <Map className="w-4 h-4" />
              Money Map
            </button>
            <button
              type="button"
              className="demo-cta demo-cta-secondary !min-h-0 py-3 text-sm flex items-center justify-center gap-1.5"
              onClick={openFeedDemo}
            >
              <Play className="w-4 h-4" />
              Feed demo
            </button>
          </div>
        </div>

        <div className="demo-glass-card p-4 border border-muted/30">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {CAMPAIGN_DISCLAIMER}
          </p>
        </div>
      </div>
    </DemoShell>
  );
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
        {label}
      </h3>
      {children}
    </section>
  );
}

function ChipRow({
  children,
  wrap,
}: {
  children: React.ReactNode;
  wrap?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex gap-2',
        wrap ? 'flex-wrap' : 'overflow-x-auto pb-1 -mx-0.5 px-0.5',
      )}
    >
      {children}
    </div>
  );
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
        'flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all',
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
    <div className="demo-glass-card p-2.5 !rounded-lg">
      <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-display font-bold text-sm mt-0.5">{value}</p>
    </div>
  );
}
