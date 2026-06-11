"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface CarouselHandle {
  next(): void;
  prev(): void;
}

interface MobileCarouselProps {
  slides: React.ReactNode[];
  ariaLabel?: string;
  className?: string;
}

/**
 * Lightweight, dependency-free infinite carousel for mobile/tablet.
 * One slide per view. Loops seamlessly in both directions via two clones
 * (last prepended, first appended) and an instant, transition-less snap when
 * a clone scrolls into view. Pointer/touch drag with horizontal-intent
 * detection so vertical page scrolling still works. Pure CSS transforms.
 */
const MobileCarousel = forwardRef<CarouselHandle, MobileCarouselProps>(
  function MobileCarousel({ slides, ariaLabel, className = "" }, ref) {
    const n = slides.length;
    const total = n + 2; // two clones
    const [index, setIndex] = useState(1); // 1 = first real slide
    const [anim, setAnim] = useState(true);
    const [dragPx, setDragPx] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const drag = useRef({
      active: false,
      startX: 0,
      startY: 0,
      dx: 0,
      width: 1,
      decided: false,
      horizontal: false,
      moved: false,
    });

    const go = useCallback((dir: number) => {
      setAnim(true);
      setIndex((i) => i + dir);
    }, []);

    useImperativeHandle(ref, () => ({ next: () => go(1), prev: () => go(-1) }), [
      go,
    ]);

    // Re-enable the transition on the frame after a clone snap.
    useEffect(() => {
      if (anim) return;
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnim(true)),
      );
      return () => cancelAnimationFrame(id);
    }, [anim]);

    const handleEnd = () => {
      if (index === 0) {
        setAnim(false);
        setIndex(n);
      } else if (index === n + 1) {
        setAnim(false);
        setIndex(1);
      }
    };

    const onPointerDown = (e: React.PointerEvent) => {
      drag.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        dx: 0,
        width: containerRef.current?.offsetWidth ?? 1,
        decided: false,
        horizontal: false,
        moved: false,
      };
    };

    const onPointerMove = (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!d.decided) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        d.decided = true;
        d.horizontal = Math.abs(dx) > Math.abs(dy);
        if (d.horizontal) {
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
          setAnim(false);
        }
      }
      if (!d.horizontal) return;
      d.dx = dx;
      if (Math.abs(dx) > 4) d.moved = true;
      setDragPx(dx);
    };

    const onPointerUp = () => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      if (!d.horizontal) return;
      setDragPx(0);
      setAnim(true);
      const threshold = d.width * 0.18;
      if (d.dx <= -threshold) setIndex((i) => i + 1);
      else if (d.dx >= threshold) setIndex((i) => i - 1);
    };

    // Suppress the click that follows a drag so cards don't navigate on swipe.
    const onClickCapture = (e: React.MouseEvent) => {
      if (drag.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        drag.current.moved = false;
      }
    };

    const rendered = [slides[n - 1], ...slides, slides[0]];

    return (
      <div
        ref={containerRef}
        className={`overflow-hidden ${className}`}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        <div
          className="flex items-stretch will-change-transform"
          style={{
            width: `${total * 100}%`,
            transform: `translate3d(calc(${(-index * 100) / total}% + ${dragPx}px), 0, 0)`,
            transition: anim
              ? "transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1)"
              : "none",
            touchAction: "pan-y",
          }}
          onTransitionEnd={handleEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
        >
          {rendered.map((slide, i) => (
            <div
              key={i}
              style={{ width: `${100 / total}%` }}
              className="shrink-0 px-2"
              aria-hidden={i === 0 || i === n + 1 || undefined}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export default MobileCarousel;
