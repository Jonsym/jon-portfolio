"use client";

import { useEffect, useRef, useState } from "react";
import { CatLines, EYE_L, EYE_R, EYE_RX, EYE_RY, PUPIL_R, VIEW_BOX } from "./CatArt";

/**
 * Hero mascot — a hand-drawn cat reading a book, built entirely in SVG (no
 * raster images). Single-weight blue linework on the page background, in the
 * style of a marker sketch: shapes are filled with the page colour so they
 * occlude each other instead of showing every line through.
 *
 * Hand-drawn feel = a boil filter (turbulence-displaced outline whose seed
 * cycles a few frames/sec) so the lines jitter like frame-by-frame animation.
 *
 * The eyes are drawn ON TOP of the boil layer so the pupils can follow the
 * cursor without forcing the whole filter to re-render each move. Each pupil
 * is clipped to its capsule, so it slides to the edge and gets cropped there —
 * that crop is what reads as a glance.
 *
 * Reduced-motion: the boil holds still, the float and blink stop, pupils stay
 * centred.
 */

const INK = "#0B0DF7";
/** Fill for occlusion — matches the page so shapes knock each other out. */
const BG = "var(--background, #0a0a0a)";

/** Pupils travel mostly sideways: the capsule is wide and shallow. */
const MAX_X = 34;
const MAX_Y = 9;
/** Distance (in SVG units) at which the glance reaches full travel. */
const REACH = 260;

export default function HeroMascot() {
  const svgRef = useRef<SVGSVGElement>(null);
  const lRef = useRef<SVGCircleElement>(null);
  const rRef = useRef<SVGCircleElement>(null);
  const mouse = useRef({ x: -1, y: -1 });
  const raf = useRef<number | null>(null);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnimate(!reduce);
    if (reduce) return;

    const place = (el: SVGCircleElement | null, eye: { cx: number; cy: number }, p: DOMPoint) => {
      if (!el) return;
      const dx = p.x - eye.cx;
      const dy = p.y - eye.cy;
      const d = Math.hypot(dx, dy) || 1;
      const ease = Math.min(1, d / REACH);
      const tx = (dx / d) * MAX_X * ease;
      const ty = (dy / d) * MAX_Y * ease;
      el.setAttribute("transform", `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`);
    };
    const update = () => {
      raf.current = null;
      const svg = svgRef.current;
      const ctm = svg?.getScreenCTM();
      if (!svg || !ctm || mouse.current.x < 0) return;
      const pt = svg.createSVGPoint();
      pt.x = mouse.current.x;
      pt.y = mouse.current.y;
      const p = pt.matrixTransform(ctm.inverse());
      place(lRef.current, EYE_L, p);
      place(rRef.current, EYE_R, p);
    };
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (raf.current == null) raf.current = requestAnimationFrame(update);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={VIEW_BOX}
      role="img"
      aria-label="Mascota gato leyendo un libro"
      className="hero-mascot h-[46vh] max-h-[440px] w-auto"
      style={{ color: INK }}
    >
      <defs>
        <filter id="boil" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={2} result="n">
            {animate && (
              <animate attributeName="seed" values="2;7;4;9" dur="0.5s" calcMode="discrete" repeatCount="indefinite" />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <clipPath id="eye-l">
          <ellipse cx={EYE_L.cx} cy={EYE_L.cy} rx={EYE_RX} ry={EYE_RY} />
        </clipPath>
        <clipPath id="eye-r">
          <ellipse cx={EYE_R.cx} cy={EYE_R.cy} rx={EYE_RX} ry={EYE_RY} />
        </clipPath>
      </defs>

      <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* boiled linework (everything except the eyes) */}
        <g filter="url(#boil)">
          <CatLines fill={BG} />
        </g>

        {/* eyes ON TOP (crisp) so the pupils can track the cursor */}
        <g className={animate ? "mascot-eye" : undefined}>
          <ellipse cx={EYE_L.cx} cy={EYE_L.cy} rx={EYE_RX} ry={EYE_RY} fill={BG} />
          <g clipPath="url(#eye-l)">
            <circle ref={lRef} cx={EYE_L.cx} cy={EYE_L.cy} r={PUPIL_R} fill="currentColor" stroke="none" />
          </g>
        </g>
        <g className={animate ? "mascot-eye" : undefined}>
          <ellipse cx={EYE_R.cx} cy={EYE_R.cy} rx={EYE_RX} ry={EYE_RY} fill={BG} />
          <g clipPath="url(#eye-r)">
            <circle ref={rRef} cx={EYE_R.cx} cy={EYE_R.cy} r={PUPIL_R} fill="currentColor" stroke="none" />
          </g>
        </g>
      </g>
    </svg>
  );
}
