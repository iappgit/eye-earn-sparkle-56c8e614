import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Smartphone, ArrowRight, Share, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLogo } from '@/components/AppLogo';
import { cn } from '@/lib/utils';

export const LaunchChooser: React.FC = () => {
  const { user, loading } = useAuth();
  const productionPath = user ? '/' : '/auth';

  const demoUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/demo';
    return `${window.location.origin}/demo`;
  }, []);

  const startUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/start';
    return `${window.location.origin}/start`;
  }, []);

  const productionUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    return `${window.location.origin}/`;
  }, []);

  return (
    <div
      className="min-h-[100dvh] bg-background flex flex-col px-5 py-8"
      style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, hsl(270 95% 65% / 0.12) 0%, transparent 55%)',
        }}
      />

      <header className="relative text-center mb-8 pt-4">
        <div className="flex justify-center mb-4">
          <AppLogo size="lg" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Choose your experience</h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          This project has two apps in one build. Pick the one you want — they use different URLs.
        </p>
      </header>

      <div className="relative flex-1 max-w-md mx-auto w-full space-y-4">
        <Link
          to="/demo"
          className={cn(
            'block neu-card rounded-2xl p-5 border border-primary/30',
            'transition-transform active:scale-[0.98]',
            'bg-gradient-to-br from-primary/10 via-transparent to-violet-500/5',
          )}
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                Recommended for phone demo
              </p>
              <h2 className="font-display text-lg font-bold mb-1">Investor Demo</h2>
              <p className="text-sm text-muted-foreground leading-snug mb-3">
                Simulated earn flow, POP tracking, wallet preview. No login required.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Open /demo
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        <Link
          to={productionPath}
          className={cn(
            'block neu-card rounded-2xl p-5 border border-border/60',
            'transition-transform active:scale-[0.98]',
          )}
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-foreground/80" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Full Lovable app
              </p>
              <h2 className="font-display text-lg font-bold mb-1">Production iView</h2>
              <p className="text-sm text-muted-foreground leading-snug mb-3">
                Login, video feed, My Page, Supabase rewards, and full product features.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                {loading ? 'Loading…' : user ? 'Open feed' : 'Sign in'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        <section className="neu-card rounded-2xl p-4 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Bookmark on iPhone</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Safari → Share → <strong>Add to Home Screen</strong>. Use the exact URL you want:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="rounded-lg bg-muted/50 px-3 py-2 break-all">
              <span className="text-primary font-medium">Chooser: </span>
              {startUrl}
            </li>
            <li className="rounded-lg bg-muted/50 px-3 py-2 break-all">
              <span className="text-primary font-medium">Investor demo: </span>
              {demoUrl}
            </li>
            <li className="rounded-lg bg-muted/50 px-3 py-2 break-all">
              <span className="text-muted-foreground font-medium">Production app: </span>
              {productionUrl}
            </li>
          </ul>
          <p className="flex items-start gap-1.5 text-[0.65rem] text-muted-foreground mt-3">
            <Share className="w-3 h-3 mt-0.5 flex-shrink-0" />
            The default iView home icon opens production (<code className="text-[0.6rem]">/</code>), not the demo.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LaunchChooser;
