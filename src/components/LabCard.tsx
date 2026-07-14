"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { T } from "./I18nProvider";
import StageTracker from "./StageTracker";
import { latestMilestone, stageLabel, type LabProduct } from "@/src/lib/labs";

export default function LabCard({
  product,
  index = 0,
}: {
  product: LabProduct;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const latest = latestMilestone(product);
  const current = stageLabel(product.currentStage);

  return (
    <motion.div
      className="min-w-0"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <Link
        href={`/labs/${product.slug}`}
        aria-label={product.name}
        className="group relative flex h-full flex-col rounded-[28px] border border-line bg-surface p-6 sm:p-8 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-line-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {/* Header */}
        <h2 className="text-2xl tracking-tight leading-none text-foreground-strong">
          {product.name}
        </h2>

        {/* Tagline */}
        <p className="mt-6 text-[15px] leading-relaxed text-muted-strong">
          <T es={product.tagline.es} en={product.tagline.en} />
        </p>

        {/* Stage tracker */}
        <div className="mt-8">
          <StageTracker
            currentStage={product.currentStage}
            color={product.color}
            size="sm"
          />
        </div>

        {/* Current stage + latest milestone */}
        <div className="mt-auto pt-7">
          <div className="border-t border-line pt-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
              <T es="Etapa actual" en="Current stage" /> —{" "}
              <span className="text-foreground">
                <T es={current.es} en={current.en} />
              </span>
            </p>
            {latest && (
              <p className="mt-2 text-[15px] text-muted-strong">
                <T es={latest.title.es} en={latest.title.en} />
              </p>
            )}
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            <T es="Seguir el proceso" en="Follow the build" />
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
