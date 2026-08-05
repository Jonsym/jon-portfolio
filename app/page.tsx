import Navbar from "@/src/components/Navbar";
import ZoomHero from "@/src/components/ZoomHero";
import HowIWork from "@/src/components/HowIWork";
import Testimonials from "@/src/components/Testimonials";
import FinalCta from "@/src/components/FinalCta";

/* ---------------------------------- Page -------------------------------- */

export default function Home() {
  return (
    <article className="w-full">
      {/* Full-bleed: break out of the layout's centered max-w container so the
          navbar and the pinned zoom hero run edge to edge. The negative top
          margin cancels <main>'s top padding. */}
      <div className="mx-[calc(-50vw+50%)] -mt-8 lg:-mt-12">
        <Navbar />
        <ZoomHero />
      </div>

      {/* How I Work + Recent clients — back inside the centered container.
          The collage pulls this up via a negative margin; this section is an
          opaque layer (relative z-10 + solid bg) so it cleanly covers the
          collage's tail instead of the cards bleeding over its text. */}
      <div className="relative z-10 bg-background mt-8 lg:mt-12">
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
