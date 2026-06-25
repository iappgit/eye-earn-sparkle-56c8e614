import React from 'react';
import { ArrowLeft, Map, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { MONEY_MAP_NODES } from '../demoData';
import { DemoPreviewChip } from '../components/DemoPreviewChip';

export const DemoMoneyMap: React.FC = () => {
  const { state, goToStep, setNavTab, setMoneyNode } = useDemoState();
  const selected = MONEY_MAP_NODES.find((n) => n.id === state.moneyNode);

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-5 demo-animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => {
                goToStep('wallet');
                setNavTab('wallet');
              }}
              className="w-10 h-10 rounded-full demo-glass-card flex items-center justify-center"
              aria-label="Back to wallet"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                <h1 className="font-display text-xl font-bold">Money Movement Map</h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                How value flows through the [ i ] demo system
              </p>
            </div>
          </div>
        </header>

        {/* Flow nodes */}
        <div className="space-y-2 mb-4">
          {[...MONEY_MAP_NODES]
            .sort((a, b) => a.order - b.order)
            .map((node, i) => (
              <React.Fragment key={node.id}>
                <button
                  type="button"
                  onClick={() =>
                    setMoneyNode(state.moneyNode === node.id ? null : node.id)
                  }
                  className={cn(
                    'demo-glass-card w-full p-4 text-left transition-all',
                    state.moneyNode === node.id && 'demo-glow-ring border-primary/40',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {node.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{node.title}</p>
                      <p className="text-xs text-muted-foreground">{node.subtitle}</p>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform flex-shrink-0',
                        state.moneyNode === node.id && 'rotate-90 text-primary',
                      )}
                    />
                  </div>
                  {state.moneyNode === node.id && (
                    <p className="text-xs text-muted-foreground mt-3 pl-10 leading-relaxed border-t border-white/10 pt-3">
                      {node.explanation}
                    </p>
                  )}
                </button>
                {i < MONEY_MAP_NODES.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <div className="w-0.5 h-3 bg-primary/30 rounded-full" />
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>

        {selected && (
          <div className="demo-glass-card p-4 mb-4 demo-animate-fade-up">
            <p className="text-xs text-primary font-medium mb-1">Selected node</p>
            <p className="font-semibold mb-1">{selected.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selected.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <DemoPreviewChip />
        </div>
      </div>
    </DemoShell>
  );
};
