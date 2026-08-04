import Link from "next/link";
import ProjectsCollage from "@/src/components/ProjectsCollage";
import { T } from "@/src/components/I18nProvider";

/**
 * Home hero: the rotating "JON @ JON" wordmark sitting low in the first screen
 * (with editorial meta pinned to the top corners), followed by the
 * scroll-driven projects collage.
 */

function MetaRow() {
  return (
    <div className="flex flex-col gap-4 px-6 lg:px-12 pt-8 lg:pt-12 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <p className="max-w-[16rem] text-sm leading-snug uppercase tracking-[0.14em] text-muted-strong">
        <T
          es="Diseño, desarrollo y mantenimiento de sitios web."
          en="Design, development & maintenance for the web."
        />
      </p>
      <Link
        href="/contact"
        className="group inline-flex shrink-0 items-center gap-1.5 text-sm uppercase tracking-[0.14em] text-foreground transition-colors duration-150 hover:text-foreground-strong"
      >
        <T es="Inicia un proyecto" en="Start a project" />
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          ↗
        </span>
      </Link>
    </div>
  );
}

export default function ZoomHero() {
  return (
    <>
      {/* Editorial meta at the top; the wordmark now lives inside the collage,
          above its first row (with derived whitespace above it). */}
      <MetaRow />
      <ProjectsCollage />
    </>
  );
}
