import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Download, Eye } from "lucide-react";
import Breadcrumb from "@/src/components/Breadcrumb";
import { T } from "@/src/components/I18nProvider";
import { cvDocs } from "@/src/lib/cv";

export const metadata: Metadata = {
  title: "Sobre mí — Jon Zamudio, Desarrollador & Diseñador",
  description:
    "Desarrollador y diseñador enfocado en productos digitales rápidos y bien construidos con React y Next.js — del concepto al código, con un ojo editorial por el detalle.",
};

const services = [
  {
    id: "01",
    es: { label: "Desarrollo Web", note: "Next.js, App Router, RSC" },
    en: { label: "Web Development", note: "Next.js, App Router, RSC" },
  },
  {
    id: "02",
    es: { label: "Diseño UI / UX", note: "Sistemas editoriales y tipográficos" },
    en: { label: "UI / UX Design", note: "Editorial and typographic systems" },
  },
  {
    id: "03",
    es: { label: "Sistemas", note: "Tokens de diseño, librerías de componentes" },
    en: { label: "Systems", note: "Design tokens, component libraries" },
  },
] as const;

const stack = [
  { id: "01", label: "Next.js" },
  { id: "02", label: "React" },
  { id: "03", label: "Tailwind CSS" },
  { id: "04", label: "Node.js" },
] as const;

export default function AboutPage() {
  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { es: "Inicio", en: "Home", href: "/" },
          { es: "Acerca", en: "About" },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <h1 className="mt-6 font-semibold tracking-tighter leading-[0.9] text-foreground text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          <T es="Más de mí" en="More About Me" />
        </h1>
      </header>

      <div className="mt-20 lg:mt-32 grid grid-cols-12 gap-y-12 lg:gap-x-12 items-start">
        <section
          aria-label="Profile"
          className="col-span-12 lg:col-span-7 lg:pr-12 order-2 lg:order-1"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
            <T es="Perfil" en="Profile" />
          </h2>
          <div className="mt-6 space-y-6 max-w-2xl text-base lg:text-lg leading-relaxed text-muted-strong">
            <p>
              <T
                es="Soy desarrollador frontend enfocado en construir experiencias digitales modernas, rápidas y bien estructuradas. Me especializo en trabajar con tecnologías actuales como React y Next.js, creando interfaces escalables que no solo se ven bien, sino que también están pensadas para mantenerse y crecer a largo plazo."
                en="I'm a frontend developer focused on building modern, fast, and well-structured digital experiences. I specialize in current technologies like React and Next.js, crafting scalable interfaces that not only look good but are also built to be maintained and grow over the long term."
              />
            </p>
            <p>
              <T
                es="He trabajado en proyectos donde el diseño y la funcionalidad tienen el mismo peso, desde dashboards administrativos hasta sitios orientados a mostrar contenido visual como arte o productos. Me interesa especialmente cómo la tecnología puede mejorar la forma en que se presenta la información, haciendo que sea más clara, atractiva y útil para el usuario final."
                en="I've worked on projects where design and functionality carry equal weight — from admin dashboards to sites built around visual content like art or products. I'm especially interested in how technology can improve the way information is presented, making it clearer, more engaging, and more useful for the end user."
              />
            </p>
            <p>
              <T
                es="Además de desarrollar, suelo involucrarme en la estructura del producto: cómo se organizan los datos, cómo fluye la navegación y cómo se pueden optimizar procesos tanto del lado del usuario como del negocio. Me gusta proponer mejoras, no solo ejecutar tareas. Trabajo bien en entornos donde hay enfoque en calidad, detalle y evolución constante del producto. Me interesa formar parte de equipos que estén construyendo cosas reales, con impacto, y donde pueda seguir creciendo tanto a nivel técnico como en toma de decisiones."
                en="Beyond development, I tend to get involved in product structure: how data is organized, how navigation flows, and how processes can be optimized for both users and the business. I like proposing improvements, not just executing tasks. I work well in environments focused on quality, detail, and constant product evolution. I'm interested in joining teams building real, high-impact things — where I can keep growing both technically and in decision-making."
              />
            </p>
          </div>
        </section>

        <aside
          aria-hidden="true"
          className="col-span-12 lg:col-span-5 lg:border-l lg:border-line lg:pl-12 order-1 lg:order-2"
        >
          <div className="relative aspect-square w-full max-w-sm overflow-hidden border border-line bg-surface">
            <Image
              src="/about/jon.jpeg"
              alt="Jon Zamudio"
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </aside>
      </div>

      <div
        id="approach"
        className="scroll-mt-24 mt-20 lg:mt-32 grid grid-cols-12 gap-y-16 lg:gap-x-12"
      >
        <section
          aria-label="Services"
          className="col-span-12 lg:col-span-6"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
            <T es="Servicios" en="Services" />
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {services.map((service) => (
              <li
                key={service.id}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-xs tabular-nums text-muted">
                    {service.id}
                  </span>
                  <span className="text-base lg:text-lg text-foreground">
                    <T es={service.es.label} en={service.en.label} />
                  </span>
                </span>
                <span className="text-xs text-muted text-right">
                  <T es={service.es.note} en={service.en.note} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-label="Tech stack"
          className="col-span-12 lg:col-span-6 lg:border-l lg:border-line lg:pl-12"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
            <T es="Stack Tecnológico" en="Tech Stack" />
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {stack.map((tech) => (
              <li key={tech.id} className="flex items-baseline gap-4 py-4">
                <span className="text-xs tabular-nums text-muted">
                  {tech.id}
                </span>
                <span className="text-base lg:text-lg text-foreground">
                  {tech.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-label="Curriculum" className="mt-20 lg:mt-32">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
          <T es="Currículum" en="CV" />
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {cvDocs.map((doc) => (
            <li
              key={doc.href}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
            >
              <span className="flex items-baseline gap-4">
                <span className="text-xs tabular-nums text-muted">{doc.code}</span>
                <span className="text-base lg:text-lg text-foreground">
                  <T es={doc.es} en={doc.en} />
                </span>
                <span className="text-xs uppercase tracking-widest text-muted">PDF</span>
              </span>

              <span className="flex items-center gap-2">
                {/* View opens the PDF in a tab; download saves it. Same file,
                    two intents — `download` is what separates them. */}
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] text-foreground transition-colors duration-150 hover:border-line-strong hover:text-foreground-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <Eye size={14} strokeWidth={1.75} aria-hidden="true" />
                  <T es="Ver" en="View" />
                </a>
                <a
                  href={doc.href}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-foreground-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-background transition-opacity duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <Download size={14} strokeWidth={1.75} aria-hidden="true" />
                  <T es="Descargar" en="Download" />
                </a>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-24 lg:mt-32 pt-8 border-t border-line flex flex-wrap items-center justify-end gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm text-foreground hover:opacity-60 transition-opacity duration-150"
        >
          <span>
            <T es="Iniciar un proyecto" en="Start a project" />
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </article>
  );
}
