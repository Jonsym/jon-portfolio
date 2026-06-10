"use client";

import { useEffect, useRef, useState } from "react";

interface HeroMediaProps {
  src: string;
  poster?: string;
  title: string;
}

/**
 * Auto-playing, muted, looping cover video for the hero project cards.
 * Defers attaching `src` until the card is near the viewport so off-screen
 * cards don't fetch megabytes on load (mirrors VideoCover's lazy strategy,
 * but without the play/pause UI — the hero rail plays silently like a preview).
 */
export default function HeroMedia({ src, poster, title }: HeroMediaProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || shouldLoad) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    const v = ref.current;
    if (shouldLoad && v) {
      // Browsers may reject autoplay; muted + playsInline keeps it allowed.
      void v.play().catch(() => {});
    }
  }, [shouldLoad]);

  return (
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={title}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
    />
  );
}
