import { KalingaMark } from "@/components/ui/kalinga-mark";
import { Reveal } from "@/components/ui/reveal";
import { intro } from "@/lib/content";

/**
 * Intro — Figma 544:3930 (headline), 544:3929 (body), 551:5480 (mark).
 *
 * Absolute y values, rebased to the section top at 892 (the hero's new base):
 *   headline  1129, 644 wide, 2 lines of 63.2  -> 237 below the hero
 *   body      1286, 539 wide, 4 lines of 24    -> 31 below the headline
 *   mark      1450, 28 x 28.577, ruby          -> 68 below the body
 *   section ends 1715                          -> 236 below the mark
 *
 * THIS SECTION ABSORBS THE HERO'S RESIZE. The hero went 1071 -> 892, but the
 * board did NOT pull the rest of the page up with it: collections still starts
 * at 1715 and every section below is untouched. The 179px lands here as
 * padding — 73 of it above the headline (164 -> 237) and the other 106 below
 * the mark (130 -> 236). Shrinking the hero without re-padding this section
 * drags all thirteen sections below it 179px too high.
 *
 * All three centre on x720: 398+322, 451+269.5, 706+14.
 */
export function Intro() {
  return (
    <section className="bg-white px-6 pt-[237px] pb-[236px] text-center">
      <Reveal as="h2" className="heading mx-auto max-w-[644px] text-ink">
        {intro.headline}
      </Reveal>

      <Reveal delay={120}>
        <p className="body-copy mx-auto mt-[31px] max-w-[539px] text-ink">{intro.body}</p>
      </Reveal>

      <Reveal delay={240}>
        <KalingaMark className="mx-auto mt-[68px] h-[28.577px] w-[28px] text-ruby" />
      </Reveal>
    </section>
  );
}
