import React, { useEffect, useRef, useState } from 'react';
import { Eye, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EyeTrackingIndicator } from '@/components/EyeTrackingIndicator';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import { DemoLiveTrackingOverlay } from '../components/DemoLiveTrackingOverlay';
import {
  DemoPopTrackingState,
  useDemoPopTracking,
} from '../hooks/useDemoPopTracking';

const VERIFY_DURATION_MS = 4500;
const TICK_MS = 80;

function getVerifySignalLabel(progress: number, tracking: DemoPopTrackingState) {
  if (progress >= 85 && tracking.eligible) return 'Reward eligible';
  if (tracking.cameraStatus === 'active' && tracking.popScore >= 70) return 'Tracking live';
  if (tracking.cameraStatus === 'denied') return 'Simulation fallback active';
  if (tracking.trackingMode === 'synthetic') return 'Simulation fallback active';
  if (progress < 35 || tracking.attentionConfidence < 45) return 'Calibrating';
  return 'Measuring attention';
}

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
  const [lowAttentionNote, setLowAttentionNote] = useState(false);
  const completedRef = useRef(false);
  const verifyActive = !!offer && !isAlreadyClaimed;

  const popTracking = useDemoPopTracking({
    enabled: verifyActive,
    progress: state.verificationProgress,
  });
  const trackingRef = useRef(popTracking);

  useEffect(() => {
    trackingRef.current = popTracking;
  }, [popTracking]);

  useEffect(() => {
    if (!offer || !isAlreadyClaimed) return;
    setNavTab('wallet');
    goToStep('wallet');
  }, [offer, isAlreadyClaimed, goToStep, setNavTab]);

  useEffect(() => {
    if (!verifyActive) return;

    completedRef.current = false;
    setPhase('watching');
    setLowAttentionNote(false);
    setVerificationProgress(0);
    setPopScore(0);

    let elapsed = 0;
    let localPhase: 'watching' | 'scoring' | 'complete' = 'watching';

    const interval = setInterval(() => {
      elapsed += TICK_MS;
      const timerProgress = Math.min(100, (elapsed / VERIFY_DURATION_MS) * 100);
      const tracking = trackingRef.current;
      const progress = Math.round(timerProgress);

      setVerificationProgress(progress);
      setPopScore(tracking.popScore);

      if (progress >= 55 && localPhase === 'watching') {
        localPhase = 'scoring';
        setPhase('scoring');
      }

      if (progress >= 100 && !completedRef.current) {
        completedRef.current = true;
        localPhase = 'complete';
        setPhase('complete');
        clearInterval(interval);

        if (tracking.cameraStatus === 'active' && tracking.popScore < 70) {
          setLowAttentionNote(true);
        }

        setTimeout(() => {
          claimReward();
        }, 600);
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [
    verifyActive,
    offer,
    claimReward,
    setVerificationProgress,
    setPopScore,
  ]);

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
  const verifySignalLabel = getVerifySignalLabel(progress, popTracking);

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
            Live verification
          </span>
          <DemoPreviewChip />
        </div>

        <DemoLiveTrackingOverlay
          progress={progress}
          tracking={popTracking}
        />

        <div className="relative mx-4 rounded-2xl overflow-hidden demo-glow-ring min-h-[28dvh] max-h-[38dvh]">
          <img
            src={offer.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 via-transparent to-[#0a0a0f]/30" />

          <EyeTrackingIndicator
            isTracking={popTracking.cameraStatus === 'active'}
            isFaceDetected={popTracking.facePresent}
            attentionScore={popTracking.attentionConfidence}
            position="top-right"
            className="z-10"
          />

          <div className="absolute top-4 left-4 right-4">
            <div className="demo-progress-bar">
              <div
                className="demo-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-white/70 mt-2 text-center">
              {phase === 'watching' && verifySignalLabel}
              {phase === 'scoring' && verifySignalLabel}
              {phase === 'complete' && 'Verification complete'}
            </p>
          </div>

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
            {lowAttentionNote && (
              <p className="text-xs text-amber-400/90 mt-2">
                Preview — lower attention detected; reward still completes in demo mode.
              </p>
            )}
          </div>

          <PopSignalPreview tracking={popTracking} />

          <div className="demo-glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Proof-of-presence
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
              Prototype POP signals. Camera stays local and is not recorded.
            </p>
          </div>
        </div>
      </div>
    </DemoShell>
  );
};

function getSignalEngineLabel(tracking: DemoPopTrackingState): string {
  if (tracking.trackingMode === 'synthetic') return 'Synthetic';
  if (tracking.signalSource === 'mediapipe') return 'MediaPipe';
  return 'Canvas';
}

function PopSignalPreview({ tracking }: { tracking: DemoPopTrackingState }) {
  return (
    <div className="demo-glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            POP signal preview
          </p>
          <p className="text-[0.65rem] text-muted-foreground">
            Prototype-only local signals
          </p>
        </div>
        <span
          className={cn(
            'text-xs font-semibold rounded-full px-2 py-1 border',
            tracking.trackingMode === 'camera-preview'
              ? 'text-green-300 border-green-500/30 bg-green-500/10'
              : 'text-amber-300 border-amber-500/30 bg-amber-500/10',
          )}
        >
          {tracking.trackingMode === 'camera-preview'
            ? `Camera · ${getSignalEngineLabel(tracking)}`
            : 'Synthetic'}
        </span>
      </div>

      <div className="space-y-2">
        <SignalRow
          label="Camera"
          value={
            tracking.cameraStatus === 'active'
              ? 'Active'
              : tracking.cameraStatus === 'checking'
                ? 'Checking'
                : 'Fallback'
          }
          active={tracking.cameraStatus === 'active'}
          meter={tracking.cameraStatus === 'active' ? 100 : 55}
        />
        <SignalRow
          label="Signal engine"
          value={getSignalEngineLabel(tracking)}
          active={tracking.trackingMode === 'camera-preview'}
          meter={
            tracking.signalSource === 'mediapipe'
              ? 92
              : tracking.signalSource === 'canvas'
                ? 74
                : 58
          }
        />
        <SignalRow
          label="Face presence"
          value={tracking.facePresent ? 'Present' : 'Seeking'}
          active={tracking.facePresent}
          meter={tracking.facePresent ? 88 : 35}
        />
        <SignalRow
          label="Eye openness"
          value={tracking.eyesOpen ? 'Open' : tracking.blinkPulse ? 'Blink' : 'Scanning'}
          active={tracking.eyesOpen}
          meter={tracking.eyesOpen ? 84 : 42}
        />
        <SignalRow
          label="Gaze center"
          value={tracking.gazeCentered ? 'Centered' : 'Calibrating'}
          active={tracking.gazeCentered}
          meter={tracking.gazeConfidence}
        />
        <SignalRow
          label="Session stability"
          value={tracking.sessionStable ? 'Stable' : 'Building'}
          active={tracking.sessionStable}
          meter={tracking.sessionStable ? 92 : Math.min(70, tracking.attentionConfidence)}
        />
        <SignalRow
          label="POP score"
          value={`${tracking.popScore}%`}
          active={tracking.eligible}
          meter={tracking.popScore}
        />
      </div>
    </div>
  );
}

function SignalRow({
  label,
  value,
  active,
  meter,
}: {
  label: string;
  value: string;
  active: boolean;
  meter: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 items-center text-xs">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2
            className={cn(
              'w-3.5 h-3.5 flex-shrink-0',
              active ? 'text-green-400' : 'text-muted-foreground/55',
            )}
          />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <div className="demo-progress-bar h-1.5">
          <div
            className="demo-progress-fill"
            style={{ width: `${Math.max(5, Math.min(100, meter))}%` }}
          />
        </div>
      </div>
      <span className={cn('font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>
        {value}
      </span>
    </div>
  );
}
