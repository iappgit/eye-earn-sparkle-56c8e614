import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRODUCT_MAP_NODES } from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoRestartControl } from '../components/DemoRestartControl';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import type { DemoStep } from '../demoTypes';

interface NodeRoute {
  label: string;
  step: DemoStep;
  tab?: 'feed' | 'wallet' | 'create' | 'profile' | 'system';
}

const NODE_ROUTES: Record<string, NodeRoute[]> = {
  users: [{ label: 'Feed', step: 'feed', tab: 'feed' }],
  creators: [
    { label: 'Creator Profile', step: 'profile', tab: 'profile' },
    { label: 'Click-and-Earn', step: 'clickEarn', tab: 'feed' },
  ],
  brands: [
    { label: 'Campaign Builder', step: 'campaignBuilder', tab: 'create' },
    { label: 'Brand Dashboard', step: 'brandDashboard', tab: 'create' },
  ],
  merchants: [{ label: 'Wallet', step: 'wallet', tab: 'wallet' }],
  pop: [{ label: 'Feed', step: 'feed', tab: 'feed' }],
  wallet: [
    { label: 'Wallet', step: 'wallet', tab: 'wallet' },
    { label: 'Money Map', step: 'moneyMap', tab: 'system' },
  ],
  'campaign-builder': [
    { label: 'Campaign Builder', step: 'campaignBuilder', tab: 'create' },
    { label: 'Brand Dashboard', step: 'brandDashboard', tab: 'create' },
  ],
  'creator-profile': [{ label: 'Creator Profile', step: 'profile', tab: 'profile' }],
  'money-movement': [{ label: 'Money Map', step: 'moneyMap', tab: 'system' }],
  elo: [{ label: 'ELO', step: 'elo', tab: 'feed' }],
  'brand-dashboard': [
    { label: 'Brand Dashboard', step: 'brandDashboard', tab: 'create' },
    { label: 'Attention Analytics', step: 'attentionAnalytics', tab: 'create' },
  ],
  'attention-analytics': [
    { label: 'Attention Analytics', step: 'attentionAnalytics', tab: 'create' },
    { label: 'Brand Dashboard', step: 'brandDashboard', tab: 'create' },
  ],
  'published-campaign': [
    { label: 'Campaign Builder', step: 'campaignBuilder', tab: 'create' },
    { label: 'Feed', step: 'feed', tab: 'feed' },
    { label: 'Brand Dashboard', step: 'brandDashboard', tab: 'create' },
  ],
};

export const DemoProductMap: React.FC = () => {
  const {
    state,
    setProductNode,
    goToStep,
    setNavTab,
    openBrandDashboard,
    openAttentionAnalytics,
    openMoneyMap,
    openElo,
    restartDemoToFeed,
  } = useDemoState();

  const selected = PRODUCT_MAP_NODES.find((n) => n.id === state.selectedProductNode);

  const navigate = (route: NodeRoute) => {
    if (route.tab) setNavTab(route.tab);
    goToStep(route.step);
  };

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-6"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-4 demo-animate-fade-up">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <Layers className="w-5 h-5 text-primary flex-shrink-0" />
              <h1 className="font-display text-2xl font-bold truncate">Product Map</h1>
            </div>
            <DemoPreviewChip />
          </div>
          <p className="text-xs text-muted-foreground">
            System map — users earn, creators monetize, brands fund, POP verifies.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {PRODUCT_MAP_NODES.map((node, i) => (
            <button
              key={node.id}
              type="button"
              onClick={() =>
                setProductNode(state.selectedProductNode === node.id ? null : node.id)
              }
              className={cn(
                'demo-glass-card p-3 text-left demo-animate-fade-up min-h-[5rem]',
                state.selectedProductNode === node.id && 'demo-glow-ring border-primary/40',
              )}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <span className="text-base mb-0.5 block">{node.icon}</span>
              <p className="font-semibold text-xs leading-tight">{node.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                {node.subtitle}
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="demo-glass-card p-3 mb-4 demo-animate-fade-up">
            <p className="font-semibold text-sm mb-0.5">
              {selected.icon} {selected.title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
              {selected.explanation}
            </p>
            <div className="demo-chip-scroll -mx-1 px-1">
              {(NODE_ROUTES[selected.id] ?? []).map((route) => (
                <button
                  key={route.label}
                  type="button"
                  onClick={() => navigate(route)}
                  className="demo-route-chip inline-flex items-center gap-1"
                >
                  {route.label}
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="demo-animate-fade-up mb-4">
          <p className="text-[0.65rem] text-muted-foreground mb-2 uppercase tracking-wider font-semibold px-1">
            Quick routes
          </p>
          <div className="demo-chip-scroll -mx-4 px-4">
            <button
              type="button"
              className="demo-route-chip"
              onClick={() => {
                setNavTab('feed');
                goToStep('feed');
              }}
            >
              Feed
            </button>
            <button
              type="button"
              className="demo-route-chip"
              onClick={() => {
                setNavTab('wallet');
                goToStep('wallet');
              }}
            >
              Wallet
            </button>
            <button
              type="button"
              className="demo-route-chip"
              onClick={() => {
                setNavTab('create');
                goToStep('campaignBuilder');
              }}
            >
              Campaign
            </button>
            <button type="button" className="demo-route-chip" onClick={openBrandDashboard}>
              Brand Dashboard
            </button>
            <button type="button" className="demo-route-chip" onClick={openAttentionAnalytics}>
              Analytics
            </button>
            <button type="button" className="demo-route-chip" onClick={openMoneyMap}>
              Money Map
            </button>
            <button type="button" className="demo-route-chip" onClick={openElo}>
              ELO
            </button>
          </div>
        </section>

        <DemoRestartControl onRestart={restartDemoToFeed} variant="footer" className="mb-2" />
      </div>
    </DemoShell>
  );
};
