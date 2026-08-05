"use client";

import { useEffect, useRef } from "react";

/**
 * Hero wordmark — full-width "JON WORKS" in Archivo Black with a liquid wave.
 * Each LETTER is its own element with its own SVG displacement filter, so on
 * hover every letter ripples independently (staggered phase → the wave travels
 * across the word). The row is fit-to-width in JS: measured at a base size, then
 * the font is scaled so the word spans the container exactly (no overflow).
 *
 * Performance: the rAF runs ONLY while hovering (plus a short settle) and only
 * animates each filter's displacement `scale` — the per-letter turbulence noise
 * is fixed, so it stays cached. Reduced-motion skips the wave.
 */

const WORD = "JON WORKS";
const LETTERS = [...WORD];

const IDLE = 6;
const HOVER_BASE = 30;
const HOVER_AMP = 16;
const PHASE = 0.7; // per-letter phase offset → ripple across the word
const SPEED = 4;
const EASE = 0.14;

export default function HeroWordmark() {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const dispRefs = useRef<(SVGFEDisplacementMapElement | null)[]>([]);
  const scales = useRef<number[]>(LETTERS.map(() => IDLE));
  const hovering = useRef(false);
  const raf = useRef<number | null>(null);
  const t = useRef(0);
  const last = useRef<number | null>(null);
  const reduce = useRef(false);

  // Fit the word to the container width (measure natural width, scale the font).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const fit = () => {
      row.style.fontSize = "100px";
      const natural = row.scrollWidth;
      const avail = row.clientWidth;
      if (natural > 0) row.style.fontSize = `${(100 * avail) / natural}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const loop = (now: number) => {
    const dt = last.current == null ? 1 / 60 : Math.min(0.05, (now - last.current) / 1000);
    last.current = now;
    t.current += dt;
    const k = 1 - Math.pow(1 - EASE, dt * 60);
    let moving = false;
    for (let i = 0; i < LETTERS.length; i++) {
      const target = hovering.current
        ? HOVER_BASE + HOVER_AMP * Math.sin(t.current * SPEED + i * PHASE)
        : IDLE;
      scales.current[i] += (target - scales.current[i]) * k;
      dispRefs.current[i]?.setAttribute("scale", scales.current[i].toFixed(2));
      if (hovering.current || Math.abs(scales.current[i] - IDLE) > 0.3) moving = true;
    }
    if (moving) {
      raf.current = requestAnimationFrame(loop);
    } else {
      for (let i = 0; i < LETTERS.length; i++) {
        scales.current[i] = IDLE;
        dispRefs.current[i]?.setAttribute("scale", String(IDLE));
      }
      raf.current = null;
      last.current = null;
    }
  };

  const onEnter = () => {
    if (reduce.current) return;
    hovering.current = true;
    if (raf.current == null) {
      last.current = null;
      raf.current = requestAnimationFrame(loop);
    }
  };
  const onLeave = () => {
    hovering.current = false;
  };

  return (
    <div className="w-full select-none px-4 sm:px-6 lg:px-8">
      {/* Per-letter filter defs (hidden). */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          {LETTERS.map((_, i) => (
            <filter
              key={i}
              id={`hw-${i}`}
              x="-40%"
              y="-45%"
              width="180%"
              height="190%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.013 0.02"
                numOctaves={2}
                seed={7 + i}
                result="noise"
              />
              <feDisplacementMap
                ref={(el) => {
                  dispRefs.current[i] = el;
                }}
                in="SourceGraphic"
                in2="noise"
                scale={IDLE}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>

      <div
        ref={rowRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        aria-label={WORD}
        className="pointer-events-auto flex w-full items-center justify-center whitespace-nowrap font-[family-name:var(--font-display)] uppercase leading-[0.8] text-foreground-strong text-[13vw]"
      >
        {LETTERS.map((ch, i) =>
          ch === " " ? (
            <span key={i} aria-hidden="true" className="inline-block w-[0.2em]" />
          ) : (
            <span
              key={i}
              aria-hidden="true"
              style={{ filter: `url(#hw-${i})` }}
              className="inline-block will-change-[filter]"
            >
              {ch}
            </span>
          )
        )}
      </div>
    </div>
  );
}
