import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';

export const DemoReward: React.FC = () => {
  const { state, setNavTab, goToStep } = useDemoState();
  const offer = state.selectedOffer;
  const [showCoin, setShowCoin] = useState(true);
  const [particles, setParticles] = useState<
    { id: number; x: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    const colors = [
      'hsl(270 95% 65%)',
      'hsl(320 90% 60%)',
      'hsl(45 100% 55%)',
      'hsl(185 100% 50%)',
    ];
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        delay: Math.random() * 0.4,
        color: colors[i % colors.length],
      })),
    );
    const t = setTimeout(() => setShowCoin(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!offer) {
    return (
      <DemoShell>
        <button type="button" className="demo-cta max-w-xs mx-auto mt-20" onClick={() => goToStep('feed')}>
          Back to feed
        </button>
      </DemoShell>
    );
  }

  const coinLabel = offer.rewardType === 'acoin' ? 'ACoins' : 'iCoins';

  return (
    <DemoShell showDisclaimer>
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center relative overflow-hidden">
        {/* Celebration particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: '30%',
              backgroundColor: p.color,
              animation: `demo-fade-up 1.2s ease-out ${p.delay}s forwards`,
              opacity: 0,
            }}
          />
        ))}

        {showCoin && (
          <div
            className={cn(
              'demo-coin-badge text-xl mb-6 absolute',
              offer.rewardType === 'acoin' ? 'demo-coin-acoin' : 'demo-coin-icoin',
            )}
            style={{ animation: 'demo-coin-fly 1.2s ease-in forwards', top: '35%' }}
          >
            {offer.rewardType === 'acoin' ? 'A' : 'i'}
          </div>
        )}

        <div className="demo-animate-scale-in relative z-10 max-w-sm">
          <div className="w-20 h-20 rounded-full demo-glass-card demo-glow-ring flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>

          <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-2">
            Reward unlocked
          </p>
          <h1 className="font-display text-3xl font-bold mb-2">
            <span
              className={cn(
                offer.rewardType === 'acoin' ? 'gradient-text' : 'gradient-text-gold',
              )}
            >
              +{offer.rewardAmount} {coinLabel}
            </span>
          </h1>
          <p className="text-foreground/90 text-lg mb-1">{offer.brandName}</p>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Simulated verified attention converted into demo wallet value.
            Attention score:{' '}
            <span className="text-foreground font-medium">{state.popScore}%</span>
          </p>

          <div className="demo-glass-card p-4 mb-8 text-left">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Session earnings</span>
            </div>
            <p className="text-2xl font-display font-bold gradient-text">
              +{state.earnedThisSession} {coinLabel}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Added to your demo balance — not real currency.
            </p>
          </div>

          <button
            type="button"
            className="demo-cta"
            onClick={() => setNavTab('wallet')}
          >
            Open wallet
          </button>
        </div>
      </div>
    </DemoShell>
  );
};
