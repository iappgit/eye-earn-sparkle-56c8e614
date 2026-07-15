import React from 'react';
import { ArrowLeft, MapPin, Clock, ShieldCheck, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoPreviewChip } from '../components/DemoPreviewChip';
import { DemoOfferMedia } from '../components/DemoOfferMedia';

export const DemoOffer: React.FC = () => {
  const { state, goToStep, setNavTab } = useDemoState();
  const offer = state.selectedOffer;
  const isClaimed = offer ? state.claimedOfferIds.includes(offer.id) : false;

  const handlePrimaryAction = () => {
    if (isClaimed) {
      setNavTab('wallet');
      goToStep('wallet');
      return;
    }
    goToStep('verify');
  };

  if (!offer) {
    return (
      <DemoShell>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center">
          <p className="text-muted-foreground mb-4">No offer selected.</p>
          <button type="button" className="demo-cta max-w-xs" onClick={() => goToStep('feed')}>
            Back to feed
          </button>
        </div>
      </DemoShell>
    );
  }

  return (
    <DemoShell showDisclaimer={false}>
      <div className="pb-28">
        <div className="relative aspect-[16/10] max-h-[40vh]">
          <DemoOfferMedia offer={offer} autoPlay />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
          <button
            type="button"
            onClick={() => goToStep('feed')}
            className="absolute top-4 left-4 w-10 h-10 rounded-full demo-glass-card flex items-center justify-center"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute top-4 right-4">
            <DemoPreviewChip />
          </div>
        </div>

        <div className="px-4 -mt-6 relative z-10 demo-animate-fade-up">
          <div className="demo-glass-card p-5 mb-4">
            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
              {offer.category}
            </p>
            <h1 className="font-display text-2xl font-bold mb-1">{offer.brandName}</h1>
            <p className="text-lg text-foreground/90 mb-3">{offer.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {offer.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="demo-glass-card p-3 !rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Distance
                </div>
                <p className="font-semibold">{offer.distance}</p>
              </div>
              <div className="demo-glass-card p-3 !rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  Watch time
                </div>
                <p className="font-semibold">{offer.durationSeconds}s</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Demo reward</span>
              </div>
              <span
                className={cn(
                  'font-display font-bold text-lg',
                  offer.rewardType === 'acoin' ? 'gradient-text' : 'gradient-text-gold',
                )}
              >
                +{offer.rewardAmount}{' '}
                {offer.rewardType === 'acoin' ? 'ACoins' : 'iCoins'}
              </span>
            </div>
          </div>

          <div className="demo-glass-card p-4 mb-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Verified attention</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Live POP tracking may request camera access for local face and
                  gaze signals. If denied, simulation fallback runs automatically.
                  Camera stays local and is not recorded.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground px-1">{offer.terms}</p>
        </div>
      </div>

      <div className="demo-sticky-footer">
        <button
          type="button"
          className="demo-cta max-w-lg mx-auto"
          onClick={handlePrimaryAction}
        >
          {isClaimed ? 'View in Wallet' : 'Watch · Verify · Earn'}
        </button>
      </div>
    </DemoShell>
  );
};
