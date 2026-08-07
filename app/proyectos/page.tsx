import type { Metadata } from "next";
import ProjectOrbit from "@/src/components/ProjectOrbit";
import { projects } from "@/src/lib/projects";

export const metadata: Metadata = {
  title: "Proyectos — Jon Zamudio",
  description:
    "Proyectos seleccionados de diseño y desarrollo web con React y Next.js — sitios rápidos, claros y hechos para crecer, 2018—2026.",
};

/**
 * One locked viewport: the carousel is the page. It fixes itself under the
 * navbar and fills the screen, so there is nothing to lay out here.
 */
export default function ProyectosPage() {
  return <ProjectOrbit projects={projects} />;
}
