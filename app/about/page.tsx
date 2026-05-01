import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Acerca — JonZS®",
  description:
    "Diseñador y desarrollador independiente enfocado en productos digitales editoriales, sistemas de diseño e interfaces de alta calidad.",
};

const services = [
  { id: "01", label: "Desarrollo Web", note: "Next.js, App Router, RSC" },
  { id: "02", label: "Diseño UI / UX", note: "Sistemas editoriales y tipográficos" },
  { id: "03", label: "Sistemas", note: "Tokens de diseño, librerías de componentes" },
] as const;

const stack = [
  { id: "01", label: "Next.js" },
  { id: "02", label: "React" },
  { id: "03", label: "Tailwind CSS" },
  { id: "04", label: "Node.js" },
] as const;

function Registered() {
  return (
    <span className="inline-block text-[0.32em] font-medium ml-[0.05em] -translate-y-[0.18em] align-baseline">
      ®
    </span>
  );
}

export default function AboutPage() {
  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Acerca" },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          00 / Acerca
        </p>
        <h1 className="mt-6 font-bold tracking-tighter leading-[0.9] text-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          Acerca de JonZS
          <Registered />
        </h1>
      </header>

      <div className="mt-20 lg:mt-32 grid grid-cols-12 gap-y-20 lg:gap-x-12">
        <section
          aria-label="Perfil"
          className="col-span-12 lg:col-span-7 lg:pr-12"
        >
          <h2 className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Perfil
          </h2>
          <div className="mt-6 space-y-6 max-w-2xl text-base lg:text-lg leading-relaxed text-zinc-700">
            <p>
              Soy Jon — diseñador y desarrollador independiente con base en la
              Ciudad de México, construyo productos digitales editoriales con
              un sesgo por la claridad, la sobriedad y el detalle tipográfico.
            </p>
            <p>
              Durante la última década he trabajado en estudios y equipos
              in-house entregando marcas de consumo, plataformas SaaS y
              sistemas de diseño. El trabajo suele leerse en silencio: formato
              largo, márgenes generosos, tipografía que sostiene la página por
              sí sola.
            </p>
            <p>
              Actualmente seleccionando un número reducido de proyectos por
              trimestre, con foco en web de formato largo, superficies de
              producto y sistemas reutilizables.
            </p>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-5 flex flex-col gap-16 lg:border-l lg:border-black/10 lg:pl-12">
          <section aria-label="Servicios">
            <h2 className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Servicios
            </h2>
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="flex items-baseline justify-between gap-6 py-4"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-xs tabular-nums text-zinc-400">
                      {service.id}
                    </span>
                    <span className="text-base lg:text-lg text-black">
                      {service.label}
                    </span>
                  </span>
                  <span className="text-xs text-zinc-500 text-right">
                    {service.note}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Stack tecnológico">
            <h2 className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Stack Tecnológico
            </h2>
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {stack.map((tech) => (
                <li
                  key={tech.id}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="text-xs tabular-nums text-zinc-400">
                    {tech.id}
                  </span>
                  <span className="text-base lg:text-lg text-black">
                    {tech.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <footer className="mt-24 lg:mt-32 pt-8 border-t border-black/10 flex flex-wrap items-center justify-end gap-4">
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
