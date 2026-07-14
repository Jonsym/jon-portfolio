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
  "text-foreground hover:text-foreground-strong transition-colors duration-150";

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

      <div
        role="menu"
        aria-label="Proyectos"
        className={`absolute left-0 top-full mt-3 min-w-[180px] border border-line bg-surface transition duration-150 ${
          open
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-1"
        }`}
      >
        <ul className="flex flex-col py-2">
          {proyectosItems.map((item) => (
            <li key={item.href} role="none">
              <Link
                role="menuitem"
                href={item.href}
                aria-current={isActive(item.match) ? "page" : undefined}
                className={`block px-4 py-2 text-sm transition-colors duration-150 hover:bg-foreground/[0.06] hover:text-foreground-strong ${
                  isActive(item.match) ? "text-foreground-strong" : "text-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                <T es={item.es} en={item.en} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
