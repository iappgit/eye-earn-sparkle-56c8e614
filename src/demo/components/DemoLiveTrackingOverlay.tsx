import React, { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { DemoPopTrackingState } from '../hooks/useDemoPopTracking';

interface DemoLiveTrackingOverlayProps {
  progress: number;
  tracking: DemoPopTrackingState;
}

const PRIVACY_COPY =
  'Prototype POP signals. Camera stays local and is not recorded.';

function getSignalEngineLabel(tracking: DemoPopTrackingState): string {
  if (tracking.trackingMode === 'synthetic') return 'synthetic mode';
  if (tracking.signalSource === 'mediapipe') return 'MediaPipe engine';
  return 'canvas heuristics';
}

function getTrackingPhase(progress: number, tracking: DemoPopTrackingState): string {
  if (tracking.eligible || progress >= 100) return 'Reward eligible';
  if (tracking.trackingMode === 'synthetic') return 'Simulation fallback active';
  if (tracking.cameraStatus === 'active' && tracking.popScore >= 72) return 'Tracking live';
  if (progress >= 25 || tracking.attentionConfidence >= 45) return 'Calibrating signals';
  return 'Calibrating';
}

const GATE_LABELS = [
  { key: 'face', label: 'Face present' },
  { key: 'eyes', label: 'Eyes open' },
  { key: 'gaze', label: 'Gaze centered' },
  { key: 'session', label: 'Session stable' },
  { key: 'pop', label: 'POP eligible' },
] as const;

export const DemoLiveTrackingOverlay: React.FC<DemoLiveTrackingOverlayProps> = ({
  progress,
  tracking,
}) => {
  const previewRef = useRef<HTMLVideoElement>(null);
  const showSynthetic = tracking.trackingMode === 'synthetic';
  const isCameraPreview = tracking.trackingMode === 'camera-preview';

  const phase = getTrackingPhase(progress, tracking);

  const gazeOffset = useMemo(() => {
    if (tracking.facePresent) {
      return Math.max(-12, Math.min(12, (tracking.gazeConfidence - 55) * 0.18));
    }
    const t = progress / 100;
    return Math.max(-12, Math.min(12, 14 - t * 26));
  }, [tracking.facePresent, tracking.gazeConfidence, progress]);

  const gateActive = (gateKey: string) => {
    if (gateKey === 'face') return tracking.facePresent;
    if (gateKey === 'eyes') return tracking.eyesOpen;
    if (gateKey === 'gaze') return tracking.gazeCentered;
    if (gateKey === 'session') return tracking.sessionStable;
    if (gateKey === 'pop') return tracking.eligible;
    return false;
  };

  useEffect(() => {
    if (!previewRef.current || !tracking.stream) return;
    previewRef.current.srcObject = tracking.stream;
    void previewRef.current.play().catch(() => undefined);
  }, [tracking.stream]);

  const rewardEligibility = Math.min(100, Math.round((tracking.popScore + progress) / 2));

  return (
    <section className="demo-tracking-root mx-4 mb-3 demo-animate-fade-up" aria-label="POP live tracking preview">
      <div className="demo-tracking-header">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
            POP live tracking
          </p>
          <p className="text-xs text-muted-foreground">
            {phase} · {getSignalEngineLabel(tracking)}
          </p>
        </div>
        <span
          className={cn(
            'demo-tracking-phase-badge',
            tracking.eligible && 'demo-tracking-phase-badge-ready',
          )}
        >
          {phase}
        </span>
      </div>

      <div className="demo-tracking-viewport demo-glow-ring">
        {isCameraPreview && tracking.stream && (
          <video
            ref={previewRef}
            className="demo-tracking-camera"
            muted
            playsInline
            autoPlay
            aria-hidden
          />
        )}

        {showSynthetic && (
          <div className="demo-tracking-synthetic" aria-hidden>
            <SyntheticFaceMesh progress={progress} gazeOffset={gazeOffset} blinkPulse={tracking.blinkPulse} />
          </div>
        )}

        {isCameraPreview && (
          <div className="demo-tracking-live-badge" aria-hidden>
            <span className="demo-tracking-live-dot" />
            Camera active
          </div>
        )}

        <TrackingSvgOverlay
          progress={progress}
          gazeOffset={gazeOffset}
          blinkPulse={tracking.blinkPulse}
          dimmed={isCameraPreview}
          headStable={tracking.headStable}
        />

        <div className="demo-tracking-gate-row">
          {GATE_LABELS.map((gate) => (
            <span
              key={gate.key}
              className={cn(
                'demo-tracking-gate',
                gateActive(gate.key) && 'demo-tracking-gate-active',
              )}
            >
              {gate.label}
            </span>
          ))}
        </div>
      </div>

      <p className="demo-tracking-camera-note">
        {tracking.cameraStatus === 'checking' && 'Checking local camera access…'}
        {tracking.cameraStatus === 'active' && 'Local camera preview active'}
        {tracking.cameraStatus === 'denied' && 'Camera denied — simulation fallback active'}
        {tracking.cameraStatus === 'unavailable' && 'Camera unavailable — simulation fallback active'}
      </p>

      <div className="demo-tracking-status-grid">
        <StatusCard
          label="Face presence"
          value={tracking.facePresent ? 'Present' : 'Seeking'}
          active={tracking.facePresent}
        />
        <StatusCard
          label="Gaze confidence"
          value={`${tracking.gazeConfidence}%`}
          active={tracking.gazeCentered}
        />
        <StatusCard
          label="Eye openness"
          value={tracking.eyesOpen ? 'Open' : tracking.blinkPulse ? 'Blink' : 'Scanning'}
          active={tracking.eyesOpen}
        />
        <StatusCard
          label="POP score"
          value={`${tracking.popScore}%`}
          active={tracking.eligible}
        />
        <StatusCard
          label="Signal integrity"
          value={tracking.sessionStable ? 'Stable' : 'Calibrating'}
          active={tracking.sessionStable}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="demo-tracking-bars">
        <Bar label="Attention confidence" value={tracking.attentionConfidence} />
        <Bar label="Session integrity" value={tracking.sessionStable ? 92 : Math.min(78, tracking.attentionConfidence)} />
        <Bar label="Reward eligibility" value={rewardEligibility} />
      </div>

      <p className="demo-tracking-privacy">{PRIVACY_COPY}</p>
    </section>
  );
};

function StatusCard({
  label,
  value,
  active,
  className,
}: {
  label: string;
  value: string;
  active: boolean;
  className?: string;
}) {
  return (
    <div className={cn('demo-tracking-status-card', active && 'demo-tracking-status-card-active', className)}>
      <p className="demo-tracking-status-label">{label}</p>
      <p className="demo-tracking-status-value">{value}</p>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="demo-tracking-bar-row">
      <div className="flex items-center justify-between text-[0.6rem] text-muted-foreground mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="demo-tracking-bar-track">
        <div className="demo-tracking-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SyntheticFaceMesh({
  progress,
  gazeOffset,
  blinkPulse,
}: {
  progress: number;
  gazeOffset: number;
  blinkPulse: boolean;
}) {
  return (
    <svg viewBox="0 0 200 160" className="demo-tracking-synthetic-svg">
      <ellipse cx="100" cy="82" rx="52" ry="64" className="demo-tracking-synth-face" />
      <path
        d="M72 58 Q100 38 128 58"
        className="demo-tracking-synth-line"
        fill="none"
      />
      <circle cx="78" cy="72" r="5" className="demo-tracking-synth-dot" />
      <circle cx="122" cy="72" r="5" className="demo-tracking-synth-dot" />
      <ellipse
        cx={78 + gazeOffset * 0.15}
        cy="72"
        rx={blinkPulse ? 1.5 : 2.5}
        ry={blinkPulse ? 0.8 : 2.5}
        className="demo-tracking-synth-pupil demo-tracking-eye-left"
      />
      <ellipse
        cx={122 + gazeOffset * 0.15}
        cy="72"
        rx={blinkPulse ? 1.5 : 2.5}
        ry={blinkPulse ? 0.8 : 2.5}
        className="demo-tracking-synth-pupil demo-tracking-eye-right"
      />
      <path d="M88 98 Q100 108 112 98" className="demo-tracking-synth-line" fill="none" />
      {[
        [100, 42],
        [72, 52],
        [128, 52],
        [58, 82],
        [142, 82],
        [100, 118],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2"
          className="demo-tracking-synth-landmark"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <line
        x1="100"
        y1="72"
        x2={100 + gazeOffset}
        y2="72"
        className="demo-tracking-gaze-line"
      />
      <rect
        x="48"
        y="24"
        width="104"
        height="116"
        rx="12"
        className="demo-tracking-face-box"
        style={{ opacity: 0.35 + progress / 220 }}
      />
    </svg>
  );
}

function TrackingSvgOverlay({
  progress,
  gazeOffset,
  blinkPulse,
  dimmed,
  headStable,
}: {
  progress: number;
  gazeOffset: number;
  blinkPulse: boolean;
  dimmed: boolean;
  headStable: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={cn('demo-tracking-overlay-svg', dimmed && 'demo-tracking-overlay-svg-dimmed')}
      aria-hidden
    >
      <rect
        x="46"
        y="22"
        width="108"
        height="120"
        rx="14"
        className="demo-tracking-face-box demo-tracking-face-box-live"
      />
      <circle cx="78" cy="68" r="8" className="demo-tracking-eye-ring" />
      <circle cx="122" cy="68" r="8" className="demo-tracking-eye-ring" />
      <circle
        cx={78 + gazeOffset * 0.2}
        cy="68"
        r={blinkPulse ? 2 : 3.5}
        className="demo-tracking-pupil demo-tracking-eye-left"
      />
      <circle
        cx={122 + gazeOffset * 0.2}
        cy="68"
        r={blinkPulse ? 2 : 3.5}
        className="demo-tracking-pupil demo-tracking-eye-right"
      />
      <line
        x1="100"
        y1="68"
        x2={100 + gazeOffset * 1.4}
        y2="68"
        className="demo-tracking-gaze-line"
      />
      <circle cx={100 + gazeOffset * 1.4} cy="68" r="3" className="demo-tracking-gaze-target" />
      {[
        [100, 38],
        [68, 58],
        [132, 58],
        [54, 82],
        [146, 82],
        [100, 112],
        [82, 96],
        [118, 96],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.2"
          className="demo-tracking-landmark"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
      <text x="100" y="148" textAnchor="middle" className="demo-tracking-head-pose">
        Head pose · {headStable ? 'stable' : 'calibrating'} {Math.min(99, 12 + Math.round(progress * 0.7))}°
      </text>
      <circle
        cx="168"
        cy="34"
        r="10"
        className={cn('demo-tracking-blink-ring', blinkPulse && 'demo-tracking-blink-ring-active')}
      />
      <text x="168" y="38" textAnchor="middle" className="demo-tracking-blink-label">
        blink
      </text>
    </svg>
  );
}
