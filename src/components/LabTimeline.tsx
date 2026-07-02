"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { T, useLocale, useTPair } from "./I18nProvider";
import { canOptimizeSrc } from "@/src/lib/projects";
import {
  formatMonth,
  stageLabel,
  STATUS_LABELS,
  type LabMedia,
  type LabMilestone,
} from "@/src/lib/labs";

/** Renders the media element only — caller supplies the sized, positioned frame. */
function MediaEl({ item, sizes }: { item: LabMedia; sizes: string }) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    );
  }
  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      loading="lazy"
      sizes={sizes}
      unoptimized={!canOptimizeSrc(item.src)}
      className="object-cover object-top"
    />
  );
}

/** Heuristic: treat anything taller than it is wide as a phone screenshot. */
function isPortrait(aspect?: string): boolean {
  if (!aspect) return false;
  const [w, h] = aspect.split("/").map(Number);
  return Boolean(w && h && h > w);
}

/**
 * Carousel for 2+ screenshots. Native scroll-snap drives swipe/trackpad,
 * while the arrows + dots make it navigable with a mouse (where you can't
 * drag a scroll container). Active index stays in sync via the scroll event.
 */
function MilestoneCarousel({
  media,
  color,
}: {
  media: LabMedia[];
  color: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const prevLabel = useTPair("Anterior", "Previous");
  const nextLabel = useTPair("Siguiente", "Next");

  // Use bounding rects (not offsetLeft) so the math is correct regardless of
  // which ancestor is the slides' offsetParent.
  const updateActive = useCallback(() => {
    const s = scrollerRef.current;
    if (!s) return;
    const sRect = s.getBoundingClientRect();
    const sCenter = sRect.left + s.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(s.children).forEach((node, i) => {
      const r = (node as HTMLElement).getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - sCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const goTo = useCallback((i: number) => {
    const s = scrollerRef.current;
    if (!s) return;
    const slides = Array.from(s.children) as HTMLElement[];
    const idx = Math.max(0, Math.min(slides.length - 1, i));
    slides[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }, []);

  return (
    <div className="mt-4">
      <ul
        ref={scrollerRef}
        onScroll={updateActive}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5"
      >
        {media.map((item, i) => (
          <li
            key={`${item.src}-${i}`}
            className="relative w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3)] md:h-96 md:w-auto"
            style={{ aspectRatio: item.aspect ?? "9/19.5" }}
          >
            <MediaEl item={item} sizes="(min-width: 768px) 220px, 72vw" />
          </li>
        ))}
      </ul>

      {/* Controls — mobile/responsive only; desktop shows the full row. */}
      <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label={prevLabel}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-150 hover:border-black/40 disabled:cursor-default disabled:opacity-30 disabled:hover:border-black/15"
        >
          <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1.5" role="tablist">
          {media.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === active}
              aria-label={`${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: i === active ? "20px" : "6px",
                backgroundColor:
                  i === active ? color : "rgba(0,0,0,0.22)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === media.length - 1}
          aria-label={nextLabel}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-150 hover:border-black/40 disabled:cursor-default disabled:opacity-30 disabled:hover:border-black/15"
        >
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function MilestoneMedia({
  media,
  color,
}: {
  media: LabMedia[];
  color: string;
}) {
  // Single asset → full-width block (its own aspect ratio).
  if (media.length === 1) {
    const item = media[0];
    const portrait = isPortrait(item.aspect);
    return (
      <div className="mt-4 flex justify-center">
        <div
          className={`relative overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] ${
            portrait ? "h-[22rem] md:h-96" : "w-full"
          }`}
          style={{ aspectRatio: item.aspect ?? "16/10" }}
        >
          <MediaEl
            item={item}
            sizes={portrait ? "240px" : "(min-width: 768px) 640px, 100vw"}
          />
        </div>
      </div>
    );
  }

  // 2+ assets → carousel.
  return <MilestoneCarousel media={media} color={color} />;
}

/** Subtle accent tint for badges, derived from the product color at low alpha. */
function tint(color: string, alpha: number): string {
  return `color-mix(in srgb, ${color} ${alpha}%, transparent)`;
}

function StatusBadge({
  milestone,
  color,
}: {
  milestone: LabMilestone;
  color: string;
}) {
  const { status } = milestone;
  const label = STATUS_LABELS[status];

  if (status === "planned") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-black/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
        <Circle className="h-2.5 w-2.5" strokeWidth={2} aria-hidden="true" />
        <T es={label.es} en={label.en} />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]"
      style={{ backgroundColor: tint(color, 12), color }}
    >
      {status === "completed" ? (
        <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
      ) : (
        <Loader2 className="h-2.5 w-2.5 animate-spin" strokeWidth={2.5} aria-hidden="true" />
      )}
      <T es={label.es} en={label.en} />
    </span>
  );
}

function TimelineNode({
  milestone,
  color,
}: {
  milestone: LabMilestone;
  color: string;
}) {
  const { status } = milestone;
  if (status === "completed") {
    return (
      <span
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden="true" />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white"
        style={{ boxShadow: `0 0 0 2px ${color}` }}
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      </span>
    );
  }
  return (
    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-black/25 bg-white">
      <span className="h-1.5 w-1.5 rounded-full bg-black/20" aria-hidden="true" />
    </span>
  );
}

export default function LabTimeline({
  milestones,
  color,
}: {
  milestones: LabMilestone[];
  color: string;
}) {
  const reduce = useReducedMotion();
  const locale = useLocale();

  return (
    <ol className="relative">
      {milestones.map((m, i) => {
        const isLast = i === milestones.length - 1;
        const planned = m.status === "planned";
        const sLabel = stageLabel(m.stage);

        return (
          <motion.li
            key={`${m.stage}-${m.date}-${i}`}
            className="relative grid grid-cols-[28px_1fr] gap-x-4 sm:gap-x-6"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Rail: node + connecting line */}
            <div className="relative flex flex-col items-center">
              <TimelineNode milestone={m} color={color} />
              {!isLast && (
                <span
                  className="mt-1 w-px flex-1 bg-black/10"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content card */}
            <div className={`pb-8 sm:pb-10 ${planned ? "opacity-70" : ""}`}>
              <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span
                    className="text-[10px] uppercase tracking-[0.18em]"
                    style={{ color }}
                  >
                    <T es={sLabel.es} en={sLabel.en} />
                  </span>
                  <span aria-hidden="true" className="text-black/15">
                    /
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 tabular-nums">
                    {formatMonth(m.date, locale)}
                  </span>
                  <span className="ml-auto">
                    <StatusBadge milestone={m} color={color} />
                  </span>
                </div>

                <h3 className="mt-3 text-lg sm:text-xl tracking-tight leading-snug text-black">
                  <T es={m.title.es} en={m.title.en} />
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  <T es={m.description.es} en={m.description.en} />
                </p>

                {m.media && m.media.length > 0 && (
                  <MilestoneMedia media={m.media} color={color} />
                )}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
