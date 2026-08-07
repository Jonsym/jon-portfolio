"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { T } from "./I18nProvider";

/** Sub-sections grouped under "Proyectos". */
export const proyectosItems = [
  { href: "/proyectos", es: "Proyectos", en: "Projects", match: "/proyectos" },
  { href: "/labs", es: "Labs", en: "Labs", match: "/labs" },
] as const;

const linkBaseCls =
  "text-foreground hover:text-foreground-strong transition-colors duration-150 uppercase tracking-[0.14em]";

/** Hover/focus-triggered dropdown for the desktop navbar — Proyectos + Labs. */
export default function ProyectosMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const isActive = (match: string) =>
    pathname === match || pathname.startsWith(match + "/");
  const groupActive = proyectosItems.some((it) => isActive(it.match));

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        cancelClose();
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${linkBaseCls} inline-flex items-center gap-1 ${
          groupActive ? "text-foreground-strong" : ""
        }`}
      >
        <T es="Proyectos" en="Projects" />
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* The gap between trigger and panel is padding on the positioned
          wrapper, not a margin, so crossing it stays inside the hover target
          and doesn't dismiss the menu. */}
      <div
        className={`absolute left-0 top-full z-50 pt-3 transition duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {/* Minimal: no caret, no icons, no hover fills. Structure comes from
            the hairline between rows — the same divider the rest of the site
            uses — and the only hover cue is the label brightening and easing
            right. */}
        <ul
          role="menu"
          aria-label="Proyectos"
          className="min-w-[170px] divide-y divide-line border border-line bg-background/95 backdrop-blur-md"
        >
          {proyectosItems.map((item) => {
            const current = isActive(item.match);
            return (
              <li key={item.href} role="none">
                <Link
                  role="menuitem"
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block px-5 py-3.5 text-xs tracking-[0.14em] transition-all duration-200 hover:translate-x-0.5 hover:text-foreground-strong focus:outline-none focus-visible:translate-x-0.5 focus-visible:text-foreground-strong ${
                    current ? "text-foreground-strong" : "text-muted"
                  }`}
                >
                  <T es={item.es} en={item.en} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
