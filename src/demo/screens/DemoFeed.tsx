import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Sparkles, Brain, MoreHorizontal, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_OFFERS, getActiveFeaturedOffer, CAMPAIGN_OFFER_ID } from '../demoData';
import { useDemoState } from '../useDemoState';
import { DemoBottomNav } from '../components/DemoBottomNav';
import { DemoOfferMedia } from '../components/DemoOfferMedia';
import type { DemoOffer } from '../demoTypes';

interface FeedItem {
  offer: DemoOffer;
  sponsored: boolean;
  creatorHandle: string;
  caption: string;
}

// Build presentation-ordered feed: organic → sponsored → organic.
function buildFeed(featured: DemoOffer, campaignPublished: boolean): FeedItem[] {
  const sponsoredId = campaignPublished ? CAMPAIGN_OFFER_ID : featured.id;
  const others = DEMO_OFFERS.filter((o) => o.id !== sponsoredId && o.id !== CAMPAIGN_OFFER_ID);
  const sponsored = campaignPublished ? featured : DEMO_OFFERS.find((o) => o.id === sponsoredId) ?? featured;

  const organic = others.map((o) => ({
    offer: o,
    sponsored: false,
    creatorHandle: '@' + o.brandName.toLowerCase().replace(/\s+/g, '.'),
    caption: o.title,
  }));

  const sponsoredItem: FeedItem = {
    offer: sponsored,
    sponsored: true,
    creatorHandle: '@' + sponsored.brandName.toLowerCase().replace(/\s+/g, '.'),
    caption: sponsored.title,
  };

  // organic first (media platform), then sponsored (attention reveal), then more organic
  return [organic[0], sponsoredItem, ...organic.slice(1)].filter(Boolean) as FeedItem[];
}

export const DemoFeed: React.FC = () => {
  const { state, selectOffer, goToStep, openClickEarn, openElo } = useDemoState();
  const featured = getActiveFeaturedOffer(state);
  const items = buildFeed(featured, state.campaignPublished);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [showMenu, setShowMenu] = useState(false);

  // Track active snap index for autoplay
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.clientHeight;
      const idx = Math.round(el.scrollTop / h);
      setActiveIndex(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleSponsoredCTA = useCallback(
    (offer: DemoOffer) => {
      selectOffer(offer);
      goToStep('offer');
    },
    [selectOffer, goToStep],
  );

  const toggleLike = (id: string) => setLikedIds((p) => ({ ...p, [id]: !p[id] }));

  const walletTotal = state.icoinBalance + state.approvedAcoins;

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Top overlay */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
        }}
      >
        <div
          className="text-[13px] tracking-[0.24em] uppercase text-white/75"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          [ i ] · feed
        </div>
        <button
          type="button"
          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 text-[11px] font-medium"
          onClick={() => goToStep('wallet')}
          aria-label="Open wallet"
        >
          <Sparkles className="w-3 h-3 text-white/80" />
          <span className="tabular-nums">{walletTotal}</span>
          <span className="text-white/50 text-[10px] uppercase tracking-wider">value</span>
        </button>
      </div>

      {/* Vertical snap scroller */}
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, i) => (
          <FeedSlide
            key={item.offer.id + i}
            item={item}
            active={i === activeIndex}
            liked={!!likedIds[item.offer.id]}
            onLike={() => toggleLike(item.offer.id)}
            onSponsoredCTA={() => handleSponsoredCTA(item.offer)}
          />
        ))}
      </div>

      {/* Explore menu (Click-Earn / ELO) */}
      <div className="absolute right-4 z-30" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 5.5rem)' }}>
        <button
          type="button"
          onClick={() => setShowMenu((v) => !v)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/15 transition-colors"
          aria-label="Explore"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMenu && (
          <div className="absolute bottom-12 right-0 min-w-[190px] rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 p-1.5 shadow-2xl">
            <button
              type="button"
              onClick={() => { setShowMenu(false); openClickEarn(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm hover:bg-white/10 transition-colors"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Click-and-Earn</span>
            </button>
            <button
              type="button"
              onClick={() => { setShowMenu(false); openElo(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm hover:bg-white/10 transition-colors"
            >
              <Brain className="w-4 h-4 text-violet-400" />
              <span>ELO</span>
            </button>
          </div>
        )}
      </div>

      <DemoBottomNav />

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

interface FeedSlideProps {
  item: FeedItem;
  active: boolean;
  liked: boolean;
  onLike: () => void;
  onSponsoredCTA: () => void;
}

const FeedSlide: React.FC<FeedSlideProps> = ({ item, active, liked, onLike, onSponsoredCTA }) => {
  return (
    <section className="snap-start relative h-[100dvh] w-full overflow-hidden">
      {/* Full-bleed media */}
      <div className="absolute inset-0">
        <DemoOfferMedia
          offer={item.offer}
          autoPlay={active}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)',
          }}
        />
      </div>

      {/* Bottom content: creator + caption + sponsored contract */}
      <div
        className="absolute left-0 right-0 z-10 px-5"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 6.5rem)' }}
      >
        <div className="max-w-[calc(100%-4.5rem)]">
          {item.sponsored && (
            <span
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.28em] text-white/70 mb-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span className="w-1 h-1 rounded-full bg-amber-300" />
              Sponsored
            </span>
          )}
          <p
            className="text-[15px] font-semibold text-white mb-1"
            style={{ fontFamily: 'Syne, DM Sans, sans-serif' }}
          >
            {item.creatorHandle}
          </p>
          <p className="text-[14px] leading-snug text-white/85 line-clamp-2">{item.caption}</p>

          {item.sponsored && (
            <button
              type="button"
              onClick={onSponsoredCTA}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white text-black pl-4 pr-3 py-2 text-[13px] font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <span>Watch &amp; Earn</span>
              <span className="flex items-center gap-1 text-[12px] font-bold">
                +{item.offer.rewardAmount}
                <span className={cn(
                  'inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]',
                  item.offer.rewardType === 'acoin'
                    ? 'bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white'
                    : 'bg-gradient-to-br from-amber-300 to-amber-500 text-black',
                )}>
                  {item.offer.rewardType === 'acoin' ? 'A' : 'i'}
                </span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right action cluster */}
      <div
        className="absolute right-3 z-10 flex flex-col items-center gap-5"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 6.5rem)' }}
      >
        <ActionIcon
          onClick={onLike}
          icon={
            <Heart
              className={cn('w-6 h-6 transition-all', liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white')}
            />
          }
          label={liked ? '1' : '0'}
        />
        <ActionIcon icon={<MessageCircle className="w-6 h-6 text-white" />} label="12" />
        <ActionIcon icon={<Send className="w-6 h-6 text-white" />} label="Share" />
        <ActionIcon icon={<Bookmark className="w-6 h-6 text-white" />} label="Save" />
      </div>
    </section>
  );
};

const ActionIcon: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center gap-1 group"
  >
    <span className="w-11 h-11 rounded-full flex items-center justify-center bg-black/25 backdrop-blur-sm group-hover:bg-black/40 transition-colors">
      {icon}
    </span>
    <span
      className="text-[10px] text-white/85 tabular-nums"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      {label}
    </span>
  </button>
);
