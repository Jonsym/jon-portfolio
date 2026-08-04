"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

/**
 * CrowdCanvas — a walking Open Peeps crowd drawn to a <canvas> (reconstructed
 * from the Skiper UI / Open Peeps pattern), hardened for this page where Lenis
 * and the collage's rAF already share the main thread:
 *
 *  1. rendering is gated by an IntersectionObserver — off-screen = no draw;
 *  2. resize is debounced and ignores height-only changes (mobile URL bar);
 *  3. the image onload is guarded against firing after unmount;
 *  4. devicePixelRatio is clamped to 2, used consistently in resize + render.
 *
 * Under prefers-reduced-motion the crowd is built and frozen (a still crowd);
 * the canvas is decorative (aria-hidden).
 *
 * `src` must be a `rows`×`cols` sprite sheet: the sheet is sliced width/rows
 * horizontally and height/cols vertically.
 */

type Rect = [number, number, number, number];

interface Peep {
  image: HTMLImageElement;
  rect: Rect;
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
}

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomIndex = (arr: unknown[]) => (randomRange(0, arr.length) | 0);
const removeFromArray = <T,>(arr: T[], i: number) => arr.splice(i, 1)[0];
const removeItem = <T,>(arr: T[], item: T) => removeFromArray(arr, arr.indexOf(item));
const removeRandom = <T,>(arr: T[]) => removeFromArray(arr, randomIndex(arr));

export default function CrowdCanvas({
  src,
  rows,
  cols,
  className = "h-[90vh] w-full",
}: {
  src: string;
  rows: number;
  cols: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2); // clamped — shared

    const stage = { width: 0, height: 0 };
    const all: Peep[] = [];
    const available: Peep[] = [];
    const crowd: Peep[] = [];

    let cancelled = false;
    let rendering = false;
    let lastW = window.innerWidth;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let io: IntersectionObserver | undefined;

    const img = new Image();

    const drawPeep = (peep: Peep) => {
      ctx.save();
      ctx.translate(peep.x, peep.y);
      ctx.scale(peep.scaleX, 1);
      ctx.drawImage(
        peep.image,
        peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3],
        0, 0, peep.width, peep.height
      );
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr); // same clamped dpr as resize
      crowd.forEach(drawPeep);
      ctx.restore();
    };

    const resetPeep = (peep: Peep) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * (gsap.parseEase("power2.in") as (t: number) => number)(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;
      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      return { startX, startY, endX };
    };

    const walkPeep = (peep: Peep) => {
      const { startY, endX } = resetPeep(peep);
      const xDuration = 10;
      const yDuration = 0.25;
      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(
        peep,
        { duration: yDuration, repeat: Math.round(xDuration / yDuration), yoyo: true, y: startY - 10 },
        0
      );
      return tl;
    };

    const addPeep = (): Peep => {
      const peep = removeRandom(available);
      const walk = walkPeep(peep).eventCallback("onComplete", () => {
        removeItem(crowd, peep);
        available.push(peep);
        addPeep();
      });
      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const initCrowd = () => {
      while (available.length) {
        // spread them across their walk so the crowd starts full
        addPeep().walk?.progress(Math.random());
      }
    };

    const buildRects = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const rectW = w / rows; // sliced width / rows horizontally
      const rectH = h / cols; // sliced height / cols vertically
      const total = rows * cols;
      for (let i = 0; i < total; i++) {
        const rect: Rect = [
          (i % rows) * rectW,
          Math.floor(i / rows) * rectH,
          rectW,
          rectH,
        ];
        all.push({
          image: img,
          rect,
          width: rectW,
          height: rectH,
          x: 0,
          y: 0,
          anchorY: 0,
          scaleX: 1,
          walk: null,
        });
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = Math.round(stage.width * dpr);
      canvas.height = Math.round(stage.height * dpr);
      crowd.forEach((p) => p.walk?.kill());
      crowd.length = 0;
      available.length = 0;
      available.push(...all);
      initCrowd();
      if (reduce) {
        crowd.forEach((p) => p.walk?.progress(Math.random()).pause());
        render();
      }
    };

    const startRender = () => {
      if (reduce || rendering) return;
      rendering = true;
      gsap.ticker.add(render);
    };
    const stopRender = () => {
      if (!rendering) return;
      rendering = false;
      gsap.ticker.remove(render);
    };

    const handleResize = () => {
      if (window.innerWidth === lastW) return; // height-only (URL bar): ignore
      lastW = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    const init = () => {
      if (cancelled) return;
      buildRects();
      resize();
      // Only draw while the section is near/on screen.
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (reduce) render();
            else startRender();
          } else {
            stopRender();
          }
        },
        { rootMargin: "200px" }
      );
      io.observe(canvas);
      window.addEventListener("resize", handleResize);
    };

    img.onload = () => {
      if (!cancelled) init();
    };
    img.src = src;

    return () => {
      cancelled = true;
      img.onload = null;
      stopRender();
      io?.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      crowd.forEach((p) => p.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
