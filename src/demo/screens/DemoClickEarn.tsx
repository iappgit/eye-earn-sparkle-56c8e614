import React, { useCallback, useRef } from 'react';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLICK_EARN_DISCLAIMER,
  CLICK_EARN_MAX,
  CLICK_EARN_MIN,
  CREATOR_NAME,
  getFeaturedOffer,
} from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';

export const DemoClickEarn: React.FC = () => {
  const {
    state,
    likeClickEarn,
    startClickEarn,
    setClickEarnAmount,
    previewClickEarn,
    confirmClickEarn,
    cancelClickEarn,
    openFeedDemo,
  } = useDemoState();

  const { clickEarnMode, clickEarnAmount, clickEarnMessage, icoinBalance } = state;
  const featured = getFeaturedOffer();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoldTimer = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const handlePointerDown = () => {
    if (clickEarnMode === 'preview' || clickEarnMode === 'confirmed') return;
    clearHoldTimer();
    holdTimer.current = setTimeout(() => {
      startClickEarn();
    }, 280);
  };

  const handlePointerUp = () => {
    clearHoldTimer();
    if (clickEarnMode === 'holding') {
      previewClickEarn();
    }
  };

  const handleTapLike = () => {
    if (clickEarnMode === 'idle' || clickEarnMode === 'liked') {
      likeClickEarn();
    }
  };

  const canConfirm =
    clickEarnMode === 'preview' && icoinBalance >= clickEarnAmount && clickEarnAmount >= CLICK_EARN_MIN;

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 pb-6 demo-safe-pad-nav"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-4 demo-animate-fade-up flex items-center gap-3">
          <button
            type="button"
            onClick={() => cancelClickEarn()}
            className="w-10 h-10 rounded-full demo-glass-card flex items-center justify-center flex-shrink-0"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Click-and-Earn</h1>
            <p className="text-xs text-muted-foreground">Hold-to-value creator offer</p>
          </div>
        </header>

        <article className="demo-glass-card overflow-hidden mb-4 demo-animate-fade-up">
          <div className="relative aspect-[16/10] max-h-[28vh]">
            <img
              src={featured.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs text-white/70">Content preview</p>
              <p className="text-sm font-semibold text-white line-clamp-1">{featured.title}</p>
            </div>
          </div>
        </article>

        <div className="demo-glass-card p-4 mb-4 flex items-center gap-3 demo-animate-fade-up">
          <span className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-pink-500/30 flex items-center justify-center text-lg font-bold">
            R
          </span>
          <div className="min-w-0">
            <p className="font-semibold truncate">{CREATOR_NAME}</p>
            <p className="text-xs text-muted-foreground">Creator · hold-to-value enabled</p>
          </div>
        </div>

        <div className="relative mb-4 flex flex-col items-center demo-animate-fade-up">
          {clickEarnMode === 'holding' && (
            <div className="demo-click-hearts pointer-events-none" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <Heart
                  key={i}
                  className="demo-click-heart w-4 h-4 text-pink-400 fill-pink-400/60"
                  style={{ animationDelay: `${i * 0.15}s`, left: `${20 + i * 14}%` }}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className={cn(
              'demo-click-love-btn',
              clickEarnMode === 'holding' && 'demo-click-love-btn-active',
              clickEarnMode === 'liked' && 'demo-click-love-btn-liked',
            )}
            onClick={handleTapLike}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Love button — tap to like, hold to send value"
          >
            <Heart
              className={cn(
                'w-10 h-10 transition-colors',
                clickEarnMode === 'holding' || clickEarnMode === 'preview'
                  ? 'text-white fill-white'
                  : 'text-pink-400 fill-pink-400/40',
              )}
            />
          </button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Tap once the like · hold to send value
          </p>
          {clickEarnMessage && (
            <p className="text-xs text-primary mt-1 text-center">{clickEarnMessage}</p>
          )}
        </div>

        {(clickEarnMode === 'holding' ||
          clickEarnMode === 'preview' ||
          clickEarnMode === 'confirmed') && (
          <div className="demo-glass-card p-4 mb-4 space-y-4 demo-animate-fade-up">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount meter</span>
              <span className="font-semibold gradient-text-gold">
                {clickEarnAmount} iCoins
              </span>
            </div>
            <input
              type="range"
              min={CLICK_EARN_MIN}
              max={CLICK_EARN_MAX}
              value={clickEarnAmount}
              onChange={(e) => setClickEarnAmount(Number(e.target.value))}
              className="demo-click-slider w-full"
              disabled={clickEarnMode === 'confirmed'}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{CLICK_EARN_MIN}</span>
              <span>{CLICK_EARN_MAX}</span>
            </div>
            <button
              type="button"
              className="demo-cta-secondary demo-cta !min-h-10 text-sm w-full"
              onClick={startClickEarn}
              disabled={clickEarnMode === 'confirmed'}
            >
              Start value mode
            </button>
          </div>
        )}

        {clickEarnMode === 'preview' && (
          <div className="demo-glass-card p-4 mb-4 border-primary/30 demo-animate-fade-up">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="font-semibold text-sm">Preview</p>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Send <span className="text-foreground font-medium">{clickEarnAmount} iCoins</span> to{' '}
              {CREATOR_NAME}
            </p>
            <p className="text-xs text-muted-foreground">
              Usable balance: {icoinBalance} iCoins
              {icoinBalance < clickEarnAmount && (
                <span className="text-destructive block mt-1">Insufficient balance for preview</span>
              )}
            </p>
          </div>
        )}

        {clickEarnMode === 'confirmed' && (
          <div className="demo-glass-card p-4 mb-4 border-emerald-500/30 demo-animate-fade-up">
            <p className="font-semibold text-sm text-emerald-400 mb-1">Value sent (preview)</p>
            <p className="text-xs text-muted-foreground">
              {clickEarnAmount} iCoins routed to {CREATOR_NAME}. View in Wallet → Sent.
            </p>
            <button
              type="button"
              className="demo-cta mt-3 !min-h-10 text-sm"
              onClick={() => openFeedDemo()}
            >
              Back to feed
            </button>
          </div>
        )}

        {(clickEarnMode === 'preview' || clickEarnMode === 'holding') && (
          <div className="flex gap-3 demo-animate-fade-up">
            <button
              type="button"
              className="demo-cta-secondary demo-cta flex-1 !min-h-11 text-sm"
              onClick={() => cancelClickEarn()}
            >
              Cancel
            </button>
            {clickEarnMode === 'preview' && (
              <button
                type="button"
                className="demo-cta flex-1 !min-h-11 text-sm"
                onClick={() => confirmClickEarn()}
                disabled={!canConfirm}
              >
                Confirm
              </button>
            )}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground/80 text-center mt-6 leading-relaxed px-2">
          {CLICK_EARN_DISCLAIMER}
        </p>
      </div>
    </DemoShell>
  );
};
