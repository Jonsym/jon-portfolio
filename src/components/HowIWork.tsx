import Link from "next/link";
import { Square, SquareEqual, Zap, } from "lucide-react";
import { T } from "@/src/components/I18nProvider";

/** Editorial "How I Work" block: a label/statement split above a large black
 *  statement card. Minimal, premium, fully responsive (stacks on mobile). */
export default function HowIWork() {
  return (
    <section aria-label="How I Work" className="mt-24 lg:mt-40">
      {/* Editorial split: label left, statement + CTA right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12">
        <p className="lg:col-span-4 max-w-[18rem] text-xs uppercase leading-[1.7] tracking-[0.14em] text-muted">
          <T
            es="Desarrollador independiente & tecnólogo creativo"
            en="Independent developer & creative technologist"
          />
        </p>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="max-w-xl text-2xl sm:text-3xl lg:text-[2rem] font-medium leading-[1.2] tracking-tight text-foreground">
            <T
              es="Primero la estrategia, después el código. Diseño y programo sistemas web que combinan movimiento e ingeniería limpia — de negocios locales a pymes en México, hechos para verse bien y escalar."
              en="Strategy first, then code. I design and build web systems that combine motion and clean engineering — from local businesses to SMBs across Mexico, made to look good and scale."
            />
          </p>

          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
              <T es="Construyamos algo" en="Let's build something" />
            </span>
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-200 group-hover:scale-110">
              <Zap size={13} strokeWidth={2} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

      {/* Statement card */}
      <div className="mt-16 lg:mt-24 rounded-[1.75rem] bg-surface p-8 sm:p-12 lg:p-16 text-foreground">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-16 lg:min-h-[20rem]">
          <div className="flex items-center min-w-0 overflow-hidden">
            <h2 className="font-extrabold uppercase tracking-tighter leading-[0.82] text-foreground text-6xl sm:text-7xl lg:text-7xl xl:text-8xl lg:inline-block lg:origin-left lg:scale-x-[0.66] lg:whitespace-nowrap">
              <T es="Cómo Trabajo" en="How I Work" />
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-12">
            <div className="max-w-md space-y-6 text-base lg:text-lg leading-relaxed text-muted-strong">
              <p>
                <T
                  es="Cada proyecto empieza por entender tu negocio — antes de tocar el diseño."
                  en="Every project starts with understanding your business — before touching design."
                />
              </p>
              <p>
                <T
                  es="Después: UI limpia, un backend escalable e interacciones fluidas. Los sistemas sólidos construyen marcas sólidas."
                  en="Then: clean UI, a scalable backend, and smooth interactions. Strong systems build strong brands."
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
