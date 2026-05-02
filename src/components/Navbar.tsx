"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Sobre mí", href: "/about" },
  { label: "Contacto", href: "/contact" },
] as const;

const externalLinks = [
  { label: "X (twitter)", href: "https://x.com/JonsymZ" },
  { label: "Instagram",   href: "https://www.instagram.com/jony.zasa/" },
] as const;

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="JonZS — Inicio"
      className={`inline-flex items-center select-none hover:opacity-70 transition-opacity duration-150 ${className}`}
    >
      <Image
        src="/icons/newicon.png"
        alt=""
        width={1329}
        height={1183}
        priority
        sizes="(min-width: 1280px) 80px, (min-width: 1024px) 64px, 44px"
        className="h-full w-auto"
      />
    </Link>
  );
}

const linkCls =
  "text-black hover:text-[#0000FF] transition-colors duration-150";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

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
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="flex h-16 lg:hidden items-center justify-between gap-6">
          <Logo className="h-11" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-black hover:opacity-60 transition-opacity duration-150"
          >
            {open ? (
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-start gap-12 py-8">
          <Logo className="h-16 xl:h-20 shrink-0" />

          <div className="flex items-start gap-14 xl:gap-24 ml-auto pt-2 xl:pt-4">
            <nav aria-label="Principal">
              <ul className="flex flex-col gap-1.5 text-base">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={linkCls}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="flex flex-col gap-1.5 text-base">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={linkCls}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-black/10 bg-white"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-8">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-lg text-black hover:text-[#0000FF] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-3 text-base pt-4 border-t border-black/10">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-black hover:text-[#0000FF] transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
