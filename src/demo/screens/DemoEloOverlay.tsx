import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ELO_DISCLAIMER, ELO_PROMPTS, getEloResponse } from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import type { EloMode } from '../demoTypes';

const ELO_MODES: { id: EloMode; label: string }[] = [
  { id: 'user', label: 'User' },
  { id: 'creator', label: 'Creator' },
  { id: 'brand', label: 'Brand' },
  { id: 'system', label: 'System' },
];

export const DemoEloOverlay: React.FC = () => {
  const {
    state,
    setEloMode,
    selectEloPrompt,
    openFeedDemo,
    goToStep,
    setNavTab,
    openMoneyMap,
    openProductMap,
  } = useDemoState();

  const { eloMode, selectedEloPrompt } = state;
  const response = selectedEloPrompt
    ? getEloResponse(eloMode, selectedEloPrompt)
    : null;

  const route = (step: Parameters<typeof goToStep>[0], tab?: Parameters<typeof setNavTab>[0]) => {
    if (tab) setNavTab(tab);
    goToStep(step);
  };

  return (
    <DemoShell showNav>
      <div className="demo-elo-membrane min-h-[calc(100dvh-5rem)]">
        <div
          className="px-4 pt-4 pb-6 demo-safe-pad-nav relative z-10"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <header className="mb-5 demo-animate-fade-up flex items-center gap-3">
            <button
              type="button"
              onClick={() => openFeedDemo()}
              className="w-10 h-10 rounded-full demo-glass-card flex items-center justify-center flex-shrink-0"
              aria-label="Back to feed"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold flex items-center gap-2">
                <span className="gradient-text">ELO</span>
              </h1>
              <p className="text-xs text-muted-foreground">Intelligent assistant layer</p>
            </div>
          </header>

          <div className="demo-glass-card p-4 mb-4 demo-elo-panel demo-animate-fade-up">
            <div className="flex flex-wrap gap-2 mb-4">
              {ELO_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setEloMode(mode.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    eloMode === mode.id
                      ? 'bg-primary/25 border-primary/50 text-primary'
                      : 'bg-white/5 border-white/10 text-muted-foreground',
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">
              Ask ELO
            </p>
            <div className="space-y-2">
              {ELO_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => selectEloPrompt(prompt.id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-colors',
                    selectedEloPrompt === prompt.id
                      ? 'border-primary/40 bg-primary/10 text-foreground'
                      : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20',
                  )}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {response && (
            <div className="demo-glass-card p-4 mb-4 border-violet-400/20 demo-animate-fade-up">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                  ELO · {eloMode}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{response}</p>
            </div>
          )}

          <div className="demo-animate-fade-up">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold px-1">
              Route to
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="demo-cta-secondary demo-cta !min-h-10 text-xs"
                onClick={() => route('wallet', 'wallet')}
              >
                Wallet
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
                onClick={() => route('profile', 'profile')}
              >
                Creator Profile
              </button>
              <button
                type="button"
                className="demo-cta-secondary demo-cta !min-h-10 text-xs"
                onClick={() => route('campaignBuilder', 'create')}
              >
                Campaign Builder
              </button>
              <button
                type="button"
                className="demo-cta-secondary demo-cta !min-h-10 text-xs col-span-2"
                onClick={() => openProductMap()}
              >
                Product Map
              </button>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/80 text-center mt-6 leading-relaxed px-2">
            {ELO_DISCLAIMER}
          </p>
        </div>
      </div>
    </DemoShell>
  );
};
