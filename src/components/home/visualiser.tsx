import { BackgroundVideo } from "@/components/ui/background-video";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { visualiser } from "@/lib/content";

/**
 * Surface visualiser — Figma 721:29297 (heading), 779:10243 (plate),
 * 721:29307 (CTA).
 *
 *   heading  y4894, the standard 599-wide centred block, ends 5015.5
 *   plate    x-5 y5037, 1450 x 815 — ends 5852
 *   CTA      x624 y5748, 192.19 x 42.69, ruby fill (Figma's Style=Primary)
 *
 * THE CTA IS ON THE PLATE, NOT UNDER IT. y5748 sits 711 into an 815-tall plate
 * that runs to 5852 — the button's base clears the video's by 61.3px. It used
 * to be laid out as a third block below the plate on a 47px margin, which put
 * it 179px too low and made the whole section 118px taller than the board.
 * Because it overlaps, it is positioned against the plate's own box: the plate
 * has a fixed aspect so it scales with the viewport, and a percentage offset
 * scales with it. Anchored to the BASE (7.5215% = 61.3/815) rather than the
 * top, so the button keeps its distance from the edge it reads against.
 *
 * The gap under the heading is 21.5 (5037 - 5015.5), not the 49.5 it was: the
 * board moved this plate up from y5065 when it moved the CTA.
 *
 * This is the page's only filled button. Every other CTA is an outline.
 */
export function Visualiser() {
  return (
    <section className="bg-white pt-[147px]" aria-labelledby="visualiser-heading">
      <SectionHeading title={visualiser.headline} body={visualiser.body} />

      <Reveal delay={140}>
        <div
          id="visualiser-plate"
          className="relative mt-[23.3px] aspect-[1440/815] w-full overflow-hidden bg-placeholder"
        >
          {/* The source is trimmed and folded by the video pipeline so its
              surface-swap sequence loops without a frozen tail or hard cut.
              preload="none": it is ~4800px down the page. */}
          <BackgroundVideo
            src="visualiser"
            poster="/images/visualiser-poster.webp"
            alt="A double-height living room finished in Kalinga Stone surfaces"
            loop
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-[7.5215%] flex justify-center">
            <KsButton href={visualiser.cta.href} variant="ruby">
              {visualiser.cta.label}
            </KsButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
