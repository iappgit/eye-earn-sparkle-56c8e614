import React from 'react';
import { Link } from 'react-router-dom';
import iLogo from '@/assets/i-logo.png';
import { useDemoState } from '../useDemoState';
import { useDemoTour } from '../demoTourContext';
import { DemoRestartControl } from '../components/DemoRestartControl';

export const DemoSplash: React.FC = () => {
  const { enterDemo, restartDemoToSplash } = useDemoState();
  const { startTour } = useDemoTour();

  return (
    <div
      className="relative min-h-[100dvh] w-full bg-black text-white overflow-hidden select-none cursor-pointer"
      onClick={enterDemo}
      role="button"
      aria-label="Enter demo"
    >
      {/* soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-8 text-center">
        <div
          className="relative mb-10"
          style={{ animation: 'demo-splash-breathe 4s ease-in-out infinite' }}
        >
          <div
            className="absolute inset-0 -m-16 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%)',
              filter: 'blur(24px)',
            }}
          />
          <img
            src={iLogo}
            alt="[ i ]"
            className="relative w-24 h-28 object-contain mix-blend-screen"
            style={{
              filter:
                'drop-shadow(0 0 32px rgba(255,255,255,0.35)) drop-shadow(0 0 8px rgba(255,255,255,0.5))',
            }}
          />
        </div>

        <p
          className="text-[15px] tracking-wide text-white/85 mb-2"
          style={{ fontFamily: 'Syne, DM Sans, sans-serif', letterSpacing: '0.01em' }}
        >
          Your attention has value.
        </p>
        <p
          className="text-[11px] uppercase tracking-[0.32em] text-white/35"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Tap to enter
        </p>
      </div>

      {/* Quiet footer controls — don't intercept root tap */}
      <div
        className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={startTour}
          className="text-[10px] uppercase tracking-[0.28em] text-white/40 hover:text-white/70 transition-colors"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Guided tour
        </button>
        <div className="opacity-50 scale-90">
          <DemoRestartControl onRestart={restartDemoToSplash} variant="footer" />
        </div>
        <Link
          to="/start"
          className="text-[10px] uppercase tracking-[0.28em] text-white/30 hover:text-white/60 transition-colors"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Switch app
        </Link>
      </div>

      <style>{`
        @keyframes demo-splash-breathe {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.04); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
