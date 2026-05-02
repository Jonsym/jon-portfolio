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
  {
    id: "02",
    label: "Diseño UI / UX",
    note: "Sistemas editoriales y tipográficos",
  },
  {
    id: "03",
    label: "Sistemas",
    note: "Tokens de diseño, librerías de componentes",
  },
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
        items={[{ label: "Inicio", href: "/" }, { label: "Acerca" }]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <h1 className="mt-6 font-bold tracking-tighter leading-[0.9] text-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          Mas de Mi
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
              Soy desarrollador frontend enfocado en construir experiencias
              digitales modernas, rápidas y bien estructuradas. Me especializo
              en trabajar con tecnologías actuales como React y Next.js, creando
              interfaces escalables que no solo se ven bien, sino que también
              están pensadas para mantenerse y crecer a largo plazo.
            </p>
            <p>
              He trabajado en proyectos donde el diseño y la funcionalidad
              tienen el mismo peso, desde dashboards administrativos hasta
              sitios orientados a mostrar contenido visual como arte o
              productos. Me interesa especialmente cómo la tecnología puede
              mejorar la forma en que se presenta la información, haciendo que
              sea más clara, atractiva y útil para el usuario final.
            </p>
            <p>
              Además de desarrollar, suelo involucrarme en la estructura del
              producto: cómo se organizan los datos, cómo fluye la navegación y
              cómo se pueden optimizar procesos tanto del lado del usuario como
              del negocio. Me gusta proponer mejoras, no solo ejecutar tareas.
              Trabajo bien en entornos donde hay enfoque en calidad, detalle y
              evolución constante del producto. Me interesa formar parte de
              equipos que estén construyendo cosas reales, con impacto, y donde
              pueda seguir creciendo tanto a nivel técnico como en toma de
              decisiones.
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
                <li key={tech.id} className="flex items-baseline gap-4 py-4">
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
