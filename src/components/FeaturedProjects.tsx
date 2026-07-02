"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { projects, type Project } from "@/src/lib/projects";
import HeroMedia from "@/src/components/HeroMedia";
import MobileCarousel, {
  type CarouselHandle,
} from "@/src/components/MobileCarousel";
import { T, useTPair } from "@/src/components/I18nProvider";

/** Featured projects shown on the home page. The full set lives on /proyectos. */
const FEATURED = projects.slice(0, 4);

function ProjectCard({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  const categoryEn = project.i18n?.en?.category ?? project.category;
  return (
    <Link
      href={`/proyectos/${project.slug}`}
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
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform duration-300 group-hover:scale-110">
            <ArrowUpRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
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
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-150 hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}

export default function FeaturedProjects() {
  // Two copies so the desktop vertical marquee loops seamlessly.
  const loop = [...FEATURED, ...FEATURED];

  const carouselRef = useRef<CarouselHandle>(null);
  const prevLabel = useTPair("Anterior", "Previous");
  const nextLabel = useTPair("Siguiente", "Next");
  const label = useTPair("Trabajo destacado", "Featured work");

  return (
    <div className="lg:h-full">
      {/* Mobile / tablet: infinite touch carousel */}
      <div className="lg:hidden px-6 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-zinc-400">
            {label}
          </span>
          <div className="flex gap-2">
            <Ctrl onClick={() => carouselRef.current?.prev()} label={prevLabel}>
              <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            </Ctrl>
            <Ctrl onClick={() => carouselRef.current?.next()} label={nextLabel}>
              <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Ctrl>
          </div>
        </div>
        <MobileCarousel
          ref={carouselRef}
          ariaLabel={label}
          className="-mx-2"
          slides={FEATURED.map((project, i) => (
            <ProjectCard key={project.slug} project={project} priority={i === 0} />
          ))}
        />
      </div>

      {/* Desktop: seamless auto-scrolling vertical marquee */}
      <div className="carousel hidden lg:block relative h-[100dvh] overflow-hidden">
        <div className="carousel-track absolute inset-x-0 top-0 flex flex-col gap-7 px-10 will-change-transform">
          {loop.map((project, i) => (
            <ProjectCard
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
  );
}
