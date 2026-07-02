import Link from "next/link";
import { T } from "@/src/components/I18nProvider";

/** Final call-to-action: full-width black statement that invites the visitor
 *  to start a project. The primary button links to /contacto. */
export default function FinalCta() {
  return (
    <section
      aria-label="Start a project"
      className="w-full bg-[#0c0c0c] text-white"
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 py-24 sm:py-32 lg:py-44 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          <T
            es="(Disponible para nuevos proyectos — 2026)"
            en="(Available for new projects — 2026)"
          />
        </p>

        <h2 className="mx-auto mt-8 max-w-5xl text-[2.25rem] leading-[0.95] sm:text-5xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white">
          <T
            es="Construyamos algo que se sienta vivo"
            en="Let's build something that feels alive"
          />
        </h2>

        <div className="mt-10 lg:mt-14 flex justify-center">
          <Link
            href="/contacto"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-black transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0c0c0c]"
          >
            <T es="Empecemos" en="Let's talk" />
          </Link>
        </div>
      </div>
    </section>
  );
}
