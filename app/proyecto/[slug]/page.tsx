import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Breadcrumb from "@/src/components/Breadcrumb";
import {
  projects,
  getProjectBySlug,
  canOptimizeSrc,
  type GalleryItem,
} from "@/src/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — JonZS®`,
    description: project.description,
  };
}

function MediaItem({
  media,
  priority,
  index,
  total,
  sizes,
}: {
  media: GalleryItem;
  priority?: boolean;
  index?: number;
  total?: number;
  sizes?: string;
}) {
  const aspect = media.aspect ?? "16/10";
  const showCaption = typeof index === "number" && typeof total === "number";
  const imageSizes = sizes ?? "(min-width: 1024px) 1024px, 100vw";

  return (
    <figure className="group">
      <div
        className="relative w-full overflow-hidden bg-black/[0.04] border-t border-black/10"
        style={{ aspectRatio: aspect }}
      >
        {media.type === "video" ? (
          <video
            src={media.src}
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            priority={priority}
            sizes={imageSizes}
            unoptimized={!canOptimizeSrc(media.src)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        )}
      </div>
      {showCaption && (
        <figcaption className="mt-3 lg:mt-4 flex items-baseline justify-between gap-6 text-xs uppercase tracking-widest text-zinc-500">
          <span className="tabular-nums">
            {`Nº ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
          </span>
          {media.alt && (
            <span className="truncate text-right normal-case tracking-normal text-zinc-500/80">
              {media.alt}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const gallery = project.gallery ?? [];

  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Proyectos", href: "/" },
          { label: project.title },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12">
          <div className="lg:col-span-8 min-w-0">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {project.id} / Proyecto
            </p>

            <h1 className="mt-6 lg:mt-8 font-bold uppercase tracking-tighter leading-[0.9] text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl break-words">
              {project.title}
            </h1>

            <p className="mt-6 text-base lg:text-lg uppercase tracking-widest text-zinc-500">
              {project.subtitle}
            </p>
          </div>

          <dl className="lg:col-span-4 lg:col-start-9 grid grid-cols-3 gap-x-6 lg:gap-x-4 gap-y-10 text-sm self-start lg:pt-1">
            <div>
              <dt className="text-xs uppercase tracking-widest text-zinc-500">
                Año
              </dt>
              <dd className="mt-3 text-black tabular-nums">{project.year}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-zinc-500">
                Categoría
              </dt>
              <dd className="mt-3 text-black">{project.category}</dd>
            </div>
            {project.url && (
              <div>
                <dt className="text-xs uppercase tracking-widest text-zinc-500">
                  Sitio
                </dt>
                <dd className="mt-3">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 border-b border-black pb-1 text-sm tracking-tight text-black hover:opacity-60 transition-opacity duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2"
                  >
                    <span>Ver Sitio</span>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-14 lg:mt-24 border-t border-black pt-10 lg:pt-14">
          <p className="max-w-3xl text-base lg:text-lg leading-[1.75] text-zinc-700">
            {project.description}
          </p>
        </div>
      </header>

      {gallery.length > 0 && (
        <section aria-label="Galería del proyecto" className="mt-20 lg:mt-32">
          <div className="flex items-baseline justify-between border-b border-black/10 pb-4">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500">
              Galería
            </h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 tabular-nums">
              {String(gallery.length).padStart(2, "0")}{" "}
              {gallery.length === 1 ? "Pieza" : "Piezas"}
            </p>
          </div>

          <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {gallery.map((item, idx) => (
              <MediaItem
                key={`${project.slug}-${idx}`}
                media={item}
                priority={idx < 2}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ))}
          </div>
        </section>
      )}

      <footer className="mt-24 lg:mt-32 pt-8 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-black hover:opacity-60 transition-opacity duration-150"
        >
          <span aria-hidden="true">←</span>
          <span>Todos los proyectos</span>
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm text-black hover:opacity-60 transition-opacity duration-150"
        >
          <span>Iniciar un proyecto</span>
          <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </article>
  );
}
