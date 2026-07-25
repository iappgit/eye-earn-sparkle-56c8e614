import React from 'react';
import { ArrowLeft, Eye, Clock, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoState } from '../useDemoState';
import { DemoOfferMedia } from '../components/DemoOfferMedia';

export const DemoOffer: React.FC = () => {
  const { state, goToStep, setNavTab } = useDemoState();
  const offer = state.selectedOffer;
  const isClaimed = offer ? state.claimedOfferIds.includes(offer.id) : false;

  if (!offer) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/60 mb-4">No offer selected.</p>
        <button
          type="button"
          className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold"
          onClick={() => goToStep('feed')}
        >
          Back to feed
        </button>
      </div>
    );
  }

  const handlePrimary = () => {
    if (isClaimed) {
      setNavTab('wallet');
      goToStep('wallet');
      return;
    }
    goToStep('verify');
  };

  const rewardIsAcoin = offer.rewardType === 'acoin';

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Full-bleed media */}
      <div className="absolute inset-0">
        <DemoOfferMedia offer={offer} autoPlay className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.45) 100%)',
          }}
        />
      </div>

      {/* Back */}
      <button
        type="button"
        onClick={() => goToStep('feed')}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Back to feed"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Top sponsored tag */}
      <div
        className="absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-20 text-[10px] uppercase tracking-[0.32em] text-white/60"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        Sponsored attention
      </div>

      {/* Bottom reward contract */}
      <div
        className="absolute left-0 right-0 z-10 px-5"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)' }}
      >
        <div className="mb-4">
          <p
            className="text-[11px] uppercase tracking-[0.3em] text-white/55 mb-1.5"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {offer.brandName}
          </p>
          <h1
            className="text-[26px] leading-[1.15] font-semibold text-white max-w-[22ch]"
            style={{ fontFamily: 'Syne, DM Sans, sans-serif' }}
          >
            Get paid for your attention.
          </h1>
          <p className="text-[14px] text-white/70 mt-2 max-w-[32ch] leading-snug">{offer.title}</p>
        </div>

        <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-4 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <Fact
              icon={<Coins className="w-4 h-4" />}
              label="Reward"
              value={
                <span className={cn('font-bold text-[15px]', rewardIsAcoin ? 'text-fuchsia-300' : 'text-amber-300')}>
                  +{offer.rewardAmount} {rewardIsAcoin ? 'A' : 'i'}
                </span>
              }
            />
            <Fact
              icon={<Clock className="w-4 h-4" />}
              label="Watch"
              value={<span className="font-semibold text-[15px]">{offer.durationSeconds}s</span>}
            />
            <Fact
              icon={<Eye className="w-4 h-4" />}
              label="Verified"
              value={<span className="font-semibold text-[13px]">POP</span>}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrimary}
          className="w-full rounded-full bg-white text-black py-4 text-[15px] font-semibold shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-transform"
        >
          {isClaimed ? 'View in Wallet' : 'Start earning'}
        </button>

        <p
          className="text-center text-[10px] uppercase tracking-[0.28em] text-white/40 mt-3"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Attention verified locally · camera stays on device
        </p>
      </div>
    </div>
  );
};

const Fact: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-white/50">
      {icon}
      <span
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {label}
      </span>
    </div>
    <div>{value}</div>
  </div>
);
