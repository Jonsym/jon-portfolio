"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MobileCarousel from "@/src/components/MobileCarousel";
import { T } from "@/src/components/I18nProvider";

/**
 * Client logos, one per testimonial (order is arbitrary). The assets are
 * inconsistent — two are artwork on a baked-in white background, two are
 * transparent and full-colour — so they all get the same treatment:
 * grayscale + invert, composited with `mix-blend-screen`. Screen drops the
 * inverted white background to nothing against a dark surface, so every logo
 * lands as a monochrome mark with no chip around it. See `LogoMark`.
 */
type ClientLogo = { src: string; alt: string; w: number; h: number };
const CLIENT_LOGOS: ClientLogo[] = [
  { src: "/logos/hellomatchlogo.png", alt: "Hello Matcha", w: 654, h: 305 },
  { src: "/logos/premmologo.png", alt: "Preemmo", w: 1524, h: 798 },
  { src: "/logos/howtologo.png", alt: "HowToSpanish", w: 290, h: 207 },
  { src: "/logos/zaplinlogo.png", alt: "Zaplin", w: 600, h: 142 },
];

/* ----------------------------------------------------------------------------
 * Placeholder testimonials — edit these freely. The home page shows 4;
 * `featured: true` is the one pulled out as the large lead quote.
 * ------------------------------------------------------------------------- */

type Testimonial = {
  name: string;
  /** Avatar placeholder initials. */
  initials: string;
  role: { es: string; en: string };
  company: string;
  rating: number;
  quote: { es: string; en: string };
  featured?: boolean;
};

const testimonials: Testimonial[] = [
  {
    name: "David Kim",
    initials: "DK",
    role: { es: "Director de Producto", en: "Head of Product" },
    company: "Blueloft",
    rating: 5.0,
    featured: true,
    quote: {
      es: "Superó todas nuestras expectativas. Entendió el negocio, no solo el diseño — el sitio es rápido, claro y convierte.",
      en: "It exceeded all our expectations. He understood the business, not just the design — the site is fast, clear, and it converts.",
    },
  },
  {
    name: "Michael Grant",
    initials: "MG",
    role: { es: "Fundador", en: "Founder" },
    company: "Northbound",
    rating: 4.9,
    quote: {
      es: "Entregó más rápido y mejor de lo que imaginábamos. Un sistema sólido del que estamos orgullosos.",
      en: "Delivered faster and better than we imagined. A solid system we're genuinely proud of.",
    },
  },
  {
    name: "Emma Rodriguez",
    initials: "ER",
    role: { es: "Marketing", en: "Marketing Lead" },
    company: "SocialLift",
    rating: 5.0,
    quote: {
      es: "Fácil de usar, atractivo y pensado para crecer. Cada detalle se siente intencional.",
      en: "User-friendly, engaging, and built for growth. Every detail feels intentional.",
    },
  },
  {
    name: "Sofia Martinez",
    initials: "SM",
    role: { es: "Diseñadora", en: "Creative Director" },
    company: "Atelier Nine",
    rating: 4.8,
    quote: {
      es: "Convirtió una idea difusa en una marca clara. La ejecución fue limpia y muy profesional.",
      en: "Turned a fuzzy idea into a clear brand. The execution was clean and deeply professional.",
    },
  },
];

// Home shows up to 4 testimonials: one pulled out as the lead quote, the rest
// in a row underneath. Pairing is by index, so a logo travels with its card.
const visible = testimonials.slice(0, 4).map((t, i) => ({
  t,
  logo: CLIENT_LOGOS[i % CLIENT_LOGOS.length],
}));
const leadIndex = Math.max(
  0,
  visible.findIndex(({ t }) => t.featured),
);
const lead = visible[leadIndex];
const rest = visible.filter((_, i) => i !== leadIndex);

function Rating({ value }: { value: number }) {
  return (
    <span className="text-xs font-medium tabular-nums text-muted">
      {value.toFixed(1)}
    </span>
  );
}

/**
 * A client logo reduced to a monochrome mark. `mix-blend-screen` is what makes
 * the chip unnecessary — see the note on CLIENT_LOGOS.
 */
function LogoMark({ logo, className = "h-7" }: { logo: ClientLogo; className?: string }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.w}
      height={logo.h}
      className={`${className} w-auto max-w-[150px] shrink-0 object-contain grayscale invert mix-blend-screen`}
    />
  );
}

/** The pulled-out lead quote: no panel, set large straight on the canvas. */
function LeadQuote({ t, logo }: { t: Testimonial; logo: ClientLogo }) {
  return (
    <figure className="border-t border-line pt-10 lg:pt-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <blockquote className="lg:col-span-8 text-2xl sm:text-3xl lg:text-[2.5rem] font-medium leading-[1.2] tracking-tight text-foreground-strong text-balance">
          “<T es={t.quote.es} en={t.quote.en} />”
        </blockquote>

        <figcaption className="lg:col-span-4 flex flex-col justify-end gap-5">
          <div className="flex items-center justify-between gap-4">
            <LogoMark logo={logo} className="h-9" />
            <Rating value={t.rating} />
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {t.name}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              <T es={t.role.es} en={t.role.en} /> · {t.company}
            </p>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}

/** Supporting testimonial: a raised surface panel, uniform height. */
function Card({ t, logo }: { t: Testimonial; logo: ClientLogo }) {
  return (
    <figure className="flex h-full flex-col gap-5 rounded-[1.5rem] border border-line bg-surface p-6 transition-colors duration-200 hover:border-line-strong lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <LogoMark logo={logo} />
        <Rating value={t.rating} />
      </div>

      <blockquote className="flex-1 text-sm lg:text-base leading-relaxed text-muted-strong">
        “<T es={t.quote.es} en={t.quote.en} />”
      </blockquote>

      <figcaption className="border-t border-line pt-4">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {t.name}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          <T es={t.role.es} en={t.role.en} /> · {t.company}
        </p>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section aria-label="Recent clients" className="mt-24 lg:mt-40">
      {/* Heading + CTA + (mobile) controls */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="max-w-xl">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight lowercase">
            <span className="text-muted">
              <T es="clientes " en="recent " />
            </span>
            <span className="text-foreground">
              <T es="recientes" en="clients" />
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base lg:text-lg leading-relaxed text-muted">
            <T
              es="Proyectos reales, entregados más rápido y más limpios de lo esperado — sitios que se ven impecables y de verdad rinden. Esto dicen mis clientes recientes."
              en="Real projects, delivered faster and cleaner than expected — sites that look sharp and actually perform. Here's what recent clients had to say."
            />
          </p>
        </div>

        <div className="flex w-full lg:w-auto items-center justify-end gap-5">
          <Link
            href="/proyectos"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-150 hover:text-foreground-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <T es="Ver proyectos recientes" en="View recent projects" />
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Lead quote, at every breakpoint */}
      <div className="mt-14 lg:mt-20">
        <LeadQuote t={lead.t} logo={lead.logo} />
      </div>

      {/* Mobile / tablet: infinite touch carousel */}
      <div className="mt-10 lg:hidden">
        <MobileCarousel
          ariaLabel="Recent clients"
          className="-mx-2"
          slides={rest.map(({ t, logo }) => (
            <Card key={t.name} t={t} logo={logo} />
          ))}
        />
      </div>

      {/* Desktop: the remaining quotes in one even row */}
      <div className="mt-10 hidden auto-rows-fr grid-cols-3 gap-6 lg:grid lg:mt-12">
        {rest.map(({ t, logo }) => (
          <Card key={t.name} t={t} logo={logo} />
        ))}
      </div>
    </section>
  );
}
