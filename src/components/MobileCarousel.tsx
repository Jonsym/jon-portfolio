"use client";

import { useCarousel } from "@/src/hooks/useCarousel";
import { useTPair } from "./I18nProvider";

interface MobileCarouselProps {
  slides: React.ReactNode[];
  ariaLabel?: string;
  className?: string;
}

/**
 * Dependency-free infinite carousel for mobile/tablet. One slide per view.
 * All behavior (autoplay, drag, pause sources, reduced-motion, cleanup) lives
 * in `useCarousel`; this component only renders the track, clones, and the
 * focusable dot indicators. Navigation is drag OR dots OR ←/→ keys.
 */
export default function MobileCarousel({
  slides,
  ariaLabel,
  className = "",
}: MobileCarouselProps) {
  const n = slides.length;
  const c = useCarousel({ count: n });
  const slideLabel = useTPair("Ir a la diapositiva", "Go to slide");

  // Single slide (or none): render it statically — no clones, autoplay, dots,
  // drag, or keys. Nothing to loop or announce.
  if (n <= 1) {
    return (
      <div
        className={`overflow-hidden ${className}`}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        <div className="px-2">{slides[0] ?? null}</div>
      </div>
    );
  }

  const rendered = [slides[n - 1], ...slides, slides[0]];
  const animate = c.anim && !c.reducedMotion;

  return (
    // Root wraps track + dots so hover/focus-within/keyboard/IntersectionObserver
    // all cover the dots too, not just the slides.
    <div
      ref={c.containerRef}
      className={className}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={c.onKeyDown}
      onPointerEnter={c.onPointerEnter}
      onPointerLeave={c.onPointerLeave}
      onFocus={c.onFocus}
      onBlur={c.onBlur}
    >
      <div className="overflow-hidden">
        <div
          className="flex items-stretch will-change-transform"
          style={{
            width: `${c.total * 100}%`,
            transform: `translate3d(calc(${(-c.index * 100) / c.total}% + ${c.dragPx}px), 0, 0)`,
            transition: animate
              ? "transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1)"
              : "none",
            touchAction: "pan-y",
          }}
          onTransitionEnd={c.handleEnd}
          onPointerDown={c.onPointerDown}
          onPointerMove={c.onPointerMove}
          onPointerUp={c.onPointerUp}
          onPointerCancel={c.onPointerUp}
          onClickCapture={c.onClickCapture}
        >
          {rendered.map((slide, i) => (
            <div
              key={i}
              style={{ width: `${100 / c.total}%` }}
              className="shrink-0 px-2"
              aria-hidden={i === 0 || i === n + 1 || undefined}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators — real focusable buttons (≥24px hit target). */}
      <div className="mt-5 flex items-center justify-center gap-1">
        {slides.map((_, i) => {
          const active = i === c.activeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => c.goTo(i)}
              aria-label={`${slideLabel} ${i + 1}`}
              aria-current={active ? "true" : undefined}
              className="group flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-200 motion-reduce:transition-none ${
                  active
                    ? "w-5 bg-foreground"
                    : "w-2 bg-line-strong group-hover:bg-muted"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
