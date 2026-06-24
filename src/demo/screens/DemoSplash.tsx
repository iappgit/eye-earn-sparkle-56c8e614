import React from 'react';
import iLogo from '@/assets/i-logo.png';
import { DEMO_TAGLINE } from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';

export const DemoSplash: React.FC = () => {
  const { enterDemo } = useDemoState();

  return (
    <DemoShell showDisclaimer>
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, hsl(270 95% 65% / 0.14) 0%, transparent 55%)',
          }}
        />

        <div className="relative demo-animate-scale-in flex flex-col items-center">
          <div className="relative mb-8">
            <div
              className="absolute w-36 h-36 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              style={{
                background:
                  'radial-gradient(circle, hsl(270 95% 65% / 0.45) 0%, transparent 70%)',
                filter: 'blur(28px)',
                animation: 'demo-pulse-glow 2.5s ease-in-out infinite',
              }}
            />
            <img
              src={iLogo}
              alt="[ i ]"
              className="relative w-24 h-28 object-contain mix-blend-screen"
              style={{
                filter:
                  'drop-shadow(0 0 24px hsl(270 95% 65% / 0.55)) drop-shadow(0 0 48px hsl(320 90% 60% / 0.35))',
              }}
            />
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight mb-2">
            <span className="gradient-text">[ i ]</span>
          </h1>
          <p className="text-lg text-foreground/90 font-medium max-w-xs mb-2">
            {DEMO_TAGLINE}
          </p>
          <p className="text-sm text-muted-foreground max-w-sm mb-10 leading-relaxed">
            Investor preview — experience how verified attention flows into
            rewards, wallet balance, and value.
          </p>

          <button
            type="button"
            className="demo-cta max-w-xs demo-animate-fade-up"
            style={{ animationDelay: '0.2s' }}
            onClick={enterDemo}
          >
            Enter Demo
          </button>
        </div>
      </div>
    </DemoShell>
  );
};
