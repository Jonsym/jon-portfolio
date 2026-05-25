"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { T } from "./I18nProvider";

export const CV_ES = "/cv/Jonathan-Zamudio-CV-ES.pdf";
export const CV_EN = "/cv/Jonathan-Zamudio-CV-EN.pdf";

const items = [
  {
    href: CV_ES,
    es: "Español",
    en: "Spanish",
  },
  {
    href: CV_EN,
    es: "Inglés",
    en: "English",
  },
] as const;

const linkBaseCls =
  "text-black hover:text-[#0000FF] transition-colors duration-150";

/** Hover/focus-triggered dropdown for the desktop navbar. */
export default function CvMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

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
        className={`${linkBaseCls} inline-flex items-center gap-1`}
      >
        <T es="Currículum" en="CV" />
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        role="menu"
        aria-label="Curriculum"
        className={`absolute left-0 top-full mt-3 min-w-[180px] border border-black/10 bg-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.12)] transition duration-150 ${
          open
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-1"
        }`}
      >
        <ul className="flex flex-col py-2">
          {items.map((item) => (
            <li key={item.href} role="none">
              <a
                role="menuitem"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-black hover:bg-black/[0.04] hover:text-[#0000FF] transition-colors duration-150"
                onClick={() => setOpen(false)}
              >
                <T es={item.es} en={item.en} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Flat list rendered inside the mobile menu (no dropdown — hover doesn't work on touch). */
export function CvMobileList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-3 text-base pt-4 border-t border-black/10">
      <h3 className="text-xs uppercase tracking-widest text-zinc-500">
        <T es="Currículum" en="CV" />
      </h3>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
              className="block py-3 text-lg text-black hover:text-[#0000FF] transition-colors duration-150"
            >
              <T es={item.es} en={item.en} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
