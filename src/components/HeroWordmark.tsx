"use client";

import { useEffect, useRef, useState } from "react";
import { useTPair } from "@/src/components/I18nProvider";

/**
 * The hero wordmark — "JON @ JON @ JON …" wrapped around a horizontal 3D ring
 * that spins continuously (the rotative "360" text), in Archivo Black. Each
 * repetition is a face placed around a cylinder whose radius is computed from
 * the measured word width so the faces tile edge to edge at any viewport.
 * `backface-visibility: hidden` makes a face vanish as it turns to the back
 * (no mirrored text) and reappear at the front — a seamless 360° loop.
 *
 * Until the client has measured (SSR / first paint / no-JS), a flat marquee
 * stands in so the wordmark is never blank.
 */

const SEG_COUNT = 10; // faces around the ring

// Shared type ramp for the ring faces AND the hidden measuring node — Archivo
// Black via --font-display. They must match exactly or the radius won't tile.
const FACE =
  "font-[family-name:var(--font-display)] uppercase leading-[0.8] text-[16vw] lg:text-[13vw] text-foreground-strong whitespace-nowrap";

function Unit() {
  // Plain "@" glyph — no ringed badge around it.
  return (
    <span className="flex items-center gap-[0.12em] pr-[0.18em]">
      <span>JON</span>
      <span aria-hidden="true">@</span>
    </span>
  );
}

export default function HeroWordmark() {
  const name = useTPair(
    "Jon Zamudio — Diseño y Desarrollo Web",
    "Jon Zamudio — Web Design & Development"
  );

  const measureRef = useRef<HTMLSpanElement>(null);
  const [geo, setGeo] = useState<{ radius: number; perspective: number } | null>(
    null
  );

  useEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      const w = el?.offsetWidth ?? 0;
      if (!w) return;
      const radius = (SEG_COUNT * w) / (2 * Math.PI);
      setGeo({ radius, perspective: radius * 1.15 });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      aria-label={name}
      className="marquee3d relative w-full overflow-hidden select-none h-[26vw] lg:h-[20vw]"
      style={geo ? { perspective: `${geo.perspective}px` } : undefined}
    >
      <h1 className="sr-only">{name}</h1>

      <span
        ref={measureRef}
        aria-hidden="true"
        className={`invisible pointer-events-none absolute left-0 top-0 ${FACE}`}
      >
        <Unit />
      </span>

      {geo ? (
        <div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: `translateZ(-${geo.radius}px)` }}
        >
          <div className="wordmark-rotor absolute inset-0 [transform-style:preserve-3d]">
            {Array.from({ length: SEG_COUNT }, (_, i) => (
              <div
                key={i}
                className={`wordmark-face absolute inset-0 flex items-center justify-center ${FACE}`}
                style={{
                  transform: `rotateY(${
                    i * (360 / SEG_COUNT)
                  }deg) translateZ(${geo.radius}px)`,
                }}
              >
                <Unit />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`marquee-track absolute inset-0 flex w-max items-center ${FACE}`}
        >
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <Unit key={i} />
            ))}
          </span>
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <Unit key={i} />
            ))}
          </span>
        </div>
      )}
    </section>
  );
}
