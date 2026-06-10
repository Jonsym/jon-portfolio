import Link from "next/link";
import { Square, Zap } from "lucide-react";
import { T } from "@/src/components/I18nProvider";

/** Editorial "How I Work" block: a label/statement split above a large black
 *  statement card. Minimal, premium, fully responsive (stacks on mobile). */
export default function HowIWork() {
  return (
    <section aria-label="How I Work" className="mt-24 lg:mt-40">
      {/* Editorial split: label left, statement + CTA right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12">
        <p className="lg:col-span-4 max-w-[18rem] font-mono text-xs uppercase leading-[1.7] tracking-[0.12em] text-zinc-500">
          <T
            es="Desarrollador independiente & tecnólogo creativo"
            en="Independent developer & creative technologist"
          />
        </p>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="max-w-xl text-2xl sm:text-3xl lg:text-[2rem] font-medium leading-[1.2] tracking-tight text-black">
            <T
              es="Diseño y construyo experiencias digitales de alto rendimiento que combinan estrategia, movimiento e ingeniería limpia. De startups a la industria textil, me enfoco en construir sistemas que no solo se ven bien — escalan."
              en="I design and build high-performance digital experiences that blend strategy, motion, and clean engineering. From startups to textile industries, I focus on building systems that don't just look good — they scale."
            />
          </p>

          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          >
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-black">
              <T es="Construyamos algo" en="Let's build something" />
            </span>
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 group-hover:scale-110">
              <Zap size={13} strokeWidth={2} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

      {/* Statement card */}
      <div className="mt-16 lg:mt-24 rounded-[1.75rem] bg-[#0c0c0c] p-8 sm:p-12 lg:p-16 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-16 lg:min-h-[20rem]">
          <div className="flex items-center min-w-0 overflow-hidden">
            <h2 className="font-black uppercase tracking-tighter leading-[0.82] text-white text-6xl sm:text-7xl lg:text-7xl xl:text-8xl lg:inline-block lg:origin-left lg:scale-x-[0.66] lg:whitespace-nowrap">
              <T es="Cómo Trabajo" en="How I Work" />
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-12">
            <div className="max-w-md space-y-6 text-base lg:text-lg leading-relaxed text-zinc-300">
              <p>
                <T
                  es="Cada proyecto empieza con claridad. Me enfoco en entender el negocio antes de tocar el diseño."
                  en="Every project starts with clarity. I focus on understanding the business before touching the design."
                />
              </p>
              <p>
                <T
                  es="UI limpia, backend escalable e interacciones fluidas — creo que los sistemas sólidos crean marcas sólidas."
                  en="Clean UI, scalable backend, and smooth interactions — I believe strong systems create strong brands."
                />
              </p>
            </div>

            <Link
              href="/about#approach"
              className="group inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0c0c0c]"
            >
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-white">
                <T es="Mi enfoque" en="My approach" />
              </span>
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:scale-110">
                <Square size={11} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
