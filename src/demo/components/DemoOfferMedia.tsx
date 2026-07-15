import React, { useRef, useEffect } from 'react';
import type { DemoOffer } from '../demoTypes';

interface DemoOfferMediaProps {
  offer: Pick<DemoOffer, 'imageUrl' | 'videoUrl' | 'title' | 'brandName'>;
  className?: string;
  /** When true, video plays muted loop (feed/verify). */
  autoPlay?: boolean;
  /** Poster frame when video is present. */
  poster?: string;
}

export const DemoOfferMedia: React.FC<DemoOfferMediaProps> = ({
  offer,
  className = 'absolute inset-0 w-full h-full object-cover',
  autoPlay = false,
  poster,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!autoPlay || !offer.videoUrl) return;
    const el = videoRef.current;
    if (!el) return;
    void el.play().catch(() => {
      /* autoplay may be blocked; poster/image still visible */
    });
  }, [autoPlay, offer.videoUrl]);

  if (offer.videoUrl) {
    return (
      <video
        ref={videoRef}
        src={offer.videoUrl}
        poster={poster ?? offer.imageUrl}
        className={className}
        muted
        loop
        playsInline
        autoPlay={autoPlay}
        aria-label={`${offer.brandName} — ${offer.title}`}
      />
    );
  }

  return (
    <img
      src={offer.imageUrl}
      alt={offer.title}
      className={className}
    />
  );
};
