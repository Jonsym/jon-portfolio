"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero mascot — a hand-drawn cat scene built and animated entirely in SVG (no
 * raster images). Hand-drawn feel = a boil filter (turbulence-displaced outline
 * whose seed cycles a few frames/sec) so the lines jitter like frame-by-frame
 * animation; plus paper grain and a gentle float.
 *
 * The eyes are drawn ON TOP of the boil layer so the pupils can follow the
 * cursor without forcing the whole filter to re-render each move.
 *
 * Reduced-motion: the boil holds still, the float stops, pupils stay centred.
 */

const CAT = "#3a46e6";
const CAT_D = "#242f9e";
const INK = "#20204a";
const PINK = "#eaa6bb";
const ORANGE = "#e2502a";
const GREEN = "#5fbf62";
const EYE = "#f6f2dc";

const L = { cx: 305, cy: 356 };
const R = { cx: 349, cy: 356 };
const MAX = 7;

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
      const m = Math.min(MAX, d);
      el.setAttribute("transform", `translate(${((dx / d) * m).toFixed(1)} ${((dy / d) * m).toFixed(1)})`);
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
      place(lRef.current, L, p);
      place(rRef.current, R, p);
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
      viewBox="0 0 520 660"
      role="img"
      aria-label="Mascota gato descansando"
      className="hero-mascot h-[46vh] max-h-[440px] w-auto"
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
      </defs>

      <g>
        {/* boiled linework (everything except the eyes), on transparent bg */}
        <g filter="url(#boil)">
          {/* lamp */}
          <path d="M462 548 C472 388 476 210 372 150" fill="none" stroke="#8f8f8f" strokeWidth="6" strokeLinecap="round" />
          <path d="M214 150 A86 56 0 0 1 386 150 Z" fill={ORANGE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <line x1="300" y1="150" x2="300" y2="132" stroke="#8f8f8f" strokeWidth="6" strokeLinecap="round" />

          {/* rug */}
          <ellipse cx="272" cy="548" rx="238" ry="82" fill={GREEN} stroke="#2c6b2c" strokeWidth="4" />
          <ellipse cx="272" cy="548" rx="188" ry="60" fill="#7ed17e" opacity="0.45" />

          {/* couch */}
          <path d="M160 350 C160 314 196 300 268 300 C340 300 376 314 376 350 L376 452 L160 452 Z" fill={PINK} stroke={ORANGE} strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M120 392 C120 362 156 358 178 374 L178 548 L120 548 Z" fill={PINK} stroke={ORANGE} strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M416 392 C416 362 380 358 358 374 L358 548 L416 548 Z" fill={PINK} stroke={ORANGE} strokeWidth="4.5" strokeLinejoin="round" />
          <circle cx="387" cy="440" r="12" fill="none" stroke={ORANGE} strokeWidth="3" />
          <path d="M170 440 C170 428 184 422 208 422 L328 422 C352 422 366 428 366 440 L366 540 C366 552 352 558 328 558 L208 558 C184 558 170 552 170 540 Z" fill={PINK} stroke={ORANGE} strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M210 330 C208 360 208 396 214 432 M326 330 C328 360 328 396 322 432" stroke={ORANGE} strokeWidth="2.5" fill="none" opacity="0.7" />

          {/* --- cat (enhanced sprawl) --- */}
          {/* tail */}
          <path d="M240 502 C214 540 220 592 258 602 C238 570 242 536 270 516 C286 504 282 488 268 486 Z" fill={CAT} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          {/* body */}
          <path d="M182 476 C170 442 186 408 224 398 C258 389 300 392 326 410 C352 428 356 468 340 498 C322 530 262 538 224 524 C200 515 190 500 182 476 Z" fill={CAT} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
          {/* belly sheen */}
          <ellipse cx="262" cy="470" rx="52" ry="34" fill="#454ff0" opacity="0.35" />
          {/* back legs */}
          <ellipse cx="200" cy="516" rx="30" ry="20" fill={CAT} stroke={INK} strokeWidth="4" transform="rotate(-14 200 516)" />
          <ellipse cx="300" cy="522" rx="27" ry="18" fill={CAT} stroke={INK} strokeWidth="4" />
          {/* front paws */}
          <ellipse cx="286" cy="440" rx="18" ry="12" fill={CAT_D} stroke={INK} strokeWidth="3" transform="rotate(-8 286 440)" />
          <ellipse cx="322" cy="436" rx="16" ry="11" fill={CAT_D} stroke={INK} strokeWidth="3" transform="rotate(-8 322 436)" />
          {/* yarn */}
          <path d="M304 456 C322 442 324 422 310 416 C326 426 324 450 304 462 Z" fill="none" stroke="#c9d84a" strokeWidth="4" strokeLinecap="round" />
          {/* head + ears */}
          <polygon points="290,306 314,356 262,360" fill={CAT} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <polygon points="368,306 392,360 340,356" fill={CAT} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="327" cy="366" rx="66" ry="54" fill={CAT} stroke={INK} strokeWidth="4.5" transform="rotate(5 327 366)" />
          {/* nose + whiskers */}
          <path d="M327 384 l7 9 -14 0 z" fill={EYE} />
          <g stroke={EYE} strokeWidth="2" strokeLinecap="round" opacity="0.85">
            <line x1="306" y1="392" x2="270" y2="388" />
            <line x1="348" y1="392" x2="384" y2="388" />
          </g>
        </g>

        {/* eyes ON TOP (crisp) so the pupils can track the cursor */}
        <ellipse cx={L.cx} cy={L.cy} rx="18" ry="22" fill={EYE} stroke={INK} strokeWidth="2.5" />
        <ellipse cx={R.cx} cy={R.cy} rx="18" ry="22" fill={EYE} stroke={INK} strokeWidth="2.5" />
        <circle ref={lRef} cx={L.cx} cy={L.cy} r="7.5" fill={INK} />
        <circle ref={rRef} cx={R.cx} cy={R.cy} r="7.5" fill={INK} />
      </g>
    </svg>
  );
}
