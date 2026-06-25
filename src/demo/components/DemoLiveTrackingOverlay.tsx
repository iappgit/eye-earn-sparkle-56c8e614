import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CameraStatus = 'checking' | 'active' | 'denied' | 'unavailable';

interface DemoLiveTrackingOverlayProps {
  progress: number;
  popScore: number;
}

const PRIVACY_COPY =
  'Simulated POP tracking preview. Camera stays local and is not recorded.';

function getTrackingPhase(progress: number): string {
  if (progress >= 100) return 'Reward eligible';
  if (progress >= 70) return 'Confirming';
  if (progress >= 25) return 'Tracking';
  return 'Calibrating';
}

function getGazeConfidence(progress: number): number {
  if (progress >= 70) return Math.min(98, 88 + Math.round((progress - 70) * 0.33));
  if (progress >= 25) return Math.min(87, 58 + Math.round((progress - 25) * 0.65));
  return Math.max(42, 38 + Math.round(progress * 0.8));
}

const GATE_LABELS = [
  { key: 'face', label: 'Face detected', min: 8 },
  { key: 'eyes', label: 'Eyes open', min: 20 },
  { key: 'gaze', label: 'Gaze centered', min: 40 },
  { key: 'session', label: 'Session stable', min: 55 },
  { key: 'pop', label: 'POP eligible', min: 85 },
] as const;

export const DemoLiveTrackingOverlay: React.FC<DemoLiveTrackingOverlayProps> = ({
  progress,
  popScore,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('checking');
  const [hasCameraPreview, setHasCameraPreview] = useState(false);
  const [blinkPulse, setBlinkPulse] = useState(false);

  const phase = getTrackingPhase(progress);
  const gazeConfidence = getGazeConfidence(progress);
  const gazeOffset = useMemo(() => {
    const t = progress / 100;
    return Math.max(-12, Math.min(12, 14 - t * 26));
  }, [progress]);

  useEffect(() => {
    let cancelled = false;

    async function initCamera() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('unavailable');
        setHasCameraPreview(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraStatus('active');
        setHasCameraPreview(true);
      } catch (err) {
        if (cancelled) return;
        const denied =
          err instanceof DOMException &&
          (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
        setCameraStatus(denied ? 'denied' : 'unavailable');
        setHasCameraPreview(false);
      }
    }

    void initCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    if (cameraStatus !== 'active' || !streamRef.current || !videoRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    void videoRef.current.play().catch(() => undefined);
  }, [cameraStatus, hasCameraPreview]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkPulse(true);
      setTimeout(() => setBlinkPulse(false), 280);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const showSynthetic = !hasCameraPreview || cameraStatus !== 'active';

  return (
    <section className="demo-tracking-root mx-4 mb-3 demo-animate-fade-up" aria-label="POP live tracking preview">
      <div className="demo-tracking-header">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
            POP live tracking
          </p>
          <p className="text-xs text-muted-foreground">{phase} · demo layer</p>
        </div>
        <span
          className={cn(
            'demo-tracking-phase-badge',
            progress >= 100 && 'demo-tracking-phase-badge-ready',
          )}
        >
          {phase}
        </span>
      </div>

      <div className="demo-tracking-viewport demo-glow-ring">
        {hasCameraPreview && cameraStatus === 'active' && (
          <video
            ref={videoRef}
            className="demo-tracking-camera"
            playsInline
            muted
            autoPlay
            aria-hidden
          />
        )}

        {showSynthetic && (
          <div className="demo-tracking-synthetic" aria-hidden>
            <SyntheticFaceMesh progress={progress} gazeOffset={gazeOffset} blinkPulse={blinkPulse} />
          </div>
        )}

        <TrackingSvgOverlay
          progress={progress}
          gazeOffset={gazeOffset}
          blinkPulse={blinkPulse}
          dimmed={hasCameraPreview && cameraStatus === 'active'}
        />

        <div className="demo-tracking-gate-row">
          {GATE_LABELS.map((gate) => (
            <span
              key={gate.key}
              className={cn(
                'demo-tracking-gate',
                progress >= gate.min && 'demo-tracking-gate-active',
              )}
            >
              {gate.label}
            </span>
          ))}
        </div>
      </div>

      <p className="demo-tracking-camera-note">
        {cameraStatus === 'checking' && 'Checking local camera preview…'}
        {cameraStatus === 'active' && 'Local camera preview active'}
        {(cameraStatus === 'denied' || cameraStatus === 'unavailable') &&
          'Camera unavailable — simulated tracking layer active'}
      </p>

      <div className="demo-tracking-status-grid">
        <StatusCard label="Face presence" value="Live" active={progress >= 8} />
        <StatusCard
          label="Gaze confidence"
          value={`${gazeConfidence}%`}
          active={progress >= 25}
        />
        <StatusCard label="Eye openness" value="Stable" active={progress >= 20} />
        <StatusCard
          label="POP score"
          value={progress >= 70 ? `${popScore}%` : 'Preview'}
          active={progress >= 55}
        />
        <StatusCard
          label="Fraud screen"
          value={progress >= 70 ? 'Passed preview' : 'Scanning'}
          active={progress >= 70}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="demo-tracking-bars">
        <Bar label="Attention confidence" value={gazeConfidence} />
        <Bar label="Session integrity" value={Math.min(100, Math.round(progress * 0.92 + 8))} />
        <Bar label="Reward eligibility" value={Math.min(100, Math.round(progress * 0.98))} />
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
}: {
  progress: number;
  gazeOffset: number;
  blinkPulse: boolean;
  dimmed: boolean;
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
        Head pose · preview {Math.min(99, 12 + Math.round(progress * 0.7))}° stable
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
