"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MobileCarousel from "@/src/components/MobileCarousel";
import { T } from "@/src/components/I18nProvider";

/**
 * Client logos, one per testimonial card (order is arbitrary). The assets are
 * inconsistent — two are black artwork on a baked-in white background, so every
 * logo sits on a white "brand chip" to read uniformly on the dark canvas.
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
 * `featured: true` renders the dark card.
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

// Home shows up to 4 testimonials.
const visible = testimonials.slice(0, 4);

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium tabular-nums text-background/60">
      {value.toFixed(1)}
    </span>
  );
}

/** White "brand chip" holding a client logo, sized to a fixed height. */
function LogoChip({ logo }: { logo: ClientLogo }) {
  return (
    <span className="inline-flex h-10 shrink-0 items-center">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.w}
        height={logo.h}
        className="h-7 w-auto max-w-[150px] object-contain"
      />
    </span>
  );
}

function Card({ t, logo }: { t: Testimonial; logo: ClientLogo }) {
  return (
    <figure className="flex h-full flex-col gap-5 rounded-[1.5rem] bg-foreground-strong p-6 text-background lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <LogoChip logo={logo} />
        <Rating value={t.rating} />
      </div>

      <blockquote className="flex-1 text-sm lg:text-base leading-relaxed text-background">
        “<T es={t.quote.es} en={t.quote.en} />”
      </blockquote>

      <figcaption>
        <p className="text-sm font-semibold tracking-tight text-background">
          {t.name}
        </p>
        <p className="text-xs text-background/60">
          <T es={t.role.es} en={t.role.en} /> · {t.company}
        </p>
      </figcaption>
    </figure>
  );
}

// Desktop masonry placement: featured tall-left, two white top-right, one wide
// white bottom-right — fills a 3×2 grid with no gaps for exactly 4 cards.
function placement(i: number): string {
  if (i === 0) return "lg:row-span-2";
  if (i === 3) return "lg:col-span-2";
  return "";
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

      {/* Mobile / tablet: infinite touch carousel */}
      <div className="mt-10 lg:hidden">
        <MobileCarousel
          ariaLabel="Recent clients"
          className="-mx-2"
          slides={visible.map((t, i) => (
            <Card key={t.name} t={t} logo={CLIENT_LOGOS[i % CLIENT_LOGOS.length]} />
          ))}
        />
      </div>

      {/* Desktop: static masonry grid */}
      <div className="mt-14 hidden lg:grid grid-cols-3 auto-rows-fr gap-6">
        {visible.map((t, i) => (
          <div key={t.name} className={placement(i)}>
            <Card t={t} logo={CLIENT_LOGOS[i % CLIENT_LOGOS.length]} />
          </div>
        ))}
      </div>
    </section>
  );
}
