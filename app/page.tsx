import Link from "next/link";
import FeaturedProjects from "@/src/components/FeaturedProjects";
import HowIWork from "@/src/components/HowIWork";
import Testimonials from "@/src/components/Testimonials";
import FinalCta from "@/src/components/FinalCta";
import Navbar from "@/src/components/Navbar";
import { T } from "@/src/components/I18nProvider";

/* ---------------------------------- Page -------------------------------- */

export default function Home() {
  return (
    <article className="w-full">
      {/* Full-bleed: break out of the layout's centered max-w container so the
          split fills the whole viewport width and the divider runs to the top. */}
      <div className="mx-[calc(-50vw+50%)] -mt-8 lg:-mt-12">
        <section className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — navbar + intro. Not viewport-locked and not vertically
              centered: the headline sits at the top with real breathing room
              below the nav instead of colliding with it. The column stretches
              to match the carousel's height, so the empty space falls below
              the CTAs as deliberate negative space. */}
          <div className="flex flex-col">
            <Navbar />

            <div className="px-6 lg:pl-12 lg:pr-10 pt-16 sm:pt-24 lg:pt-28 pb-16 lg:pb-24">
              {/* Each word is its own block-level line, so the three-line
                  break is guaranteed at every breakpoint — not reliant on
                  wrapping, <br>, or a max-width that happens to break right. */}
              <h1 className="text-[2.6rem] leading-[0.85] sm:text-6xl xl:text-7xl font-bold uppercase tracking-tight text-foreground">
                <span className="block">
                  <T es="Diseño." en="Design." />
                </span>
                <span className="block">
                  <T es="Desarrollo." en="Development." />
                </span>
                <span className="block">
                  <T es="Mantenimiento." en="Maintenance." />
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg lg:text-xl leading-relaxed text-muted tracking-tight">
                <T
                  es="Gestiono todo el ciclo de vida del producto, desde la planificación inicial y la validación de la idea hasta la entrega final."
                  en="I handle the entire product journey from early planning and idea validation to final delivery"
                />
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-foreground-strong px-7 py-3.5 text-base font-medium text-background transition-colors duration-150 hover:bg-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-2"
                >
                  <T es="Inicia tu proyecto" en="Start your project" />
                </Link>
                <Link
                  href="/proyectos"
                  className="inline-flex items-center justify-center rounded-full border border-line-strong px-7 py-3.5 text-base font-medium text-foreground transition-colors duration-150 hover:border-foreground/40 hover:bg-foreground/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-strong focus-visible:ring-offset-2"
                >
                  <T es="Ver mi trabajo" en="See my work" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — featured projects carousel (self-sized to the viewport). */}
          <div
            id="proyectos"
            aria-label="Projects"
            className="scroll-mt-20 lg:border-l lg:border-line"
          >
            <FeaturedProjects />
          </div>
        </section>
      </div>

      {/* How I Work + Recent clients — below the hero */}
      <div>
        <HowIWork />
        <Testimonials />
      </div>

      {/* Final CTA — full-bleed band before the footer */}
      <div className="mx-[calc(-50vw+50%)] mt-24 lg:mt-40">
        <FinalCta />
      </div>
    </article>
  );
}
