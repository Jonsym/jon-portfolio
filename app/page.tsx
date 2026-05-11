import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/src/lib/projects";
import VideoCover from "@/src/components/VideoCover";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center justify-center bg-black px-2 text-xs font-medium text-white tabular-nums tracking-tight">
      {children}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/proyecto/${project.slug}`}
      aria-label={`${project.title} — ${project.year} ${project.category}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-4"
    >
      <header className="flex items-end justify-between gap-4 pb-3">
        <h3 className="text-2xl md:text-3xl tracking-tight leading-none text-black transition-opacity duration-200 group-hover:opacity-70">
          {project.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge>{project.year}</Badge>
          <Badge>{project.category}</Badge>
        </div>
      </header>

      <div className="relative w-full aspect-video overflow-hidden bg-black/[0.04] border-t border-black">
        {project.video ? (
          <VideoCover src={project.video.src} title={project.title} />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="pointer-events-none object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <article className="w-full pb-24 lg:pb-40">
      <header className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-start-5 lg:col-span-8 mt-8 lg:mt-12">
          <h1 className="text-3xl lg:text-4xl tracking-tight leading-none text-black">
            Todos los Proyectos
          </h1>
          <p className="mt-2 text-lg lg:text-xl text-zinc-500 tracking-tight">
            Trabajo destacado entre ©2018-25
          </p>
        </div>
      </header>

      <section
        aria-label="Listado de proyectos"
        className="mt-16 lg:mt-24 grid grid-cols-12 gap-x-6 gap-y-16 lg:gap-y-24"
      >
        {projects.map((project) => (
          <div
            key={project.slug}
            className="col-span-12 lg:col-start-5 lg:col-span-8"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </section>
    </article>
  );
}
