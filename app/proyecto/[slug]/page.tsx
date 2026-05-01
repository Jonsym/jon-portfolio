import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumb";
import {
  projects,
  getProjectBySlug,
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
}: {
  media: GalleryItem;
  priority?: boolean;
}) {
  const aspect = media.aspect ?? "16/10";

  if (media.type === "video") {
    return (
      <figure
        className="relative w-full overflow-hidden bg-black/[0.04] border-t border-black/10"
        style={{ aspectRatio: aspect }}
      >
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      </figure>
    );
  }

  return (
    <figure
      className="relative w-full overflow-hidden bg-black/[0.04] border-t border-black/10"
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="object-cover"
      />
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

      <figure className="mt-10 lg:mt-14 relative w-full aspect-[16/10] lg:aspect-[16/9] overflow-hidden bg-black border border-black/10">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover"
        />
      </figure>

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          {project.id} / Proyecto
        </p>

        <h1 className="mt-6 font-bold uppercase tracking-tighter leading-[0.9] text-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          {project.title}
        </h1>

        <p className="mt-6 text-base lg:text-lg uppercase tracking-widest text-zinc-500">
          {project.subtitle}
        </p>

        <dl className="mt-12 lg:mt-16 flex flex-wrap gap-y-8 gap-x-12 lg:gap-x-24 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-widest text-zinc-500">
              Año
            </dt>
            <dd className="mt-2 text-black tabular-nums">{project.year}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-zinc-500">
              Categoría
            </dt>
            <dd className="mt-2 text-black">{project.category}</dd>
          </div>
        </dl>

        <p className="mt-12 lg:mt-16 max-w-2xl text-base lg:text-lg leading-[1.75] text-zinc-700">
          {project.description}
        </p>
      </header>

      {gallery.length > 0 && (
        <section
          aria-label="Galería del proyecto"
          className="mt-20 lg:mt-32 flex flex-col gap-6 lg:gap-10"
        >
          <h2 className="text-xs uppercase tracking-widest text-zinc-500">
            Galería
          </h2>
          <div className="flex flex-col gap-6 lg:gap-10">
            {gallery.map((item, idx) => (
              <MediaItem
                key={`${project.slug}-${idx}`}
                media={item}
                priority={idx === 0}
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
