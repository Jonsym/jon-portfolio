import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Structure-agnostic carousel engine shared by every MobileCarousel instance
 * (mobile hero + testimonials). It only moves an index and reports drag/animation
 * state — it never inspects slide content, so redesigning what's *in* a slide can
 * never break it.
 *
 * Owns: infinite clone-loop index math, pointer/touch drag, autoplay, and every
 * pause source (hover, focus-within, off-screen, reduced-motion, recent
 * interaction). One `shouldAutoplay` boolean is the single source of truth.
 * All timers/observers/listeners are torn down on unmount.
 *
 * With `count <= 1` the engine is inert (`enabled === false`): no autoplay, no
 * clones, no drag, no keys — the consumer renders the lone slide statically.
 */
interface UseCarouselOptions {
  count: number;
  autoplayMs?: number;
  resumeMs?: number;
}

export function useCarousel({
  count,
  autoplayMs = 3000,
  resumeMs = 5000,
}: UseCarouselOptions) {
  const enabled = count > 1;
  const n = count;
  const total = n + 2; // two clones: last prepended, first appended

  const [index, setIndex] = useState(1); // 1 = first real slide
  const [anim, setAnim] = useState(true);
  const [dragPx, setDragPx] = useState(0);

  // Pause sources.
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [visible, setVisible] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const interactTimer = useRef<number | null>(null);
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

  // Any manual interaction pauses autoplay, which resumes `resumeMs` after the
  // last one.
  const markInteract = useCallback(() => {
    setInteracting(true);
    if (interactTimer.current !== null) window.clearTimeout(interactTimer.current);
    interactTimer.current = window.setTimeout(
      () => setInteracting(false),
      resumeMs,
    );
  }, [resumeMs]);

  const go = useCallback(
    (dir: number) => {
      if (!enabled) return;
      setAnim(true);
      setIndex((i) => i + dir);
    },
    [enabled],
  );
  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  const goTo = useCallback(
    (real: number) => {
      if (!enabled) return;
      setAnim(true);
      setIndex(real + 1);
      markInteract();
    },
    [enabled, markInteract],
  );

  // Re-enable the transition on the frame after a clone snap.
  useEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnim(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [anim]);

  // Seamless loop: when a clone scrolls in, jump (transition-less) to its twin.
  const handleEnd = useCallback(() => {
    if (index === 0) {
      setAnim(false);
      setIndex(n);
    } else if (index === n + 1) {
      setAnim(false);
      setIndex(1);
    }
  }, [index, n]);

  // --- pointer / touch drag ---
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
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
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
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
          markInteract(); // dragging pauses autoplay
        }
      }
      if (!d.horizontal) return;
      d.dx = dx;
      if (Math.abs(dx) > 4) d.moved = true;
      setDragPx(dx);
    },
    [markInteract],
  );

  const onPointerUp = useCallback(() => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.horizontal) return;
    setDragPx(0);
    setAnim(true);
    markInteract();
    const threshold = d.width * 0.18;
    if (d.dx <= -threshold) setIndex((i) => i + 1);
    else if (d.dx >= threshold) setIndex((i) => i - 1);
  }, [markInteract]);

  // Suppress the click that follows a drag so cards don't navigate on swipe.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }, []);

  // --- keyboard (arrows replace the removed mobile buttons) ---
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        markInteract();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        markInteract();
      }
    },
    [enabled, next, prev, markInteract],
  );

  // --- hover (mouse only) & focus-within pauses ---
  const onPointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setHovered(true);
  }, []);
  const onPointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setHovered(false);
  }, []);
  const onFocus = useCallback(() => setFocusWithin(true), []);
  const onBlur = useCallback((e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setFocusWithin(false);
    }
  }, []);

  // --- prefers-reduced-motion ---
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // --- off-screen pause ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  // --- autoplay: single source of truth ---
  const shouldAutoplay =
    enabled &&
    !reducedMotion &&
    visible &&
    !hovered &&
    !focusWithin &&
    !interacting;

  useEffect(() => {
    if (!shouldAutoplay) return;
    const id = window.setInterval(() => {
      setAnim(true);
      setIndex((i) => i + 1);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [shouldAutoplay, autoplayMs]);

  // Clean up the resume timer on unmount.
  useEffect(
    () => () => {
      if (interactTimer.current !== null) window.clearTimeout(interactTimer.current);
    },
    [],
  );

  const activeIndex = enabled ? (index - 1 + n) % n : 0;

  return {
    enabled,
    total,
    index,
    anim,
    dragPx,
    reducedMotion,
    activeIndex,
    containerRef,
    next,
    prev,
    goTo,
    handleEnd,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onClickCapture,
    onKeyDown,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
  };
}
