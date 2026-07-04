import { useEffect, useMemo, useRef, useState } from 'react';
import { DemoPopMediaPipeAdapter } from '../lib/demoPopMediaPipeAdapter';
import {
  POP_FRAME_HEIGHT,
  POP_FRAME_WIDTH,
  analyzeCanvasFrame,
  computePopSignals,
  createSyntheticPopSignals,
  mergeFrameSignals,
  type DemoPopFrameSignal,
} from '../lib/demoPopSignalMath';

export type DemoPopCameraStatus = 'checking' | 'active' | 'denied' | 'unavailable';
export type DemoPopTrackingMode = 'camera-preview' | 'synthetic';
export type DemoPopSignalSource = 'mediapipe' | 'canvas' | 'synthetic';

export interface DemoPopTrackingState {
  cameraStatus: DemoPopCameraStatus;
  trackingMode: DemoPopTrackingMode;
  signalSource: DemoPopSignalSource;
  facePresent: boolean;
  eyesOpen: boolean;
  gazeCentered: boolean;
  blinkPulse: boolean;
  headStable: boolean;
  attentionConfidence: number;
  gazeConfidence: number;
  popScore: number;
  sessionStable: boolean;
  eligible: boolean;
  errorMessage?: string;
  stream: MediaStream | null;
}

interface UseDemoPopTrackingOptions {
  enabled?: boolean;
  progress?: number;
}

const DETECTION_MS = 180;
const MEDIAPIPE_FRAME_MS = 220;

function isPermissionDenied(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
  );
}

function emptySyntheticState(
  cameraStatus: DemoPopCameraStatus,
  progress: number,
  tick: number,
  errorMessage?: string,
): DemoPopTrackingState {
  const signals = createSyntheticPopSignals(progress, tick);
  return {
    cameraStatus,
    trackingMode: 'synthetic',
    signalSource: 'synthetic',
    ...signals,
    errorMessage,
    stream: null,
  };
}

export function useDemoPopTracking({
  enabled = true,
  progress = 0,
}: UseDemoPopTrackingOptions = {}): DemoPopTrackingState {
  const [state, setState] = useState<DemoPopTrackingState>(() => ({
    ...emptySyntheticState(enabled ? 'checking' : 'unavailable', 0, 0),
  }));

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const progressRef = useRef(progress);
  const frameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syntheticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaPipeRef = useRef<DemoPopMediaPipeAdapter | null>(null);
  const mediaPipeReadyRef = useRef(false);
  const lastMediaPipeAtRef = useRef(0);
  const sessionFramesRef = useRef({ stable: 0, total: 0 });
  const previousSignalRef = useRef<DemoPopFrameSignal | null>(null);
  const lastBlinkAtRef = useRef(0);
  const attentionRef = useRef(0);
  const gazeRef = useRef(0);

  const stopCamera = () => {
    if (frameTimerRef.current) {
      clearInterval(frameTimerRef.current);
      frameTimerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }

    void mediaPipeRef.current?.close();
    mediaPipeRef.current = null;
    mediaPipeReadyRef.current = false;
  };

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!enabled) {
      stopCamera();
      setState((prev) => ({
        ...emptySyntheticState('unavailable', progressRef.current, Date.now()),
        cameraStatus: 'unavailable',
      }));
      return;
    }

    let cancelled = false;

    const start = async () => {
      setState((prev) => ({
        ...prev,
        cameraStatus: 'checking',
        errorMessage: undefined,
      }));

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setState(emptySyntheticState(
          'unavailable',
          progressRef.current,
          Date.now(),
          'Camera API unavailable — synthetic POP preview active.',
        ));
        return;
      }

      const mediaPipe = new DemoPopMediaPipeAdapter();
      mediaPipeRef.current = mediaPipe;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: POP_FRAME_WIDTH },
            height: { ideal: POP_FRAME_HEIGHT },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;

        const canvas = document.createElement('canvas');
        canvas.width = POP_FRAME_WIDTH;
        canvas.height = POP_FRAME_HEIGHT;

        streamRef.current = stream;
        videoRef.current = video;
        canvasRef.current = canvas;
        sessionFramesRef.current = { stable: 0, total: 0 };
        previousSignalRef.current = null;
        lastBlinkAtRef.current = 0;
        attentionRef.current = 0;
        gazeRef.current = 0;

        await video.play();

        mediaPipeReadyRef.current = await mediaPipe.initialize();

        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          cameraStatus: 'active',
          trackingMode: 'camera-preview',
          signalSource: mediaPipeReadyRef.current ? 'mediapipe' : 'canvas',
          stream,
          errorMessage: undefined,
        }));

        frameTimerRef.current = setInterval(() => {
          const currentVideo = videoRef.current;
          const currentCanvas = canvasRef.current;
          if (!currentVideo || !currentCanvas) return;

          const ctx = currentCanvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return;

          ctx.drawImage(currentVideo, 0, 0, POP_FRAME_WIDTH, POP_FRAME_HEIGHT);
          const canvasSignal = analyzeCanvasFrame(ctx);

          const now = Date.now();
          const shouldRunMediaPipe =
            mediaPipeReadyRef.current &&
            now - lastMediaPipeAtRef.current >= MEDIAPIPE_FRAME_MS;

          const applySignals = (mediaPipeSample: ReturnType<DemoPopMediaPipeAdapter['lastSample']>) => {
            const merged = mergeFrameSignals(canvasSignal, mediaPipeSample);
            const signalSource: DemoPopSignalSource =
              merged.source === 'mediapipe' || merged.source === 'hybrid'
                ? 'mediapipe'
                : 'canvas';

            const computed = computePopSignals({
              signal: merged,
              previousSignal: previousSignalRef.current,
              sessionFrames: sessionFramesRef.current,
              lastBlinkAt: lastBlinkAtRef.current,
              progress: progressRef.current,
              previousAttention: attentionRef.current,
              previousGaze: gazeRef.current,
              signalSource,
            });

            previousSignalRef.current = merged;
            sessionFramesRef.current = computed.sessionFrames;
            lastBlinkAtRef.current = computed.lastBlinkAt;
            attentionRef.current = computed.attentionConfidence;
            gazeRef.current = computed.gazeConfidence;

            setState((prev) => ({
              ...prev,
              cameraStatus: 'active',
              trackingMode: 'camera-preview',
              signalSource: computed.signalSource,
              facePresent: computed.facePresent,
              eyesOpen: computed.eyesOpen,
              gazeCentered: computed.gazeCentered,
              blinkPulse: computed.blinkPulse,
              headStable: computed.headStable,
              attentionConfidence: computed.attentionConfidence,
              gazeConfidence: computed.gazeConfidence,
              popScore: computed.popScore,
              sessionStable: computed.sessionStable,
              eligible: computed.eligible,
              stream,
              errorMessage: undefined,
            }));
          };

          if (shouldRunMediaPipe && mediaPipeRef.current) {
            lastMediaPipeAtRef.current = now;
            void mediaPipeRef.current
              .processVideoFrame(currentVideo)
              .then((sample) => applySignals(sample))
              .catch(() => applySignals(mediaPipeRef.current?.lastSample ?? null));
          } else {
            applySignals(mediaPipeRef.current?.lastSample ?? null);
          }
        }, DETECTION_MS);
      } catch (error) {
        if (cancelled) return;
        stopCamera();
        setState(emptySyntheticState(
          isPermissionDenied(error) ? 'denied' : 'unavailable',
          progressRef.current,
          Date.now(),
          isPermissionDenied(error)
            ? 'Camera permission denied — synthetic POP preview active.'
            : 'Camera unavailable — synthetic POP preview active.',
        ));
      }
    };

    void start();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || state.trackingMode !== 'synthetic') return;

    syntheticTimerRef.current = setInterval(() => {
      const tick = Date.now();
      const syntheticProgress = progressRef.current;
      setState((prev) => ({
        ...emptySyntheticState(
          prev.cameraStatus === 'denied' ? 'denied' : 'unavailable',
          syntheticProgress,
          tick,
          prev.errorMessage,
        ),
      }));
    }, 180);

    return () => {
      if (syntheticTimerRef.current) {
        clearInterval(syntheticTimerRef.current);
        syntheticTimerRef.current = null;
      }
    };
  }, [enabled, state.trackingMode]);

  return useMemo(() => state, [state]);
}
