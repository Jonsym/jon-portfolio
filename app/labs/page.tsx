import type { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumb";
import LabCard from "@/src/components/LabCard";
import { T } from "@/src/components/I18nProvider";
import { labs } from "@/src/lib/labs";

export const metadata: Metadata = {
  title: "Labs — JonZS®",
  description:
    "Productos en desarrollo, construidos en público — del concepto al lanzamiento. ChupiRoom y Momentum.",
};

export default function LabsPage() {
  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { es: "Inicio", en: "Home", href: "/" },
          { es: "Labs", en: "Labs" },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0000FF] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0000FF]" />
          </span>
          <T es="Construyendo en público" en="Building in public" />
        </p>

        <h1 className="mt-6 font-bold tracking-tighter leading-[0.9] text-black text-6xl md:text-7xl lg:text-8xl">
          Labs
        </h1>
        <p className="mt-8 max-w-xl text-base lg:text-lg leading-relaxed text-zinc-500">
          <T
            es="Productos en desarrollo, no proyectos terminados. Sigue su recorrido —de la idea al lanzamiento— a través de una línea de tiempo de hitos."
            en="Products in the making, not finished projects. Follow their journey — from idea to launch — through a timeline of milestones."
          />
        </p>
      </header>

      <section
        aria-label="Labs"
        className="mt-12 sm:mt-16 lg:mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
      >
        {labs.map((product, i) => (
          <LabCard key={product.slug} product={product} index={i} />
        ))}
      </section>
    </article>
  );
}
