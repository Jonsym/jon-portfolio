"use client";

import Link from "next/link";

const sitemap = [
  { label: "Proyectos", href: "/" },
  { label: "Sobre mí", href: "/about" },
  { label: "Contacto", href: "/contact" },
] as const;

const social = [
  { label: "LinkedIn",  href: "https://linkedin.com/in/jonzamudio" },
  { label: "GitHub",    href: "https://github.com/jonzamudio" },
  { label: "Instagram", href: "https://instagram.com/jonzasa" },
] as const;

const EMAIL = "jon@jonzamudio.com";
const WHATSAPP = `https://wa.me/529211735484?text=${encodeURIComponent("Hola JonZS")}`;

const linkCls =
  "text-black/80 hover:text-[#0000FF] transition-colors duration-150";

const headerCls =
  "text-base font-bold uppercase tracking-widest text-black";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-black bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-0">
          <div className="lg:col-span-4 lg:pr-8">
            <Link
              href="/"
              aria-label="JonZS — Inicio"
              className="inline-flex items-baseline font-bold tracking-[-0.04em] leading-none text-black select-none hover:opacity-70 transition-opacity duration-150 text-4xl lg:text-5xl"
            >
              <span>JonZS</span>
              <span className="text-[0.32em] font-medium ml-[0.05em] -translate-y-[0.18em]">
                ®
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-black/60">
              Full-stack Developer &amp; Designer.
            </p>
          </div>

          <nav
            aria-label="Sitemap"
            className="lg:col-span-3 lg:pl-8 lg:border-l lg:border-black/10"
          >
            <h2 className={headerCls}>Sitemap</h2>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {sitemap.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkCls}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2 lg:pl-8 lg:border-l lg:border-black/10">
            <h2 className={headerCls}>Social</h2>
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

          <div className="lg:col-span-3 lg:pl-8 lg:border-l lg:border-black/10">
            <h2 className={headerCls}>Contacto</h2>
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
                  <span>Chat on WhatsApp</span>
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 lg:mt-20 pt-6 border-t border-black/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-[11px] uppercase tracking-widest text-black/60">
          <span>© {year} JonZS® — Todos los derechos reservados.</span>
          <span>Hecho en México</span>
        </div>
      </div>
    </footer>
  );
}
