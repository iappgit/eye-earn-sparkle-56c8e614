export interface DemoPopFrameSignal {
  skinRatio: number;
  brightness: number;
  darkEyeRatio: number;
  centroidX: number;
  centroidY: number;
  facePresent: boolean;
  source: 'canvas' | 'mediapipe' | 'hybrid';
}

export interface DemoPopComputedSignals {
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
  signalSource: 'mediapipe' | 'canvas' | 'synthetic';
}

export const POP_FRAME_WIDTH = 320;
export const POP_FRAME_HEIGHT = 240;

export const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

export const smooth = (previous: number, next: number, factor = 0.18) =>
  Math.round(previous * (1 - factor) + next * factor);

export function analyzeCanvasFrame(ctx: CanvasRenderingContext2D): DemoPopFrameSignal {
  const imageData = ctx.getImageData(0, 0, POP_FRAME_WIDTH, POP_FRAME_HEIGHT);
  const data = imageData.data;

  let skinPixels = 0;
  let totalBrightness = 0;
  let darkEyePixels = 0;
  let eyePixels = 0;
  let weightedX = 0;
  let weightedY = 0;

  const centerX = POP_FRAME_WIDTH / 2;
  const centerY = POP_FRAME_HEIGHT / 2;

  for (let y = 0; y < POP_FRAME_HEIGHT; y += 2) {
    for (let x = 0; x < POP_FRAME_WIDTH; x += 2) {
      const i = (y * POP_FRAME_WIDTH + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

      totalBrightness += brightness;

      const likelySkin =
        r > 55 &&
        g > 35 &&
        b > 18 &&
        r > b &&
        r - b > 12 &&
        Math.abs(r - g) > 8;

      if (likelySkin) {
        skinPixels++;
        weightedX += x - centerX;
        weightedY += y - centerY;
      }

      const inEyeBand =
        y > POP_FRAME_HEIGHT * 0.22 &&
        y < POP_FRAME_HEIGHT * 0.48 &&
        x > POP_FRAME_WIDTH * 0.22 &&
        x < POP_FRAME_WIDTH * 0.78;

      if (inEyeBand) {
        eyePixels++;
        if (brightness < 0.24) darkEyePixels++;
      }
    }
  }

  const sampledPixels = (POP_FRAME_WIDTH / 2) * (POP_FRAME_HEIGHT / 2);
  const skinRatio = skinPixels / sampledPixels;
  const brightness = totalBrightness / sampledPixels;
  const darkEyeRatio = eyePixels > 0 ? darkEyePixels / eyePixels : 0;
  const facePresent =
    skinRatio > 0.045 && brightness > 0.12 && brightness < 0.92;

  return {
    skinRatio,
    brightness,
    darkEyeRatio,
    centroidX: skinPixels > 0 ? weightedX / skinPixels : 0,
    centroidY: skinPixels > 0 ? weightedY / skinPixels : 0,
    facePresent,
    source: 'canvas',
  };
}

export interface DemoPopMediaPipeSample {
  facePresent: boolean;
  centroidX: number;
  centroidY: number;
  confidence: number;
}

export function mergeFrameSignals(
  canvas: DemoPopFrameSignal,
  mediaPipe: DemoPopMediaPipeSample | null,
): DemoPopFrameSignal {
  if (!mediaPipe?.facePresent) {
    return canvas;
  }

  return {
    ...canvas,
    centroidX: mediaPipe.centroidX,
    centroidY: mediaPipe.centroidY,
    facePresent: true,
    source: canvas.facePresent ? 'hybrid' : 'mediapipe',
  };
}

export function computePopSignals(params: {
  signal: DemoPopFrameSignal;
  previousSignal: DemoPopFrameSignal | null;
  sessionFrames: { stable: number; total: number };
  lastBlinkAt: number;
  progress: number;
  previousAttention: number;
  previousGaze: number;
  signalSource: 'mediapipe' | 'canvas' | 'synthetic';
}): DemoPopComputedSignals & { sessionFrames: { stable: number; total: number }; lastBlinkAt: number } {
  const {
    signal,
    previousSignal,
    sessionFrames,
    lastBlinkAt,
    progress,
    previousAttention,
    previousGaze,
    signalSource,
  } = params;

  const facePresent = signal.facePresent;
  const headDelta = previousSignal
    ? Math.abs(signal.centroidX - previousSignal.centroidX) +
      Math.abs(signal.centroidY - previousSignal.centroidY)
    : 0;
  const headStable = facePresent && headDelta < 13;
  const gazeCentered = facePresent && Math.abs(signal.centroidX) < 42;

  const brightnessDrop = previousSignal
    ? previousSignal.brightness - signal.brightness
    : 0;
  const now = Date.now();
  const blinkPulse =
    facePresent &&
    brightnessDrop > 0.055 &&
    signal.darkEyeRatio > 0.08 &&
    now - lastBlinkAt > 900;

  const nextBlinkAt = blinkPulse ? now : lastBlinkAt;
  const eyesOpen = facePresent && !blinkPulse && signal.darkEyeRatio < 0.2;

  const nextSession = { ...sessionFrames };
  nextSession.total++;
  if (facePresent && headStable) {
    nextSession.stable++;
  }

  const stableRatio =
    nextSession.total > 0 ? nextSession.stable / nextSession.total : 0;
  const sessionStable = nextSession.total >= 8 && stableRatio > 0.58;

  const attentionTarget = clamp(
    (facePresent ? 42 : 12) +
      (eyesOpen ? 20 : 4) +
      (gazeCentered ? 18 : 6) +
      (headStable ? 12 : 4) +
      stableRatio * 8 +
      (signalSource === 'mediapipe' ? 6 : 0),
  );
  const gazeTarget = clamp(
    (facePresent ? 35 : 10) +
      (gazeCentered ? 38 : 10) +
      (headStable ? 17 : 5) +
      Math.max(0, 10 - Math.abs(signal.centroidX) / 5) +
      (signalSource === 'mediapipe' ? 4 : 0),
  );

  const attentionConfidence = smooth(previousAttention, attentionTarget);
  const gazeConfidence = smooth(previousGaze, gazeTarget);
  const popScore = clamp(
    Math.round(
      attentionConfidence * 0.46 +
        gazeConfidence * 0.28 +
        (sessionStable ? 16 : 5) +
        (facePresent ? 8 : 0),
    ),
    0,
    98,
  );

  return {
    facePresent,
    eyesOpen,
    gazeCentered,
    blinkPulse,
    headStable,
    attentionConfidence,
    gazeConfidence,
    popScore,
    sessionStable,
    eligible: popScore >= 78 && sessionStable && progress >= 70,
    signalSource,
    sessionFrames: nextSession,
    lastBlinkAt: nextBlinkAt,
  };
}

export function createSyntheticPopSignals(
  progress: number,
  tick: number,
): DemoPopComputedSignals {
  const phase = Math.min(1, Math.max(0, progress / 100));
  const wave = Math.sin(tick / 520);
  const blinkPulse = tick % 3100 < 260;
  const attentionConfidence = clamp(Math.round(46 + phase * 44 + wave * 4));
  const gazeConfidence = clamp(Math.round(42 + phase * 48 + Math.cos(tick / 680) * 5));
  const popScore = clamp(
    Math.round(attentionConfidence * 0.5 + gazeConfidence * 0.32 + phase * 18),
    0,
    98,
  );

  return {
    facePresent: progress >= 8,
    eyesOpen: !blinkPulse && progress >= 15,
    gazeCentered: progress >= 34,
    blinkPulse,
    headStable: progress >= 48,
    attentionConfidence,
    gazeConfidence,
    popScore,
    sessionStable: progress >= 58,
    eligible: progress >= 82 && popScore >= 78,
    signalSource: 'synthetic',
  };
}
