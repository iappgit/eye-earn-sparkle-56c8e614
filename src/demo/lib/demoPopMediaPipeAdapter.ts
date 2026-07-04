import type { Results } from '@mediapipe/face_detection';
import {
  POP_FRAME_HEIGHT,
  POP_FRAME_WIDTH,
  type DemoPopMediaPipeSample,
} from './demoPopSignalMath';

const MEDIAPIPE_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229';

export class DemoPopMediaPipeAdapter {
  private detector: import('@mediapipe/face_detection').FaceDetection | null = null;
  private ready = false;
  private sendInFlight = false;
  private latestSample: DemoPopMediaPipeSample | null = null;

  get isReady() {
    return this.ready;
  }

  get lastSample() {
    return this.latestSample;
  }

  async initialize(): Promise<boolean> {
    if (this.ready) return true;

    try {
      const { FaceDetection } = await import('@mediapipe/face_detection');
      const detector = new FaceDetection({
        locateFile: (file) => `${MEDIAPIPE_CDN}/${file}`,
      });

      detector.setOptions({
        model: 'short',
        minDetectionConfidence: 0.55,
        selfieMode: true,
      });

      detector.onResults((results) => {
        this.latestSample = parseMediaPipeResults(results);
      });

      await detector.initialize();
      this.detector = detector;
      this.ready = true;
      return true;
    } catch (error) {
      console.warn('[DemoPopMediaPipe] Adapter unavailable, using canvas fallback.', error);
      this.ready = false;
      this.detector = null;
      return false;
    }
  }

  async processVideoFrame(video: HTMLVideoElement): Promise<DemoPopMediaPipeSample | null> {
    if (!this.ready || !this.detector || this.sendInFlight) {
      return this.latestSample;
    }

    this.sendInFlight = true;
    try {
      await this.detector.send({ image: video });
      return this.latestSample;
    } catch (error) {
      console.warn('[DemoPopMediaPipe] Frame processing failed.', error);
      return this.latestSample;
    } finally {
      this.sendInFlight = false;
    }
  }

  async close() {
    if (!this.detector) return;
    try {
      await this.detector.close();
    } catch {
      /* ignore */
    }
    this.detector = null;
    this.ready = false;
    this.latestSample = null;
  }
}

function parseMediaPipeResults(results: Results): DemoPopMediaPipeSample | null {
  const detection = results.detections?.[0];
  if (!detection?.boundingBox) {
    return { facePresent: false, centroidX: 0, centroidY: 0, confidence: 0 };
  }

  const { xCenter, yCenter, width, height } = detection.boundingBox;
  const confidence = Math.min(1, Math.max(width, height));
  const facePresent = confidence > 0.12;

  const centroidX = (xCenter - 0.5) * POP_FRAME_WIDTH;
  const centroidY = (yCenter - 0.42) * POP_FRAME_HEIGHT;

  if (detection.landmarks?.length >= 2) {
    const rightEye = detection.landmarks[0];
    const leftEye = detection.landmarks[1];
    const eyeMidX = ((rightEye.x + leftEye.x) / 2 - 0.5) * POP_FRAME_WIDTH;
    const eyeMidY = ((rightEye.y + leftEye.y) / 2 - 0.42) * POP_FRAME_HEIGHT;

    return {
      facePresent,
      centroidX: eyeMidX * 0.65 + centroidX * 0.35,
      centroidY: eyeMidY * 0.65 + centroidY * 0.35,
      confidence,
    };
  }

  return {
    facePresent,
    centroidX,
    centroidY,
    confidence,
  };
}
