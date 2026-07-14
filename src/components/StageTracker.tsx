"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { T } from "./I18nProvider";
import { STAGES, stageIndex, type Stage } from "@/src/lib/labs";

/**
 * Tame the per-product hue into a small, low-chroma signal for the dark canvas:
 * mix it toward the muted gray so it reads as identity, not decoration. Only
 * ever applied to dots / bars / rings — never to a surface fill or to text.
 */
function signal(color: string): string {
  return `color-mix(in srgb, ${color} 55%, var(--muted))`;
}

/**
 * Horizontal five-stage progress tracker (Idea → Release).
 * Fluid, equal-width columns so labels never overflow on small screens.
 * The connecting line spans the first→last node centers; the fill grows up
 * to `currentStage`. Nodes pop in with a staggered spring; the current node
 * pulses. Respects prefers-reduced-motion.
 */
export default function StageTracker({
  currentStage,
  color,
  size = "md",
}: {
  currentStage: Stage;
  color: string;
  size?: "sm" | "md";
}) {
  const reduce = useReducedMotion();
  const current = stageIndex(currentStage);
  const lastIndex = STAGES.length - 1;
  const pct = lastIndex > 0 ? (current / lastIndex) * 100 : 0;

  const dot = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  // Line sits at the vertical center of the dots.
  const trackTop = size === "sm" ? "top-[6px]" : "top-[7px]";
  // Each column is 1/5 wide, so the node centers land at 10%, 30%, … 90%.
  // The line spans the first→last centers.
  const span = `${100 / STAGES.length / 2}%`;

  return (
    <div className="w-full min-w-0">
      <div className="relative">
        {/* Line track spanning first → last node centers */}
        <div
          className={`absolute ${trackTop} h-[2px]`}
          style={{ left: span, right: span }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-full bg-line-strong" />
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundColor: signal(color) }}
            initial={{ width: reduce ? `${pct}%` : "0%" }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          />
        </div>

        <ol className="relative flex">
          {STAGES.map((s, i) => {
            const done = i < current;
            const isCurrent = i === current;
            return (
              <motion.li
                key={s.key}
                className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
                initial={reduce ? false : { opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 22,
                  delay: 0.12 + i * 0.09,
                }}
              >
                <span className="relative flex items-center justify-center">
                  {/* Pulse ring on the current node */}
                  {isCurrent && !reduce && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: signal(color) }}
                      initial={{ opacity: 0.35, scale: 1 }}
                      animate={{ opacity: 0, scale: 2.4 }}
                      transition={{
                        duration: 1.8,
                        ease: "easeOut",
                        repeat: Infinity,
                        delay: 0.6,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative ${dot} flex items-center justify-center rounded-full ${
                      done
                        ? ""
                        : isCurrent
                          ? "bg-surface"
                          : "border border-dashed border-line-strong bg-surface"
                    }`}
                    style={
                      done
                        ? { backgroundColor: signal(color) }
                        : isCurrent
                          ? { boxShadow: `0 0 0 2px ${signal(color)}` }
                          : undefined
                    }
                  >
                    {done && (
                      <Check
                        className="h-2.5 w-2.5 text-background"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    )}
                    {isCurrent && (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: signal(color) }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </span>
                <span
                  className={`px-0.5 text-[9px] font-medium uppercase leading-tight tracking-[0.06em] sm:text-[10px] sm:tracking-[0.1em] ${
                    done || isCurrent ? "text-foreground" : "text-muted"
                  }`}
                >
                  <T es={s.label.es} en={s.label.en} />
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
