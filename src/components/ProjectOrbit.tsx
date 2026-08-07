"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { T, useTPair } from "@/src/components/I18nProvider";
import type { Project } from "@/src/lib/projects";

/**
 * Projects as an endless carousel of title circles filling one locked viewport.
 * There is no page scroll — this component owns the screen (see `GlobalFooter`,
 * which hides the footer on this route).
 *
 * The axis flips with the breakpoint:
 *   • lg and up — two VERTICAL columns; input runs the left one up, right down.
 *   • below lg  — two HORIZONTAL rows; input runs the top one left, bottom right.
 * Reversing the input reverses both, always in opposition.
 *
 * Both layouts are in the DOM at once, toggled with `hidden`/`lg:hidden`.
 * `display: none` also drops a subtree from the accessibility tree, so exactly
 * one set of links is exposed — no duplicate announcements, no responsive
 * `aria-hidden` juggling. The offset is shared, so switching breakpoints keeps
 * your place; a hidden rail measures 0 and is simply skipped until it shows.
 *
 * The loop is modulo arithmetic, not clone bookkeeping: each rail renders
 * `REPEAT` copies of its half of the list, parked one cycle back, and the
 * applied translate is wrapped into `[0, cycle)`. Crossing a boundary lands on
 * identical content, so the seam is invisible and it runs forever either way.
 * Each rail wraps on its OWN cycle — the two halves differ in length, so the
 * columns are never in lockstep.
 *
 * Per-frame values (transforms, the navigation counter) are written straight to
 * the DOM. Driving them through state would re-render on every frame.
 */

const REPEAT = 3;
/** Wheel pixels → carousel pixels. */
const RATE = 1;
/** Smoothing per frame. 1 = instant (reduced motion). */
const EASE = 0.09;

type Rail = {
  track: HTMLDivElement | null;
  /** Viewport box the track runs inside — used to centre the counter. */
  frame: HTMLDivElement | null;
  cycle: number;
  count: number;
  axis: "x" | "y";
  /** +1 runs with the offset, -1 against it. */
  dir: 1 | -1;
  /** Static offset of the track inside its frame, in px. */
  stagger: number;
  label: HTMLElement | null;
  items: Project[];
};

export default function ProjectOrbit({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rails = useRef<Rail[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const step = useRef(260);
  /** Set by the effect; lets the dial buttons start the same animation loop. */
  const kickRef = useRef<() => void>(() => {});

  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  const prevLabel = useTPair("Anterior", "Previous");
  const nextLabel = useTPair("Siguiente", "Next");

  // Registered by each rail on mount; order is irrelevant.
  const register = (rail: Rail) => {
    rails.current.push(rail);
    return () => {
      rails.current = rails.current.filter((r) => r !== rail);
    };
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : EASE;

    const measure = () => {
      let biggest = 0;
      for (const rail of rails.current) {
        const t = rail.track;
        if (!t) continue;
        // A hidden rail measures 0; leave its cycle at 0 and skip it.
        const total = rail.axis === "y" ? t.scrollHeight : t.scrollWidth;
        rail.cycle = total / REPEAT;
        const item = rail.count ? rail.cycle / rail.count : 0;
        if (item > biggest) biggest = item;
      }
      if (biggest) step.current = biggest;
    };

    const wrap = (v: number, cycle: number) => (cycle ? ((v % cycle) + cycle) % cycle : 0);

    const paint = () => {
      for (const rail of rails.current) {
        if (!rail.track || !rail.cycle) continue;
        const y = wrap(current.current, rail.cycle);
        // Parked one cycle back, then run with or against the offset.
        const v = rail.dir === -1 ? -(rail.cycle + y) : -rail.cycle + y;
        rail.track.style.transform =
          rail.axis === "y" ? `translate3d(0, ${v.toFixed(1)}px, 0)` : `translate3d(${v.toFixed(1)}px, 0, 0)`;

        // Which circle is nearest the middle of the frame right now. Solving
        // `stagger + i*item ± y + item/2 = span/2` for i — the sign flips with
        // the rail's direction, and the stagger shifts every item with it.
        if (rail.label && rail.count) {
          const box = rail.frame;
          const span = box ? (rail.axis === "y" ? box.clientHeight : box.clientWidth) : 0;
          const item = rail.cycle / rail.count;
          const travel = rail.dir === -1 ? y : -y;
          const at = Math.round((span / 2 - item / 2 - rail.stagger + travel) / item);
          const project = rail.items[((at % rail.count) + rail.count) % rail.count];
          if (project) {
            const n = String(projects.indexOf(project) + 1).padStart(2, "0");
            if (rail.label.textContent !== n) rail.label.textContent = n;
          }
        }
      }
    };

    const frame = () => {
      const d = target.current - current.current;
      if (Math.abs(d) < 0.05) {
        current.current = target.current;
        paint();
        raf.current = null;
        return;
      }
      current.current += d * ease;
      paint();
      raf.current = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (raf.current == null) raf.current = requestAnimationFrame(frame);
    };
    kickRef.current = kick;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current += e.deltaY * RATE;
      kick();
    };

    const onTouchStart = (e: TouchEvent) => {
      drag.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!drag.current) return;
      const { clientX: x, clientY: y } = e.touches[0];
      // Either gesture advances: rows read as horizontal, columns as vertical.
      target.current += drag.current.y - y + (drag.current.x - x);
      drag.current = { x, y };
      kick();
    };
    const onTouchEnd = () => {
      drag.current = null;
    };

    const onKey = (e: KeyboardEvent) => {
      const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
      const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
      if (!back && !fwd) return;
      e.preventDefault();
      target.current += fwd ? step.current : -step.current;
      kick();
    };

    const onResize = () => {
      measure();
      paint();
    };

    measure();
    paint();

    // Nothing behind the carousel may scroll.
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [projects]);

  const nudge = (sign: 1 | -1) => {
    target.current += sign * step.current;
    kickRef.current();
  };

  const years = projects.map((p) => p.year);
  const labelA = useRef<HTMLSpanElement>(null);
  const labelB = useRef<HTMLSpanElement>(null);

  return (
    // Fixed, not in flow: the page never scrolls, and sizing to the viewport
    // directly avoids the container/`vw` arithmetic a full-bleed breakout needs
    // (which rounds against the scrollbar and clipped the edge rails).
    // `top-14` clears the 3.5rem navbar.
    <div
      ref={rootRef}
      className="fixed inset-x-0 bottom-0 top-14 z-0 touch-none select-none overflow-hidden"
    >
      {/* ---------------- below lg: two horizontal rows ---------------- */}
      <div className="lg:hidden">
        <Rail
          register={register}
          items={left}
          projects={projects}
          axis="x"
          dir={-1}
          label={labelA}
          className="absolute inset-x-0 top-[16%] h-[132px]"
        />
        <Rail
          register={register}
          items={right}
          projects={projects}
          axis="x"
          dir={1}
          label={labelB}
          offset={-66}
          className="absolute inset-x-0 top-[50%] h-[132px]"
        />
      </div>

      {/* ---------------- lg and up: two vertical columns ---------------- */}
      <div className="absolute inset-0 hidden justify-center gap-8 lg:flex">
        <Rail
          register={register}
          items={left}
          projects={projects}
          axis="y"
          dir={-1}
          label={labelA}
          className="relative h-full w-[230px]"
        />
        <Rail
          register={register}
          items={right}
          projects={projects}
          axis="y"
          dir={1}
          offset={127}
          label={labelB}
          className="relative h-full w-[230px]"
        />
      </div>

      {/* Title — between the rows on mobile, held left on desktop */}
      <div className="pointer-events-none absolute left-6 top-[41%] z-10 lg:left-12 lg:top-1/2 lg:-translate-y-1/2">
        <h1 className="flex items-start gap-2 text-3xl lg:text-5xl font-medium tracking-tight text-foreground-strong">
          <T es="Proyectos" en="Projects" />
          <span className="mt-1 text-xs tabular-nums text-muted">
            ({String(projects.length).padStart(2, "0")})
          </span>
        </h1>
      </div>

      {/* Era — opposite the title. Stacked on mobile, where a single line of
          it and the title together overrun a phone's width. */}
      <div className="pointer-events-none absolute right-6 top-[38%] z-10 text-right lg:right-12 lg:top-1/2 lg:-translate-y-1/2">
        <p className="flex flex-col items-end text-xl font-medium leading-tight tracking-tight tabular-nums text-muted lg:flex-row lg:items-center lg:text-3xl">
          <span>{Math.min(...years)}</span>
          <span className="mx-2 hidden text-line-strong lg:inline">/</span>
          <span className="lg:hidden text-line-strong">/</span>
          <span>{Math.max(...years)}</span>
        </p>
      </div>

      {/* Navigation dial, bottom left */}
      <div className="absolute bottom-8 left-6 z-10 lg:bottom-12 lg:left-12">
        <div className="flex size-[124px] flex-col items-center justify-center rounded-full border border-line lg:size-[140px]">
          <span className="text-[0.5rem] uppercase tracking-[0.2em] text-muted">
            <T es="Proyectos" en="Projects" />
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label={prevLabel}
              className="text-muted transition-colors duration-150 hover:text-foreground-strong focus:outline-none focus-visible:text-foreground-strong"
            >
              <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <span className="flex items-center text-lg font-medium tabular-nums leading-none text-foreground-strong">
              <span ref={labelA}>01</span>
              <span className="mx-1 text-line-strong">/</span>
              <span ref={labelB}>02</span>
            </span>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label={nextLabel}
              className="text-muted transition-colors duration-150 hover:text-foreground-strong focus:outline-none focus-visible:text-foreground-strong"
            >
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
          <span className="text-[0.5rem] uppercase tracking-[0.2em] text-muted">
            <T es="Navegación" en="Navigation" />
          </span>
        </div>
      </div>

      {/* Caption, bottom right */}
      <p className="pointer-events-none absolute bottom-10 right-6 z-10 max-w-[13rem] text-right text-[0.625rem] uppercase leading-relaxed tracking-widest text-muted lg:bottom-12 lg:right-12 lg:max-w-[15rem] lg:text-xs">
        <T
          es="Una selección de diseño y desarrollo web — del concepto a la entrega."
          en="A selection of web design and development — from concept to delivery."
        />
      </p>
    </div>
  );
}

function Rail({
  register,
  items,
  projects,
  axis,
  dir,
  className,
  offset,
  label,
}: {
  register: (rail: Rail) => () => void;
  items: Project[];
  projects: Project[];
  axis: "x" | "y";
  dir: 1 | -1;
  className: string;
  /** Static stagger along the axis in px, so the two rails don't line up. */
  offset?: number;
  label?: React.RefObject<HTMLSpanElement | null>;
}) {
  const track = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      register({
        track: track.current,
        frame: frame.current,
        cycle: 0,
        count: items.length,
        axis,
        dir,
        stagger: offset ?? 0,
        label: label?.current ?? null,
        items,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    // `className` supplies the positioning: the rows are absolutely placed, the
    // columns sit in a flex row. Keep it out of the base or the two collide.
    <div ref={frame} className={`shrink-0 overflow-hidden ${className}`}>
      {/* The stagger shifts the track inside its frame, not the frame itself —
          moving the frame would drag its clipping box off the layout with it. */}
      <div
        ref={track}
        style={offset ? (axis === "y" ? { top: offset } : { left: offset }) : undefined}
        className={`absolute will-change-transform ${
          axis === "y" ? "inset-x-0 top-0" : "inset-y-0 left-0 flex"
        }`}
      >
        {Array.from({ length: REPEAT }, (_, copy) => (
          <div key={copy} className={`flex ${axis === "y" ? "flex-col items-center" : "flex-row items-center"}`}>
            {items.map((project) => (
              <Orb
                key={project.slug}
                project={project}
                n={projects.indexOf(project) + 1}
                inert={copy > 0}
                axis={axis}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Orb({
  project,
  n,
  inert,
  axis,
}: {
  project: Project;
  n: number;
  inert: boolean;
  axis: "x" | "y";
}) {
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      aria-label={`${project.title} — ${project.year} ${project.category}`}
      tabIndex={inert ? -1 : undefined}
      className={`group relative flex aspect-square shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-b from-white/[0.07] to-white/[0.015] transition-colors duration-300 hover:border-line-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
        axis === "y" ? "my-3 w-full" : "mx-3 h-full"
      }`}
    >
      <span className="absolute top-[13%] text-[0.5rem] uppercase tracking-[0.2em] tabular-nums text-muted lg:text-[0.625rem]">
        N. {String(n).padStart(2, "0")}
      </span>

      <span className="px-6 text-center text-sm italic leading-tight tracking-tight text-balance text-foreground-strong transition-opacity duration-300 group-hover:opacity-60 lg:px-8 lg:text-lg">
        {project.title}
      </span>

      <span className="absolute bottom-[13%] text-[0.5rem] uppercase tracking-[0.2em] tabular-nums text-muted lg:text-[0.625rem]">
        Y. {project.year}
      </span>

      <span aria-hidden="true" className="absolute left-[15%] top-[15%] size-1 rounded-full bg-muted/50" />
      <span aria-hidden="true" className="absolute bottom-[15%] right-[15%] size-1 rounded-full bg-muted/50" />
    </Link>
  );
}
