import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Coffee,
  Gem,
  GraduationCap,
  Heart,
  Languages,
  PawPrint,
  Stethoscope,
  Trees,
} from "lucide-react";
import { projects, type Project } from "@/src/lib/projects";
import HeroMedia from "@/src/components/HeroMedia";
import HowIWork from "@/src/components/HowIWork";
import Navbar from "@/src/components/Navbar";
import { T } from "@/src/components/I18nProvider";

/* ----------------------------- Social proof ----------------------------- */

const clients = [
  { name: "Novax", Icon: Building2 },
  { name: "Lumina", Icon: Stethoscope },
  { name: "Luxora", Icon: Gem },
  { name: "The Woods", Icon: Trees },
  { name: "ALES", Icon: GraduationCap },
  { name: "HowtoSpanish", Icon: Languages },
  { name: "MaterCare", Icon: Heart },
  { name: "HelloMatcha", Icon: Coffee },
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
          <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
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
          GH
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold tracking-tight">
            Dra. Grace H.
            <BadgeCheck size={15} className="text-[#3b82f6]" aria-hidden="true" />
          </span>
          <span className="text-white/45">@dragrace · 8h</span>
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

/* --------------------------- Hero project card -------------------------- */

function HeroProjectCard({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  const categoryEn = project.i18n?.en?.category ?? project.category;
  return (
    <Link
      href={`/proyecto/${project.slug}`}
      aria-label={`${project.title} — ${project.year} ${project.category}`}
      className="group relative block overflow-hidden rounded-2xl lg:rounded-3xl border border-black/10 bg-black/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {project.video ? (
          <HeroMedia
            src={project.video.src}
            poster={project.video.poster}
            title={project.title}
          />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="pointer-events-none object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
          />
        ) : null}

        {/* Hover scrim + label */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="min-w-0">
            <p className="truncate text-lg font-medium tracking-tight text-white">
              {project.title}
            </p>
            <p className="mt-0.5 text-xs tracking-tight text-white/70">
              <T es={project.category} en={categoryEn} /> · {project.year}
            </p>
          </div>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black">
            <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ---------------------------------- Page -------------------------------- */

export default function Home() {
  // Two copies of the list so the vertical marquee loops seamlessly.
  const loop = [...projects, ...projects];

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
              <T es="¿Quieres un sitio" en="Need a cool" />{" "}
              <T es="genial?" en="website?" />{" "}
              <span className="font-serif font-medium italic normal-case">
                <T es="Yo lo hago." en="I will." />
              </span>
            </h1>

            <p className="mt-6 max-w-md text-lg lg:text-xl leading-relaxed text-zinc-500 tracking-tight">
              <T
                es="Del diseño al desarrollo, construyo sitios web simples, rápidos y efectivos."
                en="From design to development, I build websites that are simple, fast, and effective."
              />
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3.5 text-base font-medium text-white transition-colors duration-150 hover:bg-[#0000FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2"
              >
                <T es="Inicia tu proyecto" en="Start Your Project" />
              </Link>
              <a
                href="#proyectos"
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-7 py-3.5 text-base font-medium text-black transition-colors duration-150 hover:border-black hover:bg-black/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2"
              >
                <T es="Ver trabajos" en="See Our Work" />
              </a>
            </div>

            <div className="mt-12">
              <SocialProof />
            </div>

            <div className="mt-10 max-w-md">
              <Testimonial />
            </div>
            </div>
          </div>

          {/* RIGHT — vertical project carousel */}
          <div
            id="proyectos"
            aria-label="Projects"
            className="scroll-mt-20 lg:h-full lg:border-l lg:border-black/10"
          >
            {/* Mobile: plain stacked cards */}
            <div className="lg:hidden flex flex-col gap-6 px-6 pb-16">
              {projects.map((project, i) => (
                <HeroProjectCard
                  key={project.slug}
                  project={project}
                  priority={i === 0}
                />
              ))}
            </div>

            {/* Desktop: seamless auto-scrolling vertical marquee */}
            <div className="carousel hidden lg:block relative h-full overflow-hidden">
              <div className="carousel-track absolute inset-x-0 top-0 flex flex-col gap-7 px-10 will-change-transform">
                {loop.map((project, i) => (
                  <HeroProjectCard
                    key={`${project.slug}-${i}`}
                    project={project}
                    priority={i === 0}
                  />
                ))}
              </div>
              {/* Soft fade at top & bottom edges */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
              />
            </div>
          </div>
        </section>
      </div>

      {/* How I Work — below the hero */}
      <div className="pb-24 lg:pb-40">
        <HowIWork />
      </div>
    </article>
  );
}
