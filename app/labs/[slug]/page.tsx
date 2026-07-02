import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/src/components/Breadcrumb";
import StageTracker from "@/src/components/StageTracker";
import LabTimeline from "@/src/components/LabTimeline";
import { T } from "@/src/components/I18nProvider";
import { labs, getLabBySlug, stageLabel } from "@/src/lib/labs";

export function generateStaticParams() {
  return labs.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getLabBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Labs — JonZS®`,
    description: product.tagline.es,
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getLabBySlug(slug);

  if (!product) {
    notFound();
  }

  const current = stageLabel(product.currentStage);
  const completed = product.milestones.filter(
    (m) => m.status === "completed"
  ).length;

  return (
    <article className="w-full pb-24 lg:pb-40">
      <Breadcrumb
        items={[
          { es: "Inicio", en: "Home", href: "/" },
          { es: "Labs", en: "Labs", href: "/labs" },
          { es: product.name },
        ]}
      />

      <header className="mt-12 lg:mt-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="lg:col-span-8 min-w-0">
            <h1 className="font-bold tracking-tighter leading-[0.9] text-black text-5xl sm:text-6xl md:text-7xl xl:text-8xl break-words">
              {product.name}
            </h1>

            <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-zinc-600">
              <T es={product.tagline.es} en={product.tagline.en} />
            </p>
          </div>

          <dl className="lg:col-span-4 lg:col-start-9 grid grid-cols-2 gap-x-6 gap-y-8 text-sm self-start lg:pt-2">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <T es="Etapa" en="Stage" />
              </dt>
              <dd className="mt-2.5" style={{ color: product.color }}>
                <T es={current.es} en={current.en} />
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <T es="Hitos" en="Milestones" />
              </dt>
              <dd className="mt-2.5 text-black tabular-nums">
                {completed}/{product.milestones.length}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <T es="Plataformas" en="Platforms" />
              </dt>
              <dd className="mt-2.5 text-black">{product.platforms.join(" · ")}</dd>
            </div>
            {product.stack && product.stack.length > 0 && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  <T es="Stack" en="Stack" />
                </dt>
                <dd className="mt-2.5 text-black leading-relaxed">
                  {product.stack.join(" · ")}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-12 lg:mt-16 border-t border-black pt-10 lg:pt-12">
          <p className="max-w-3xl text-base lg:text-lg leading-[1.75] text-zinc-700">
            <T es={product.description.es} en={product.description.en} />
          </p>
        </div>

        {/* Stage tracker */}
        <div className="mt-12 lg:mt-16 rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <StageTracker
            currentStage={product.currentStage}
            color={product.color}
          />
        </div>
      </header>

      {/* Timeline */}
      <section aria-label="Timeline" className="mt-16 lg:mt-24 max-w-3xl">
        <div className="flex items-baseline justify-between border-b border-black/10 pb-4">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500">
            <T es="Línea de tiempo" en="Timeline" />
          </h2>
          <p className="text-xs uppercase tracking-widest text-zinc-500 tabular-nums">
            {String(product.milestones.length).padStart(2, "0")}{" "}
            <T
              es={product.milestones.length === 1 ? "Hito" : "Hitos"}
              en={product.milestones.length === 1 ? "Milestone" : "Milestones"}
            />
          </p>
        </div>

        <div className="mt-10 lg:mt-12">
          <LabTimeline milestones={product.milestones} color={product.color} />
        </div>
      </section>

      <footer className="mt-20 lg:mt-28 pt-8 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 text-sm text-black hover:opacity-60 transition-opacity duration-150"
        >
          <span aria-hidden="true">←</span>
          <span>
            <T es="Todos los Labs" en="All Labs" />
          </span>
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm text-black hover:opacity-60 transition-opacity duration-150"
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
