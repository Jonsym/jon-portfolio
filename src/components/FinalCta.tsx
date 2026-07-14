import Link from "next/link";
import { T } from "@/src/components/I18nProvider";

/** Final call-to-action: full-width black statement that invites the visitor
 *  to start a project. The primary button links to /contacto. */
export default function FinalCta() {
  return (
    <section
      aria-label="Start a project"
      className="w-full bg-surface text-foreground"
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 py-24 sm:py-32 lg:py-44 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          <T
            es="(Disponible para nuevos proyectos — 2026)"
            en="(Available for new projects — 2026)"
          />
        </p>

        <h2 className="mx-auto mt-8 max-w-5xl text-[2.25rem] leading-[0.95] sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold uppercase tracking-tight text-foreground">
          <T
            es="Construyamos algo que se sienta vivo"
            en="Let's build something that feels alive"
          />
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base lg:text-lg leading-relaxed text-muted-strong">
          <T
            es="Cuéntame qué estás construyendo. Te respondo en un día hábil con los próximos pasos claros — sin compromiso."
            en="Tell me what you're building. I'll reply within one business day with clear next steps — no obligation."
          />
        </p>

        <div className="mt-10 lg:mt-14 flex justify-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground-strong px-7 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-background transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            <T es="Inicia tu proyecto" en="Start your project" />
          </Link>
        </div>
      </div>
    </section>
  );
}
