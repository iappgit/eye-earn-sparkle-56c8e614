import React from 'react';
import { MapPin, Coins, ChevronRight, Sparkles, Heart, Brain, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_OFFERS, getActiveFeaturedOffer, CAMPAIGN_BRAND } from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';
import { DemoConceptCard } from '../components/DemoConceptCard';
import { DemoOfferMedia } from '../components/DemoOfferMedia';
import type { DemoOffer } from '../demoTypes';

function CoinLabel({ type, amount }: { type: DemoOffer['rewardType']; amount: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
      <span
        className={cn(
          'demo-coin-badge text-xs',
          type === 'acoin' ? 'demo-coin-acoin' : 'demo-coin-icoin',
        )}
      >
        {type === 'acoin' ? 'A' : 'i'}
      </span>
      <span className={type === 'acoin' ? 'gradient-text' : 'gradient-text-gold'}>
        +{amount}
      </span>
    </span>
  );
}

export const DemoFeed: React.FC = () => {
  const { state, selectOffer, goToStep, openClickEarn, openElo } = useDemoState();
  const featured = getActiveFeaturedOffer(state);

  const handleViewOffer = (offer: DemoOffer) => {
    selectOffer(offer);
    goToStep('offer');
  };

  const isCampaignFeatured =
    state.campaignPublished && state.featuredDemoOfferSource === 'campaign';

  return (
    <DemoShell showNav>
      <div
        className="px-4 pt-4 demo-safe-pad-nav"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-5 demo-animate-fade-up">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-display text-2xl font-bold">
              <span className="gradient-text">[ i ]</span> Feed
            </h1>
            <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              Live preview
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Immersive offers — tap to explore the earn flow.
          </p>
        </header>

        {state.campaignPublished && (
          <div className="demo-glass-card demo-published-banner p-4 mb-4 demo-animate-fade-up border-green-500/25">
            <div className="flex items-start gap-3">
              <Megaphone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1">
                  Published Preview
                </p>
                <p className="text-sm text-foreground/90 leading-snug">
                  {CAMPAIGN_BRAND} campaign is now live in the earning feed.
                </p>
              </div>
            </div>
          </div>
        )}

        <article
          className="demo-glass-card demo-glow-ring overflow-hidden mb-5 demo-animate-fade-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="relative aspect-[4/5] max-h-[52vh]">
            <DemoOfferMedia offer={featured} autoPlay />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
            <div className="absolute top-3 left-3">
              {isCampaignFeatured && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded-full">
                  Campaign live
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">
                {isCampaignFeatured ? 'Published campaign offer' : 'Featured offer'}
              </p>
              <h2 className="font-display text-xl font-bold text-white mb-1">
                {featured.brandName}
              </h2>
              <p className="text-sm text-white/80 mb-3 line-clamp-2">{featured.title}</p>
              <div className="flex items-center justify-between gap-3">
                <CoinLabel type={featured.rewardType} amount={featured.rewardAmount} />
                <button
                  type="button"
                  className="demo-cta flex-shrink-0 !w-auto !min-h-0 px-5 py-2.5 text-sm"
                  onClick={() => handleViewOffer(featured)}
                >
                  View offer
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </article>

        <section className="space-y-3 mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Concept previews
          </h3>
          <DemoConceptCard
            title="Click-and-Earn"
            subtitle="Hold the love button to send simulated value."
            icon={<Heart className="w-5 h-5 text-pink-400 fill-pink-400/30" />}
            accent="gold"
            onClick={() => openClickEarn()}
            delay="0.08s"
          />
          <DemoConceptCard
            title="ELO"
            subtitle="Ask the product layer to explain value, POP, wallet, or campaigns."
            icon={<Brain className="w-5 h-5 text-violet-400" />}
            accent="violet"
            onClick={() => openElo()}
            delay="0.12s"
          />
        </section>

        <section className="space-y-3 pb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Nearby offers
          </h3>
          {DEMO_OFFERS.filter((o) => !isCampaignFeatured || o.id !== featured.id).map(
            (offer, i) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => handleViewOffer(offer)}
                className="demo-glass-card w-full text-left p-4 flex gap-3 items-center demo-animate-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <img
                  src={offer.imageUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{offer.brandName}</p>
                  <p className="text-xs text-muted-foreground truncate mb-1.5">{offer.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {offer.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      <CoinLabel type={offer.rewardType} amount={offer.rewardAmount} />
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ),
          )}
        </section>
      </div>
    </DemoShell>
  );
};
