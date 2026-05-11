"use client";

import { Play, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoCoverProps {
  src: string;
  poster?: string;
  title: string;
}

export default function VideoCover({ src, poster, title }: VideoCoverProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Defer attaching the `src` until the card is near the viewport, so mobile
  // browsers don't fetch megabytes for off-screen cards (or eagerly fetch them
  // when iOS ignores preload="metadata").
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldLoad) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [shouldLoad]);

  const toggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    if (!shouldLoad) setShouldLoad(true);
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <>
      <video
        ref={ref}
        src={shouldLoad ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <span
        role="button"
        tabIndex={0}
        aria-label={playing ? `Pausar ${title}` : `Reproducir ${title}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle(e);
        }}
        className={`absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2 ${
          playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        {playing ? (
          <Pause size={16} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Play size={16} strokeWidth={1.75} aria-hidden="true" className="translate-x-[1px]" />
        )}
      </span>
    </>
  );
}
