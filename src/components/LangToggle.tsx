"use client";

import { useI18nReady, useLocale, useSetLocale } from "./I18nProvider";

interface LangToggleProps {
  className?: string;
  dark?: boolean;
}

export default function LangToggle({ className = "", dark = false }: LangToggleProps) {
  const locale = useLocale();
  const ready = useI18nReady();
  const setLocale = useSetLocale();
  const active = ready ? locale : "es";

  const activeCls = dark ? "text-white" : "text-black";
  const inactiveCls = dark
    ? "text-white/40 hover:text-white"
    : "text-zinc-400 hover:text-black";

  const btn = (target: "es" | "en", label: string, aria: string) => (
    <button
      type="button"
      onClick={() => setLocale(target)}
      aria-label={aria}
      aria-pressed={active === target}
      className={`tabular-nums transition-colors duration-150 ${
        active === target ? activeCls : inactiveCls
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-widest ${className}`}
    >
      {btn("es", "ES", "Español")}
      <span aria-hidden="true" className={dark ? "text-white/20" : "text-black/20"}>
        /
      </span>
      {btn("en", "EN", "English")}
    </div>
  );
}
