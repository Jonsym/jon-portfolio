"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { projects, canOptimizeSrc, type Project } from "@/src/lib/projects";
import HeroWordmark from "@/src/components/HeroWordmark";

/**
 * Scroll-driven projects collage — ported from the reference prototype.
 *
 * SEQUENCING — one master ordering (`projects`); row i renders a window starting
 * at a deterministic riffle offset (uses Math.ceil so an odd count yields all
 * distinct offsets), wrapping cyclically.
 *
 * ENGINE — a two-pass frame:
 *   pass 1: each row's progress from where it actually sits *right now* (seeded
 *           from last frame's positions), relative to the active line;
 *   pass 2: a cumulative walk using the ACTUAL per-row heights, so a growing row
 *           PUSHES the rows below it (they rise) instead of overlapping them.
 * Rows are absolutely positioned and translated by `--y`. Both card ends are
 * width-derived (rest = window fills the viewport exactly; peak = a fraction of
 * it), never absolute pixels. `rootTop` is read live each frame.
 */

/* --------------------------- tuning constants --------------------------- */

export const WINDOW = 5; // window is always 5; only how many are *visible* changes
export const ACTIVE_RANGE = 0.5; // wider zone → the zoom plays out over more scroll
export const ANCHOR_FRAC = 0.5;
export const PEAK_WIDTH_RATIO = 0.49; // desktop: two neighbours still bleed at peak
export const PEAK_WIDTH_RATIO_MOBILE = 0.98; // mobile: the centre card fills the screen
export const REST_DESKTOP = 0.5;
export const REST_MOBILE = 0.6;
export const PEAK_DESKTOP = 1.0;
export const PEAK_MOBILE = 1.04;
export const LERP = 0.12; // temporal damping toward each row's target

const HALF = (WINDOW - 1) / 2;
const N = projects.length;
// Smoothstep: symmetric ease so entering and leaving the active line feel alike.
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const wrap = (i: number, n: number) => ((i % n) + n) % n;
const thumbOf = (p: Project): string => p.image ?? p.video?.poster ?? "";

// Riffle offset — Math.ceil so an odd N gives all-distinct offsets.
const halfN = Math.ceil(N / 2);
const shift = (i: number) => (i % 2 === 0 ? i / 2 : halfN + (i - 1) / 2) % N;

type Row = { first: boolean; items: { project: Project; k: number }[] };

// No buffer rows: the wordmark (above the first row) is the top buffer, and the
// next section is pulled up into the bottom peak-reserve via a negative margin.
const ROWS: Row[] = Array.from({ length: N }, (_, i) => {
  const s = shift(i);
  return {
    first: i === 0,
    items: Array.from({ length: WINDOW }, (_, k) => ({
      project: projects[wrap(s + k, N)],
      k,
    })),
  };
});

function Card({
  project,
  k,
  priority,
}: {
  project: Project;
  k: number;
  priority?: boolean;
}) {
  const src = thumbOf(project);
  const isCenter = k === HALF;
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      aria-label={`${project.title} — ${project.year}`}
      tabIndex={isCenter ? undefined : -1}
      className={`collage-item visual-index-${k}`}
    >
      <div className="elementSeen" aria-hidden="true" />
      <div className="collage-thumb">
        {src ? (
          <Image
            src={src}
            alt={project.title}
            fill
            sizes="45vw"
            priority={priority}
            fetchPriority={priority ? "high" : "low"}
            unoptimized={!canOptimizeSrc(src)}
            className="collage-img"
          />
        ) : null}
      </div>
      <div className="collage-label">
        <span className="collage-title">{project.title}</span>
        <span className="collage-year">../{project.year}</span>
      </div>
    </Link>
  );
}

type Cache = {
  vh: number;
  aspect: number; // width / height
  gap: number;
  capH: number;
  cardHRest: number;
  cardHPeak: number;
  rowHRest: number; // card + caption at rest — the identical base height
  rowHPeak: number;
  pusher: number; // top offset reserving whitespace + wordmark
  rest: number;
  peak: number;
  posIn: number[]; // last frame's row tops (seed for pass 1)
};

export default function ProjectsCollage() {
  const rootRef = useRef<HTMLElement | null>(null);
  const wmRef = useRef<HTMLDivElement | null>(null);
  const rowEls = useRef<(HTMLDivElement | null)[]>([]);
  const cache = useRef<Cache | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  // Per-row damped value + gates: don't animate until the user has scrolled.
  const tCurrent = useRef<number[]>(ROWS.map(() => 0));
  const primed = useRef(false);
  const lastNow = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const vh = window.innerHeight;
    const vw = root.clientWidth;
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    const cs = getComputedStyle(root);
    const gap = parseFloat(cs.getPropertyValue("--gap")) || 20;
    const aspectW = parseFloat(cs.getPropertyValue("--aspect-w")) || 5;
    const aspectH = parseFloat(cs.getPropertyValue("--aspect-h")) || 3;
    const aspect = aspectW / aspectH;

    const pageMargin = parseFloat(cs.getPropertyValue("--page-margin")) || 24;
    // How many of the 5-wide window read as complete at rest: 3 on mobile, 5 on
    // desktop. The outer cards overflow and provide the edge slivers.
    const visibleAtRest = mobile ? 3 : 5;
    const peakRatio = mobile ? PEAK_WIDTH_RATIO_MOBILE : PEAK_WIDTH_RATIO;
    const cardWRest =
      (vw - 2 * pageMargin - (visibleAtRest - 1) * gap) / visibleAtRest;
    const cardWPeak = vw * peakRatio;
    const cardHRest = cardWRest / aspect;
    const cardHPeak = cardWPeak / aspect;

    const capEl = root.querySelector<HTMLElement>(".collage-label");
    const capH = capEl ? capEl.getBoundingClientRect().height + 8 : 30;
    const rowHRest = cardHRest + capH;
    const rowHPeak = cardHPeak + capH;

    // Derive the top spacer so the first row's caption lands just inside the
    // fold and the one --gap below it pushes row 2 fully past the fold.
    // rowHRest === the first row's block height (card + caption gap + caption).
    // caption bottom = firstRowTop + rowHRest = vh - CLEARANCE  (inside)
    // row 2 top      = caption bottom + gap  = vh + (gap - CLEARANCE) ≥ vh
    const CLEARANCE = 8;
    const wmH = wmRef.current?.getBoundingClientRect().height ?? vh * 0.2;
    const collageTop = root.getBoundingClientRect().top + window.scrollY; // header band height
    const firstRowTop = vh - rowHRest - CLEARANCE;
    const pusher = Math.max(wmH + gap + vh * 0.02, firstRowTop - collageTop);
    // The wordmark sits directly above the first row (gap between).
    if (wmRef.current) wmRef.current.style.top = `${pusher - gap - wmH}px`;

    const n = ROWS.length;
    // Resting stack + the extra one peaked row adds → scrollHeight never drifts.
    const height =
      pusher + n * (rowHRest + gap) - gap + (rowHPeak - rowHRest);
    root.style.height = `${height}px`;
    root.style.setProperty("--base-height", `${rowHRest}px`);
    // Pull the next section up into the empty bottom peak-reserve. Leaving half
    // the reserve keeps room for the last row's own expansion; the rest is dead
    // space at the end of the scroll, so the following section can overlap it.
    root.style.marginBottom = `-${Math.round((rowHPeak - rowHRest) * 0.55)}px`;

    cache.current = {
      vh,
      aspect,
      gap,
      capH,
      cardHRest,
      cardHPeak,
      rowHRest,
      rowHPeak,
      pusher,
      rest: mobile ? REST_MOBILE : REST_DESKTOP,
      peak: mobile ? PEAK_MOBILE : PEAK_DESKTOP,
      posIn: ROWS.map((_, i) => pusher + i * (rowHRest + gap)),
    };
  }, []);

  const layout = useCallback((dynamic: boolean, dt = 1 / 60) => {
    const c = cache.current;
    if (!c) return;
    const rootTop = rootRef.current?.getBoundingClientRect().top ?? 0;
    const anchorVp = c.vh * ANCHOR_FRAC;
    const range = c.vh * ACTIVE_RANGE;
    const span = c.cardHPeak - c.cardHRest;
    const n = ROWS.length;
    const cur = tCurrent.current;

    // Pass 1 — each row's TARGET t from where it sits now (seed = last frame's
    // tops), symmetric smoothstep. Then damp the current value toward it, frame-
    // rate independent — until the first scroll, everything stays at rest so the
    // page doesn't animate on load.
    if (!dynamic) {
      for (let i = 0; i < n; i++) cur[i] = 0;
    } else if (!primed.current) {
      for (let i = 0; i < n; i++) cur[i] = 0;
      if (window.scrollY > 0.5) primed.current = true;
    } else {
      const k = 1 - Math.pow(1 - LERP, dt * 60);
      for (let i = 0; i < n; i++) {
        const centerVp = rootTop + c.posIn[i] + c.rowHRest / 2;
        const target = smoothstep(
          clamp01(1 - Math.abs(centerVp - anchorVp) / range)
        );
        cur[i] += (target - cur[i]) * k;
      }
    }

    // Pass 2 — cumulative walk with ACTUAL (damped) heights: growing rows push
    // the rest. will-change only on rows that are actually moving.
    const outY = new Array<number>(n);
    let y = c.pusher;
    for (let i = 0; i < n; i++) {
      outY[i] = y;
      const el = rowEls.current[i];
      const t = cur[i];
      const cardH = c.cardHRest + span * t;
      if (el) {
        el.style.setProperty("--base-height", `${c.rowHRest}px`);
        el.style.setProperty("--y", `${y}px`);
        el.style.setProperty("--card-h", `${cardH}px`);
        el.style.setProperty("--card-w", `${cardH * c.aspect}px`);
        el.style.setProperty("--progress", (c.rest + (c.peak - c.rest) * t).toFixed(4));
        el.style.zIndex = String(1 + Math.round(t * 100));
        el.style.willChange = t > 0.001 ? "transform" : "auto";
      }
      y += cardH + c.capH + c.gap;
    }
    c.posIn = outY;
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    layout(!reduce);
    setReady(true);

    if (reduce) {
      // No smooth scroll, no rAF; just keep the static layout correct on resize.
      const onResize = () => {
        measure();
        layout(false);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // Smooth scroll (real scrollTop, so CSS scroll-timeline sections still track)
    // driven from ONE frame loop: Lenis advances the position, then the collage
    // reads it — order matters. dt (seconds) makes the damping frame-independent.
    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    // Only run the layout while the scroll is actually moving (plus a short tail
    // so the damping settles). When idle, the loop does nothing — which leaves
    // the main thread free so the wordmark's 3D spin never stalls on hover.
    let lastY = -1;
    let settle = 0;
    let id = requestAnimationFrame(function raf(now: number) {
      lenis.raf(now);
      const y = window.scrollY;
      if (y !== lastY) {
        lastY = y;
        settle = 45;
      }
      if (settle > 0) {
        const dt =
          lastNow.current == null ? 1 / 60 : Math.min(0.05, (now - lastNow.current) / 1000);
        lastNow.current = now;
        layout(true, dt);
        settle -= 1;
      } else {
        lastNow.current = null;
      }
      id = requestAnimationFrame(raf);
    });

    // Keyboard parity: tabbing to a row's centre card brings that row to the
    // active line, so keyboard users see the same emphasis.
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      const center = el?.closest?.(".collage-item.visual-index-2");
      const row = center?.closest(".collage-row");
      const c = cache.current;
      if (row && c) {
        primed.current = true;
        lenis.scrollTo(row as HTMLElement, {
          offset: -(c.vh * ANCHOR_FRAC - c.rowHRest / 2),
        });
      }
    };
    const root = rootRef.current;
    root?.addEventListener("focusin", onFocusIn);

    const onResize = () => {
      measure();
      layout(true);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
      root?.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("resize", onResize);
    };
  }, [measure, layout]);

  return (
    <section
      ref={rootRef}
      id="proyectos"
      aria-label="Selected work"
      className={`collage-root ${ready ? "is-ready" : ""}`}
    >
      {/* Wordmark lives inside the collage, above the first row. */}
      <div ref={wmRef} className="collage-wordmark">
        <HeroWordmark />
      </div>

      {ROWS.map((row, i) => (
        <div
          key={i}
          ref={(el) => {
            rowEls.current[i] = el;
          }}
          className={`collage-row automatic-minheight ${
            row.first ? "first-projects-row" : ""
          }`}
        >
          <div className="collage-wrapper">
            {row.items.map(({ project, k }) => (
              <Card key={k} project={project} k={k} priority={row.first} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
