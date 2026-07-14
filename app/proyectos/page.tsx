import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Breadcrumb from "@/src/components/Breadcrumb";
import { T } from "@/src/components/I18nProvider";
import { projects, canOptimizeSrc, type Project } from "@/src/lib/projects";

export const metadata: Metadata = {
  title: "Proyectos — Jon Zamudio",
  description:
    "Proyectos seleccionados de diseño y desarrollo web con React y Next.js — sitios rápidos, claros y hechos para crecer, 2018—2026.",
};

function ProjectCard({ project }: { project: Project }) {
  const thumb = project.image ?? project.video?.poster ?? "";
  const categoryEn = project.i18n?.en?.category ?? project.category;
  const subtitleEn = project.i18n?.en?.subtitle ?? project.subtitle;
  const descriptionEn = project.i18n?.en?.description ?? project.description;

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      aria-label={`${project.title} — ${project.year} ${project.category}`}
      className="group flex flex-col focus:outline-none"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 group-hover:border-line-strong group-focus-visible:ring-2 group-focus-visible:ring-foreground-strong group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background">
        {thumb && (
          <Image
            src={thumb}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={!canOptimizeSrc(thumb)}
            className="object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
          />
        )}
      </div>

      {/* Tags / category */}
      <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
        <span className="tabular-nums">{project.year}</span>
        <span aria-hidden="true" className="text-muted">
          /
        </span>
        <span>
          <T es={project.category} en={categoryEn} />
        </span>
      </div>

      <h2 className="mt-3 text-2xl tracking-tight leading-none text-foreground-strong transition-opacity duration-200 group-hover:opacity-70">
        {project.title}
      </h2>

      <p className="mt-1.5 text-sm uppercase tracking-widest text-muted">
        <T es={project.subtitle} en={subtitleEn} />
      </p>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted line-clamp-2">
        <T es={project.description} en={descriptionEn} />
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        <T es="Ver proyecto" en="View project" />
        <ArrowUpRight
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export default function ProyectosPage() {
  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { es: "Inicio", en: "Home", href: "/" },
          { es: "Proyectos", en: "Projects" },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <h1 className="font-semibold tracking-tighter leading-[0.9] text-foreground text-6xl md:text-7xl lg:text-8xl">
          <T es="Proyectos" en="Projects" />
        </h1>
        <p className="mt-8 max-w-xl text-base lg:text-lg leading-relaxed text-muted">
          <T
            es="Una selección de trabajos de diseño y desarrollo web — del concepto a la entrega."
            en="A selection of web design and development work — from concept to delivery."
          />
        </p>
      </header>

      <section
        aria-label="Projects"
        className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 lg:gap-y-16"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>
    </article>
  );
}
