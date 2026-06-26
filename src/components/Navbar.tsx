"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { T, useTPair } from "./I18nProvider";
import LangToggle from "./LangToggle";
import CvMenu, { CvMobileList } from "./CvMenu";
import ProyectosMenu from "./ProyectosMenu";

type NavChild = {
  href: string;
  es: string;
  en: string;
  match: string;
};

type NavLink = NavChild & { children?: readonly NavChild[] };

const navLinks: readonly NavLink[] = [
  { href: "/about", es: "Sobre mí", en: "About", match: "/about" },
  {
    href: "/proyectos",
    es: "Proyectos",
    en: "Projects",
    match: "/proyectos",
    // Labs lives as a sub-section of Proyectos (see ProyectosMenu).
    children: [{ href: "/labs", es: "Labs", en: "Labs", match: "/labs" }],
  },
  { href: "/contact", es: "Contacto", en: "Contact", match: "/contact" },
];

const externalLinks = [
  { label: "GitHub", href: "https://github.com/Jonsym" },
  { label: "X (twitter)", href: "https://x.com/JonsymZ" },
  { label: "Instagram", href: "https://www.instagram.com/jony.zasa/" },
] as const;

function Logo({
  className = "",
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  const ariaHome = useTPair("JonZS — Inicio", "JonZS — Home");
  return (
    <Link
      href="/"
      aria-label={ariaHome}
      className={`inline-flex items-center select-none hover:opacity-70 transition-opacity duration-150 ${className}`}
    >
      <Image
        src="/icons/newicon.png"
        alt=""
        width={1329}
        height={1183}
        priority
        sizes="(min-width: 1024px) 48px, 44px"
        className={`h-full w-auto ${invert ? "invert" : ""}`}
      />
    </Link>
  );
}

const linkCls = "text-black hover:text-[#0000FF] transition-colors duration-150";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (match: string) =>
    match === "/"
      ? pathname === "/"
      : pathname === match || pathname.startsWith(match + "/");

  const ariaPrincipal = useTPair("Principal", "Primary");
  const ariaOpen = useTPair("Abrir menú", "Open menu");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header className="w-full bg-white border-b border-black/10">
      <div className="w-full px-6 lg:px-12">
        {/* Mobile bar */}
        <div className="flex h-16 lg:hidden items-center justify-between gap-6">
          <Logo className="h-11" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={ariaOpen}
            className="inline-flex items-center rounded-full bg-black/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors duration-150 hover:bg-black/[0.1]"
          >
            <T es="Menú" en="Menu" />
          </button>
        </div>

        {/* Desktop bar — logo left, links + lang right */}
        <div className="hidden lg:flex h-20 items-center justify-between gap-8">
          <Logo className="h-12 shrink-0" />

          <div className="flex items-center gap-8 xl:gap-10">
            <nav aria-label={ariaPrincipal}>
              <ul className="flex items-center gap-8 xl:gap-10 text-base">
                {navLinks.map((link) => (
                  <Fragment key={link.href}>
                    <li>
                      {link.children?.length ? (
                        <ProyectosMenu />
                      ) : (
                        <Link
                          href={link.href}
                          aria-current={isActive(link.match) ? "page" : undefined}
                          className={`${linkCls} ${isActive(link.match) ? "text-[#0000FF]" : ""}`}
                        >
                          <T es={link.es} en={link.en} />
                        </Link>
                      )}
                    </li>
                    {/* Curriculum dropdown sits right after Proyectos */}
                    {link.match === "/proyectos" && (
                      <li>
                        <CvMenu />
                      </li>
                    )}
                  </Fragment>
                ))}
              </ul>
            </nav>

            <LangToggle className="shrink-0" />
          </div>
        </div>
      </div>

      {/* Mobile full-screen overlay — slides in from the right */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`lg:hidden fixed inset-0 z-50 flex flex-col bg-[#141414] text-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 shrink-0">
          <Logo className="h-11 opacity-40" invert />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-150 hover:bg-white/20"
          >
            <T es="Cerrar" en="Close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 flex flex-col justify-end">
          <nav aria-label={ariaPrincipal}>
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                    className={`block py-1 text-5xl sm:text-6xl font-extrabold uppercase tracking-tight leading-[1.05] text-white transition-all duration-500 hover:text-[#7c7cff] ${
                      open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                  >
                    <T es={link.es} en={link.en} />
                  </Link>

                  {link.children?.length ? (
                    <ul className="mt-1 mb-2 flex flex-col gap-0.5 pl-1">
                      {link.children.map((child, ci) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            style={{
                              transitionDelay: open
                                ? `${120 + (i + ci + 1) * 60}ms`
                                : "0ms",
                            }}
                            className={`block py-1.5 text-2xl sm:text-3xl font-semibold uppercase tracking-tight leading-tight text-white/70 transition-all duration-500 hover:text-[#7c7cff] ${
                              open
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-4"
                            }`}
                          >
                            <T es={child.es} en={child.en} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-6">
              <CvMobileList onNavigate={() => setOpen(false)} dark />
              <LangToggle className="text-white/70 self-end shrink-0" dark />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
