import Link from "next/link";
import {
  Baby,
  Buildings,
  GraduationCap,
  HardHat,
  Leaf,
  PawPrint,
  Tooth,
  Translate,
  Tree,
} from "@phosphor-icons/react/ssr";
import FeaturedProjects from "@/src/components/FeaturedProjects";
import HowIWork from "@/src/components/HowIWork";
import Testimonials from "@/src/components/Testimonials";
import FinalCta from "@/src/components/FinalCta";
import Navbar from "@/src/components/Navbar";
import { T } from "@/src/components/I18nProvider";

/* ----------------------------- Social proof ----------------------------- */

const clients = [
  { name: "Novax", Icon: HardHat },
  { name: "Lumina", Icon: Tooth },
  { name: "Luxora", Icon: Buildings },
  { name: "The Woods", Icon: Tree },
  { name: "ALES", Icon: GraduationCap },
  { name: "HowtoSpanish", Icon: Translate },
  { name: "MaterCare", Icon: Baby },
  { name: "HelloMatcha", Icon: Leaf },
  { name: "Petzu", Icon: PawPrint },
] as const;

function ClientRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {clients.map(({ name, Icon }) => (
        <li
          key={name}
          className="flex shrink-0 items-center gap-2 px-5 text-zinc-400"
        >
          <Icon size={18} weight="light" aria-hidden="true" />
          <span className="whitespace-nowrap text-sm font-medium tracking-tight">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Subtle, continuous horizontal marquee of client/project names. Pure CSS
 *  (no JS), pauses on hover, and respects prefers-reduced-motion. */
function SocialProof() {
  return (
    <div className="marquee group relative w-full overflow-hidden">
      <div className="marquee-track flex w-max items-center">
        <ClientRow />
        <ClientRow hidden />
      </div>
      {/* Soft white fade on both edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent"
      />
    </div>
  );
}

/* ----------------------------- Testimonial ------------------------------ */

function Testimonial() {
  return (
    <figure className="rounded-2xl bg-[#161616] p-5 sm:p-6 text-white shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4f46e5] text-sm font-semibold tracking-tight">
          AL
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold tracking-tight">
            ALES
          </span>
          <span className="text-white/45">@ales · 8h</span>
        </div>
      </div>
      <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-white/85">
        <T
          es="Jon entregó exactamente lo que necesitábamos — limpio, rápido y con un diseño impecable. La plataforma superó nuestras expectativas."
          en="Jon delivered exactly what we needed — clean, fast, and beautifully designed. The platform exceeded our expectations."
        />
      </blockquote>
    </figure>
  );
}

/* ---------------------------------- Page -------------------------------- */

export default function Home() {
  return (
    <article className="w-full">
      {/* Full-bleed: break out of the layout's centered max-w container so the
          split fills the whole viewport width. */}
      <div className="mx-[calc(-50vw+50%)] -mt-8 lg:-mt-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 lg:h-[100dvh] lg:overflow-hidden">
          {/* LEFT — navbar + intro (stays within the left 50% on desktop) */}
          <div className="flex flex-col lg:h-full lg:overflow-hidden">
            <Navbar />

            <div className="flex flex-col justify-center flex-1 px-6 lg:pl-12 lg:pr-10 py-12 lg:py-10 lg:overflow-y-auto no-scrollbar">
              <h1 className="text-[2.6rem] leading-[0.95] sm:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-black">
              <T
                es="Sitios web con React & Next.js que no parecen plantilla."
                en="Websites built with React & Next.js that don't look like templates."
              />
            </h1>

            <p className="mt-6 max-w-md text-lg lg:text-xl leading-relaxed text-zinc-500 tracking-tight">
              <T
                es="Desarrollador y diseñador con criterio editorial. Diseño y programo sitios que se notan pensados, no ensamblados — de startups a marcas consolidadas."
                en="Developer and designer with an editorial eye. I design and build sites that feel considered, not assembled — from startups to established brands."
              />
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3.5 text-base font-medium text-white transition-colors duration-150 hover:bg-[#0000FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2"
              >
                <T es="Inicia tu proyecto" en="Start your project" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-7 py-3.5 text-base font-medium text-black transition-colors duration-150 hover:border-black hover:bg-black/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2"
              >
                <T es="Ver mi trabajo" en="See my work" />
              </Link>
            </div>

            <div className="mt-12">
              <SocialProof />
            </div>

            <div className="mt-10 max-w-md">
              <Testimonial />
            </div>
            </div>
          </div>

          {/* RIGHT — featured projects carousel */}
          <div
            id="proyectos"
            aria-label="Projects"
            className="scroll-mt-20 lg:h-full lg:border-l lg:border-black/10"
          >
            <FeaturedProjects />
          </div>
        </section>
      </div>

      {/* How I Work + Recent clients — below the hero */}
      <div>
        <HowIWork />
        <Testimonials />
      </div>

      {/* Final CTA — full-bleed black band before the footer */}
      <div className="mx-[calc(-50vw+50%)] mt-24 lg:mt-40">
        <FinalCta />
      </div>
    </article>
  );
}
