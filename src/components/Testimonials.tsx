"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import MobileCarousel, {
  type CarouselHandle,
} from "@/src/components/MobileCarousel";
import { T, useTPair } from "@/src/components/I18nProvider";

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

function Rating({ value, dark }: { value: number; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium tabular-nums ${
        dark ? "text-white/70" : "text-zinc-500"
      }`}
    >
      <Star size={13} aria-hidden="true" className="fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </span>
  );
}

function Avatar({ initials, dark }: { initials: string; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold tracking-tight ${
        dark ? "bg-white/10 text-white" : "bg-black/[0.06] text-black"
      }`}
    >
      {initials}
    </span>
  );
}

function Card({ t }: { t: Testimonial }) {
  const dark = t.featured;
  return (
    <figure
      className={`flex h-full flex-col gap-5 rounded-[1.5rem] p-6 lg:p-7 ${
        dark
          ? "bg-[#0c0c0c] text-white"
          : "border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_36px_-20px_rgba(0,0,0,0.16)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <Avatar initials={t.initials} dark={dark} />
        <Rating value={t.rating} dark={dark} />
      </div>

      <blockquote
        className={`flex-1 text-sm lg:text-base leading-relaxed ${
          dark ? "text-white/85" : "text-zinc-700"
        }`}
      >
        “<T es={t.quote.es} en={t.quote.en} />”
      </blockquote>

      <figcaption>
        <p
          className={`text-sm font-semibold tracking-tight ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {t.name}
        </p>
        <p className={`text-xs ${dark ? "text-white/50" : "text-zinc-500"}`}>
          <T es={t.role.es} en={t.role.en} /> · {t.company}
        </p>
      </figcaption>
    </figure>
  );
}

function Ctrl({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-150 hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2"
    >
      {children}
    </button>
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
  const carouselRef = useRef<CarouselHandle>(null);
  const prevLabel = useTPair("Anterior", "Previous");
  const nextLabel = useTPair("Siguiente", "Next");

  return (
    <section aria-label="Recent clients" className="mt-24 lg:mt-40">
      {/* Heading + CTA + (mobile) controls */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight lowercase">
          <span className="text-zinc-300">
            <T es="/clientes " en="/recent " />
          </span>
          <span className="text-black">
            <T es="recientes" en="clients" />
          </span>
        </h2>

        <div className="flex w-full lg:w-auto items-center justify-between lg:justify-end gap-5">
          <Link
            href="/proyectos"
            className="group inline-flex items-center gap-2 text-sm font-medium text-black transition-colors duration-150 hover:text-[#0000FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          >
            <T es="Ver proyectos" en="View Projects" />
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>

          {/* Controls — mobile / tablet only */}
          <div className="flex gap-2 lg:hidden">
            <Ctrl onClick={() => carouselRef.current?.prev()} label={prevLabel}>
              <ChevronLeft size={17} strokeWidth={1.75} aria-hidden="true" />
            </Ctrl>
            <Ctrl onClick={() => carouselRef.current?.next()} label={nextLabel}>
              <ChevronRight size={17} strokeWidth={1.75} aria-hidden="true" />
            </Ctrl>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: infinite touch carousel */}
      <div className="mt-10 lg:hidden">
        <MobileCarousel
          ref={carouselRef}
          ariaLabel="Recent clients"
          className="-mx-2"
          slides={visible.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        />
      </div>

      {/* Desktop: static masonry grid */}
      <div className="mt-14 hidden lg:grid grid-cols-3 auto-rows-fr gap-6">
        {visible.map((t, i) => (
          <div key={t.name} className={placement(i)}>
            <Card t={t} />
          </div>
        ))}
      </div>
    </section>
  );
}
