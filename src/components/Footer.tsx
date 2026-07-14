"use client";

import Image from "next/image";
import Link from "next/link";
import { T, useTPair } from "./I18nProvider";

const sitemap = [
  { href: "/", es: "Proyectos", en: "Projects" },
  { href: "/about", es: "Sobre mí", en: "About" },
  { href: "/contact", es: "Contacto", en: "Contact" },
] as const;

const social = [
  { label: "LinkedIn", href: "https://linkedin.com/in/jonzamudio" },
  { label: "GitHub", href: "https://github.com/Jonsym" },
  { label: "X", href: "https://x.com/JonsymZ" },
  { label: "Instagram", href: "https://www.instagram.com/jony.zasa/" },
] as const;

const EMAIL = "jon@jonzamudio.com";
const WHATSAPP = `https://wa.me/529211735484?text=${encodeURIComponent(
  "Hola JonZS",
)}`;

const linkCls =
  "text-muted-strong hover:text-foreground-strong transition-colors duration-150";

const headerCls = "text-base font-semibold uppercase tracking-widest text-foreground";

const dividerCls = "lg:border-l lg:border-line";

export default function Footer() {
  const year = new Date().getFullYear();
  const ariaHome = useTPair("JonZS — Inicio", "JonZS — Home");
  const ariaSitemap = useTPair("Sitemap", "Sitemap");

  return (
    <footer className="w-full border-t border-line-strong bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-0">
          <div className="lg:col-span-4 lg:pr-8">
            <Link
              href="/"
              aria-label={ariaHome}
              className="inline-flex items-center leading-none select-none hover:opacity-70 transition-opacity duration-150"
            >
              <Image
                src="/icons/logo.png"
                alt=""
                width={1329}
                height={1183}
                sizes="(min-width: 1024px) 80px, 64px"
                className="h-16 lg:h-20 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              Full-stack Developer &amp; Designer.
            </p>
          </div>

          <nav
            aria-label={ariaSitemap}
            className={`lg:col-span-3 lg:pl-8 ${dividerCls}`}
          >
            <h2 className={headerCls}>
              <T es="Sitemap" en="Sitemap" />
            </h2>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {sitemap.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkCls}>
                    <T es={item.es} en={item.en} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`lg:col-span-2 lg:pl-8 ${dividerCls}`}>
            <h2 className={headerCls}>
              <T es="Social" en="Social" />
            </h2>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={linkCls}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`lg:col-span-3 lg:pl-8 ${dividerCls}`}>
            <h2 className={headerCls}>
              <T es="Contacto" en="Contact" />
            </h2>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              <li>
                <a href={`mailto:${EMAIL}`} className={linkCls}>
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`${linkCls} inline-flex items-center gap-2`}
                >
                  <span>
                    <T es="Chatear por WhatsApp" en="Chat on WhatsApp" />
                  </span>
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 lg:mt-20 pt-6 border-t border-line flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-[11px] uppercase tracking-widest text-muted">
          <span>
            <T
              es={`© ${year} JonZS® — Todos los derechos reservados.`}
              en={`© ${year} JonZS® — All rights reserved.`}
            />
          </span>
          <span>
            <T es="Hecho en México" en="Made in Mexico" />
          </span>
        </div>
      </div>
    </footer>
  );
}
