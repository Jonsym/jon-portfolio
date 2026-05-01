import Image from "next/image";
import Link from "next/link";

export type ProjectMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

export interface Project {
  slug: string;
  title: string;
  year: number;
  category: string;
  media?: ProjectMedia;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center justify-center border border-black bg-black px-2 text-xs font-medium text-white tabular-nums tracking-tight">
      {children}
    </span>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const { slug, title, year, category, media } = project;

  return (
    <Link
      href={`/proyecto/${slug}`}
      aria-label={`${title} — ${year} ${category}`}
      className="group block focus:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      <article className="flex flex-col">
        <header className="flex items-end justify-between gap-4 pb-3">
          <h3 className="text-2xl md:text-3xl tracking-tight leading-none text-black transition-opacity duration-200 group-hover:opacity-70">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge>{year}</Badge>
            <Badge>{category}</Badge>
          </div>
        </header>

        <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/[0.04] border-t border-black">
          {media?.type === "image" && (
            <Image
              src={media.src}
              alt={media.alt ?? title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="pointer-events-none object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
            />
          )}
          {media?.type === "video" && (
            <video
              src={media.src}
              poster={media.poster}
              autoPlay
              muted
              loop
              playsInline
              className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
            />
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]"
          />
        </div>
      </article>
    </Link>
  );
}
