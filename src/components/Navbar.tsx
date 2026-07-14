"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
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

// The mobile drawer shows an explicit Home entry first; on desktop the logo
// already serves as the home link, so Home is omitted there.
const mobileLinks: readonly NavLink[] = [
  { href: "/", es: "Inicio", en: "Home", match: "/" },
  ...navLinks,
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
        src="/icons/logo.png"
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

const linkCls =
  "text-foreground tracking-[0.01em] hover:text-foreground-strong transition-colors duration-150";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Mobile "Proyectos" sub-drawer (deploys Proyectos + Labs on tap).
  const [subOpen, setSubOpen] = useState(false);

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

  // Collapse the Proyectos sub-drawer whenever the mobile menu closes.
  useEffect(() => {
    if (!open) setSubOpen(false);
  }, [open]);

  return (
    <header className="w-full bg-background border-b border-line">
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
            className="inline-flex items-center rounded-full bg-foreground/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors duration-150 hover:bg-foreground/[0.14]"
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
                          className={`${linkCls} ${isActive(link.match) ? "text-foreground-strong" : ""}`}
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
        className={`lg:hidden fixed inset-0 z-50 flex flex-col bg-background text-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-end px-6 h-16 shrink-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center rounded-full bg-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors duration-150 hover:bg-foreground/20"
          >
            <T es="Cerrar" en="Close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 flex flex-col justify-end">
          <nav aria-label={ariaPrincipal}>
            <ul className="flex flex-col">
              {mobileLinks.map((link, i) => {
                const itemCls = `block py-1 text-5xl sm:text-6xl font-bold uppercase tracking-tight leading-[1.05] text-foreground transition-all duration-500 hover:text-foreground-strong ${
                  open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`;
                const delay = {
                  transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
                };

                // "Proyectos" is a toggle: tapping it deploys the sub-drawer
                // (the Proyectos index + Labs), mirroring the desktop dropdown.
                if (link.children?.length) {
                  const subItems = [
                    { href: link.href, es: link.es, en: link.en },
                    ...link.children,
                  ];
                  return (
                    <li key={link.href}>
                      <button
                        type="button"
                        onClick={() => setSubOpen((v) => !v)}
                        aria-expanded={subOpen}
                        aria-controls="mobile-proyectos-sub"
                        style={delay}
                        className={`flex w-full items-center justify-between gap-3 text-left ${itemCls}`}
                      >
                        <T es={link.es} en={link.en} />
                        <ChevronDown
                          size={30}
                          strokeWidth={2.5}
                          aria-hidden="true"
                          className={`shrink-0 transition-transform duration-300 ${
                            subOpen ? "rotate-180 text-foreground-strong" : "text-muted"
                          }`}
                        />
                      </button>

                      <div
                        id="mobile-proyectos-sub"
                        className={`grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          subOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <ul className="min-h-0 overflow-hidden flex flex-col gap-0.5 pl-1 pt-1 pb-2">
                          {subItems.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="block py-1.5 text-2xl sm:text-3xl font-medium uppercase tracking-tight leading-tight text-muted-strong transition-colors duration-200 hover:text-foreground-strong"
                              >
                                <T es={child.es} en={child.en} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      style={delay}
                      className={itemCls}
                    >
                      <T es={link.es} en={link.en} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors duration-150 hover:text-foreground-strong"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-6">
              <CvMobileList onNavigate={() => setOpen(false)} dark />
              <LangToggle className="text-muted self-end shrink-0" dark />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
