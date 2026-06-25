import React, { useEffect, useRef, useState } from 'react';
import { Eye, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoPreviewChip } from '../components/DemoPreviewChip';

const VERIFY_DURATION_MS = 4500;
const TICK_MS = 80;

export const DemoVerify: React.FC = () => {
  const {
    state,
    goToStep,
    setNavTab,
    setVerificationProgress,
    setPopScore,
    claimReward,
  } = useDemoState();
  const offer = state.selectedOffer;
  const isAlreadyClaimed =
    offer != null && state.claimedOfferIds.includes(offer.id);
  const [phase, setPhase] = useState<'watching' | 'scoring' | 'complete'>('watching');
  const completedRef = useRef(false);

  useEffect(() => {
    if (!offer || !isAlreadyClaimed) return;
    setNavTab('wallet');
    goToStep('wallet');
  }, [offer, isAlreadyClaimed, goToStep, setNavTab]);

  useEffect(() => {
    if (!offer || isAlreadyClaimed) return;

    completedRef.current = false;
    setPhase('watching');
    setVerificationProgress(0);
    setPopScore(0);

    let elapsed = 0;
    let localPhase: 'watching' | 'scoring' | 'complete' = 'watching';

    const interval = setInterval(() => {
      elapsed += TICK_MS;
      const progress = Math.min(100, (elapsed / VERIFY_DURATION_MS) * 100);
      setVerificationProgress(Math.round(progress));

      if (progress >= 55 && localPhase === 'watching') {
        localPhase = 'scoring';
        setPhase('scoring');
      }

      const pop = Math.min(98, Math.round(72 + (progress / 100) * 26));
      setPopScore(pop);

      if (progress >= 100 && !completedRef.current) {
        completedRef.current = true;
        localPhase = 'complete';
        setPhase('complete');
        clearInterval(interval);
        setTimeout(() => {
          claimReward();
        }, 600);
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [offer, isAlreadyClaimed, claimReward, setVerificationProgress, setPopScore]);

  if (!offer) {
    return (
      <DemoShell>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6">
          <button type="button" className="demo-cta max-w-xs" onClick={() => goToStep('feed')}>
            Back to feed
          </button>
        </div>
      </DemoShell>
    );
  }

  if (isAlreadyClaimed) {
    return (
      <DemoShell>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center">
          <p className="text-muted-foreground mb-4">
            This offer was already claimed. Opening wallet…
          </p>
        </div>
      </DemoShell>
    );
  }

  const progress = state.verificationProgress;
  const popScore = state.popScore;

  return (
    <DemoShell showDisclaimer={false}>
      <div className="flex flex-col min-h-[100dvh]">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={() => goToStep('offer')}
            className="w-10 h-10 rounded-full demo-glass-card flex items-center justify-center"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Simulated verification
          </span>
          <DemoPreviewChip />
        </div>

        {/* Video preview area */}
        <div className="relative flex-1 mx-4 rounded-2xl overflow-hidden demo-glow-ring min-h-[45dvh] max-h-[55dvh]">
          <img
            src={offer.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 via-transparent to-[#0a0a0f]/30" />

          {/* Simulated play progress */}
          <div className="absolute top-4 left-4 right-4">
            <div className="demo-progress-bar">
              <div
                className="demo-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-white/70 mt-2 text-center">
              {phase === 'watching' && 'Watching brand story…'}
              {phase === 'scoring' && 'Measuring attention…'}
              {phase === 'complete' && 'Verification complete'}
            </p>
          </div>

          {/* Attention ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={cn(
                'w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                phase === 'complete'
                  ? 'border-green-400/80 bg-green-500/10'
                  : 'border-primary/50 bg-primary/5',
              )}
            >
              {phase === 'complete' ? (
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              ) : (
                <Eye
                  className={cn(
                    'w-10 h-10 text-primary',
                    phase === 'scoring' && 'animate-pulse',
                  )}
                />
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 demo-glass-card p-3 !rounded-xl">
            <p className="text-sm font-medium text-white mb-0.5">{offer.brandName}</p>
            <p className="text-xs text-white/60">{offer.durationSeconds}s · Demo stream</p>
          </div>
        </div>

        {/* Scores */}
        <div className="px-4 py-5 space-y-4">
          <div className="demo-glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Attention score</span>
              <span className="font-display font-bold text-lg gradient-text">
                {popScore}%
              </span>
            </div>
            <div className="demo-progress-bar">
              <div
                className="demo-progress-fill"
                style={{ width: `${popScore}%` }}
              />
            </div>
          </div>

          <div className="demo-glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Proof-of-presence (simulated)
              </span>
              <span
                className={cn(
                  'text-sm font-semibold',
                  progress >= 85 ? 'text-green-400' : 'text-foreground',
                )}
              >
                {progress >= 85 ? 'Verified' : 'In progress'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Demo mode uses timed simulation — no camera, GPS, or external
              services.
            </p>
          </div>
        </div>
      </div>
    </DemoShell>
  );
};
