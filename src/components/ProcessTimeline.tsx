"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { T, useLocale } from "@/src/components/I18nProvider";

/* Node/rail geometry (SVG user units == px, so the viewBox is 1:1 and circles
   stay round). RAIL_W is the node column width; RING_R the circle radius. */
const RAIL_W = 40;
const CX = RAIL_W / 2;
const RING_R = 18;

/** Process steps. Titles are the anchors (reserved #FFF); supporting copy muted. */
const steps = [
  {
    n: "01",
    title: { es: "Entender el proyecto", en: "Understand the project" },
    copy: {
      es: "Metas, alcance y contexto antes de tocar el diseño.",
      en: "Goals, scope, and context before touching design.",
    },
  },
  {
    n: "02",
    title: { es: "Prototipado", en: "Prototyping" },
    copy: {
      es: "Wireframes y prototipos para validar la dirección rápido.",
      en: "Wireframes and prototypes to validate direction fast.",
    },
  },
  {
    n: "03",
    title: { es: "Desarrollo", en: "Development" },
    copy: {
      es: "Código limpio y escalable, hecho para crecer.",
      en: "Clean, scalable code built to grow.",
    },
  },
  {
    n: "04",
    title: { es: "Publicación", en: "Launch" },
    copy: {
      es: "Despliegue, pruebas y puesta en marcha sin fricción.",
      en: "Deployment, testing, and a frictionless launch.",
    },
  },
  {
    n: "05",
    title: { es: "Mantenimiento continuo", en: "Ongoing maintenance" },
    copy: {
      es: "Mejoras, soporte y evolución después del lanzamiento.",
      en: "Improvements, support, and evolution after launch.",
    },
  },
] as const;

/** One continuous stroke: rail → circle → rail → circle … through every node. */
function buildPath(centers: number[]): string {
  let d = `M ${CX} ${centers[0] - RING_R}`;
  centers.forEach((cy, i) => {
    // full circle as two 180° arcs, ending back at the top
    d += ` A ${RING_R} ${RING_R} 0 0 1 ${CX} ${cy + RING_R}`;
    d += ` A ${RING_R} ${RING_R} 0 0 1 ${CX} ${cy - RING_R}`;
    if (i < centers.length - 1) d += ` L ${CX} ${centers[i + 1] - RING_R}`;
  });
  return d;
}

export default function ProcessTimeline() {
  const olRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geom, setGeom] = useState<{ d: string; h: number } | null>(null);
  const [play, setPlay] = useState(false);
  const locale = useLocale();

  // Measure node centers relative to the <ol> and rebuild the single path.
  // Both track and progress paths always share this exact `d`, so the lit head
  // can never detach from the rail — they're the same geometry, rebuilt together.
  const recompute = useCallback(() => {
    const ol = olRef.current;
    if (!ol) return;
    const olTop = ol.getBoundingClientRect().top;
    const centers = nodeRefs.current.map((el) => {
      if (!el) return NaN;
      const r = el.getBoundingClientRect();
      return r.top - olTop + r.height / 2;
    });
    if (centers.some((c) => !Number.isFinite(c))) return;
    setGeom({ d: buildPath(centers), h: ol.offsetHeight });
  }, []);

  // Initial measure + debounced ResizeObserver. Debounced so a reflow can't
  // rebuild `d`/viewBox on every intermediate frame. And because dashoffset is
  // pathLength-normalized and driven by the CSS scroll timeline (not a value we
  // hold in JS), a rebuild only swaps geometry — the head is re-derived from the
  // current scroll position at the same fraction, so it never snaps mid-scrub.
  useEffect(() => {
    recompute();
    const ol = olRef.current;
    if (!ol || typeof ResizeObserver === "undefined") return;
    let t: number | null = null;
    const ro = new ResizeObserver(() => {
      if (t !== null) window.clearTimeout(t);
      t = window.setTimeout(recompute, 150);
    });
    ro.observe(ol);
    return () => {
      if (t !== null) window.clearTimeout(t);
      ro.disconnect();
    };
  }, [recompute]);

  // ES↔EN swaps copy → node centers move → rebuild immediately (post-commit,
  // after the <T> text and layout have updated). Belt-and-suspenders with the RO.
  useEffect(() => {
    recompute();
  }, [locale, recompute]);

  // Native scroll-scrubbing (CSS `animation-timeline`) needs no JS. Only where
  // it's unsupported do we fall back to IntersectionObserver play-once.
  useEffect(() => {
    const supportsScrub =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline", "view()");
    if (supportsScrub) return;
    const ol = olRef.current;
    if (!ol) return;
    if (typeof IntersectionObserver === "undefined") {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(ol);
    return () => io.disconnect();
  }, []);

  const spineReady = geom !== null;

  return (
    <ol
      ref={olRef}
      className={`tl ${spineReady ? "spine-ready" : ""} ${play ? "is-visible" : ""}`}
    >
      {/* Single continuous spine — one stroke drawn by one moving head. Track is
          the faint full path (base state); progress is the lit portion. */}
      {geom && (
        <svg
          className="tl-spine"
          width={RAIL_W}
          height={geom.h}
          viewBox={`0 0 ${RAIL_W} ${geom.h}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            className="tl-track"
            d={geom.d}
            stroke="var(--line-strong)"
            strokeWidth="2"
          />
          <path
            className="tl-progress"
            d={geom.d}
            stroke="var(--foreground-strong)"
            strokeWidth="2"
            pathLength={1}
          />
        </svg>
      )}

      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={s.n}
            className="grid grid-cols-[40px_1fr] gap-x-5 motion-safe:lg:min-h-[var(--tl-step-h)]"
          >
            <div className="flex flex-col items-center">
              {/* Node marker: number over --background so the rail passing through
                  it stays legible. Its fallback ring/rail (CSS, --line-strong)
                  show only until the SVG spine is ready. */}
              <span
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className="tl-node relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background font-mono text-xs text-muted"
              >
                {s.n}
              </span>
              {!last && (
                <div
                  aria-hidden="true"
                  className="tl-rail-fallback mt-1 w-px flex-1 bg-line-strong"
                />
              )}
            </div>
            <div className={last ? "pb-0" : "pb-12"}>
              <h3 className="text-lg sm:text-xl font-medium tracking-tight text-foreground-strong">
                <T es={s.title.es} en={s.title.en} />
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                <T es={s.copy.es} en={s.copy.en} />
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
