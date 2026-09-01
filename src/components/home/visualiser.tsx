import { BackgroundVideo } from "@/components/ui/background-video";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { visualiser } from "@/lib/content";

/**
 * Surface visualiser — Figma 544:3967 (heading), 544:4015 (plate), 544:3977 (CTA).
 *
 *   heading  y4894, the standard 599-wide centred block
 *   plate    x-9 y5065, 1449 x 815 — bleeds 9px past both edges
 *   CTA      y5927, ruby fill (Figma's Style=Primary, "Ruby CTA")
 *
 * Gaps: heading block ends 5015.5 -> plate 5065 is 49.5; plate ends 5880 ->
 * CTA 5927 is 47; CTA ends 5969.7.
 *
 * This is the page's only filled button. Every other CTA is an outline.
 */
export function Visualiser() {
  return (
    <section className="bg-white pt-[147px] pb-[0px]" aria-labelledby="visualiser-heading">
      <SectionHeading title={visualiser.headline} body={visualiser.body} />

      <Reveal delay={140}>
        <div id="visualiser-plate" className="relative mt-[51px] aspect-[1440/815] w-full overflow-hidden bg-placeholder">
          {/* A slow dolly push-in, so it loops. The seam is real — frame 0 is
              wide, the last frame is pushed in — but the clip sits mid-page and
              is paused whenever it is off-screen, so the cut lands far less
              often than the hero's would. preload="none": it is ~4800px down. */}
          <BackgroundVideo
            src="visualiser"
            poster="/images/visualiser-poster.webp"
            alt="A double-height living room finished in Kalinga Stone surfaces"
            loop
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal delay={200} className="mt-[47px] flex justify-center">
        <KsButton href={visualiser.cta.href} variant="ruby">
          {visualiser.cta.label}
        </KsButton>
      </Reveal>
    </section>
  );
}
