import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Map, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { useDemoRecording } from '../demoRecordingContext';
import {
  GUIDED_TOUR_STEPS,
  getFeaturedOfferForTour,
  type GuidedTourStep,
} from '../guidedTourSteps';

interface DemoGuidedTourProps {
  active: boolean;
  onClose: () => void;
}

export const DemoGuidedTour: React.FC<DemoGuidedTourProps> = ({
  active,
  onClose,
}) => {
  const {
    state,
    goToStep,
    setNavTab,
    setWalletTab,
    selectOffer,
    approvePendingAcoins,
    publishCampaignPreview,
    setStudioPreviewReady,
  } = useDemoState();
  const { isRecordingMode } = useDemoRecording();
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAppliedRef = useRef(-1);

  const step = GUIDED_TOUR_STEPS[stepIndex];
  const total = GUIDED_TOUR_STEPS.length;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyStep = useCallback(
    (tourStep: GuidedTourStep, index: number) => {
      if (tourStep.navTab) setNavTab(tourStep.navTab);
      if (tourStep.walletTab) setWalletTab(tourStep.walletTab);
      goToStep(tourStep.targetStep);

      if (tourStep.onEnter === 'selectFeaturedOffer') {
        selectOffer(getFeaturedOfferForTour());
      }
      if (tourStep.onEnter === 'approvePendingAcoins' && state.pendingAcoins > 0) {
        approvePendingAcoins();
      }
      if (tourStep.onEnter === 'prepareAndPublishCampaign' && !state.campaignPublished) {
        setStudioPreviewReady(true);
        publishCampaignPreview();
      }

      lastAppliedRef.current = index;
    },
    [
      goToStep,
      setNavTab,
      setWalletTab,
      selectOffer,
      approvePendingAcoins,
      publishCampaignPreview,
      setStudioPreviewReady,
      state.pendingAcoins,
      state.campaignPublished,
    ],
  );

  const goToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(GUIDED_TOUR_STEPS.length - 1, index));
      setStepIndex(clamped);
      applyStep(GUIDED_TOUR_STEPS[clamped], clamped);
    },
    [applyStep],
  );

  const handleNext = useCallback(() => {
    if (stepIndex >= total - 1) {
      onClose();
      return;
    }
    goToIndex(stepIndex + 1);
  }, [goToIndex, onClose, stepIndex, total]);

  const handleBack = useCallback(() => {
    goToIndex(stepIndex - 1);
  }, [goToIndex, stepIndex]);

  useEffect(() => {
    if (!active) {
      clearTimer();
      lastAppliedRef.current = -1;
      return;
    }

    if (lastAppliedRef.current !== stepIndex) {
      applyStep(step, stepIndex);
    }
  }, [active, applyStep, clearTimer, step, stepIndex]);

  useEffect(() => {
    if (!active || !isRecordingMode || paused) {
      clearTimer();
      return;
    }

    const dwell = step.dwellMs ?? 3500;
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (stepIndex >= total - 1) {
        onClose();
        return;
      }
      goToIndex(stepIndex + 1);
    }, dwell);

    return clearTimer;
  }, [
    active,
    clearTimer,
    goToIndex,
    isRecordingMode,
    onClose,
    paused,
    step,
    stepIndex,
    total,
  ]);

  useEffect(() => {
    if (active && isRecordingMode && stepIndex === 0) {
      setPaused(false);
    }
  }, [active, isRecordingMode, stepIndex]);

  if (!active || !step) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[60] px-4 pointer-events-none"
      style={{
        bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
      }}
      role="region"
      aria-label="Guided investor tour"
    >
      <div className="max-w-lg mx-auto demo-glass-card demo-glow-ring p-4 pointer-events-auto demo-animate-fade-up">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5" />
              Guided tour · {stepIndex + 1} / {total}
            </p>
            <h2 className="font-display font-bold text-sm mt-0.5">{step.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full demo-glass-card flex items-center justify-center flex-shrink-0"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {step.narration}
        </p>

        {isRecordingMode && (
          <p className="text-[0.65rem] text-violet-300 mb-3">
            Recording mode —{' '}
            {paused ? 'paused' : `auto-advance in ~${Math.round((step.dwellMs ?? 3500) / 1000)}s`}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              'demo-cta-secondary demo-cta !min-h-9 text-xs flex-1',
              stepIndex === 0 && 'opacity-40 pointer-events-none',
            )}
            onClick={handleBack}
            disabled={stepIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 inline mr-1" />
            Back
          </button>
          {isRecordingMode && (
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-9 text-xs px-4"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            type="button"
            className="demo-cta !min-h-9 text-xs flex-1"
            onClick={handleNext}
          >
            {stepIndex >= total - 1 ? 'Finish' : 'Next'}
            {stepIndex < total - 1 && (
              <ChevronRight className="w-4 h-4 inline ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/** Compact badge shown when ?recording=1 is active. */
export const DemoRecordingBadge: React.FC = () => {
  const { isRecordingMode } = useDemoRecording();
  if (!isRecordingMode) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70] flex justify-center pointer-events-none"
      style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
    >
      <span className="demo-preview-chip bg-violet-500/20 border-violet-400/40 text-violet-200">
        Recording mode
      </span>
    </div>
  );
};
