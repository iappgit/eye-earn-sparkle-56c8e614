import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRODUCT_MAP_DISCLAIMER, PRODUCT_MAP_NODES } from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
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
  brands: [{ label: 'Campaign Builder', step: 'campaignBuilder', tab: 'create' }],
  merchants: [{ label: 'Wallet', step: 'wallet', tab: 'wallet' }],
  pop: [{ label: 'Feed', step: 'feed', tab: 'feed' }],
  wallet: [
    { label: 'Wallet', step: 'wallet', tab: 'wallet' },
    { label: 'Money Map', step: 'moneyMap', tab: 'system' },
  ],
  'campaign-builder': [{ label: 'Campaign Builder', step: 'campaignBuilder', tab: 'create' }],
  'creator-profile': [{ label: 'Creator Profile', step: 'profile', tab: 'profile' }],
  'money-movement': [{ label: 'Money Map', step: 'moneyMap', tab: 'system' }],
  elo: [{ label: 'ELO', step: 'elo', tab: 'feed' }],
};

export const DemoProductMap: React.FC = () => {
  const { state, setProductNode, goToStep, setNavTab, openClickEarn, openElo, openMoneyMap } =
    useDemoState();

  const selected = PRODUCT_MAP_NODES.find((n) => n.id === state.selectedProductNode);

  const navigate = (route: NodeRoute) => {
    if (route.tab) setNavTab(route.tab);
    goToStep(route.step);
  };

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-6 demo-safe-pad-nav"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-5 demo-animate-fade-up">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl font-bold">Product Map</h1>
          </div>
          <p className="text-sm text-muted-foreground">The verified attention economy</p>
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
                'demo-glass-card p-3 text-left demo-animate-fade-up min-h-[5.5rem]',
                state.selectedProductNode === node.id && 'demo-glow-ring border-primary/40',
              )}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <span className="text-lg mb-1 block">{node.icon}</span>
              <p className="font-semibold text-xs leading-tight">{node.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                {node.subtitle}
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="demo-glass-card p-4 mb-4 demo-animate-fade-up">
            <p className="font-semibold text-sm mb-1">
              {selected.icon} {selected.title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {selected.explanation}
            </p>
            <div className="flex flex-wrap gap-2">
              {(NODE_ROUTES[selected.id] ?? []).map((route) => (
                <button
                  key={route.label}
                  type="button"
                  onClick={() => navigate(route)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-primary/15 text-primary border border-primary/25"
                >
                  {route.label}
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="demo-animate-fade-up">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold px-1">
            Quick routes
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-xs"
              onClick={() => {
                setNavTab('feed');
                goToStep('feed');
              }}
            >
              Feed
            </button>
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-xs"
              onClick={() => {
                setNavTab('wallet');
                goToStep('wallet');
              }}
            >
              Wallet
            </button>
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-xs"
              onClick={() => {
                setNavTab('profile');
                goToStep('profile');
              }}
            >
              Profile
            </button>
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-xs"
              onClick={() => {
                setNavTab('create');
                goToStep('campaignBuilder');
              }}
            >
              Create
            </button>
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-xs"
              onClick={() => openMoneyMap()}
            >
              Money Map
            </button>
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-xs"
              onClick={() => openElo()}
            >
              ELO
            </button>
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-xs col-span-2"
              onClick={() => openClickEarn()}
            >
              Click-and-Earn
            </button>
          </div>
        </section>

        <p className="text-[10px] text-muted-foreground/80 text-center mt-6 leading-relaxed px-2">
          {PRODUCT_MAP_DISCLAIMER}
        </p>
      </div>
    </DemoShell>
  );
};
