import { KalingaMark } from "@/components/ui/kalinga-mark";
import { Reveal } from "@/components/ui/reveal";
import { intro } from "@/lib/content";

/**
 * Intro — Figma 544:3930 (headline), 544:3929 (body), 551:5480 (mark).
 *
 * Absolute y values, rebased to the section top at 1071 (the hero's base):
 *   headline  1235, 644 wide, 2 lines of 63.2  -> 164 below the hero
 *   body      1392, 539 wide, 4 lines of 24    -> 31 below the headline
 *   mark      1556, 28 x 28.577, ruby          -> 68 below the body
 *   section ends 1715                          -> 130 below the mark
 *
 * All three centre on x720: 398+322, 451+269.5, 706+14.
 */
export function Intro() {
  return (
    <section className="bg-white px-6 pt-[164px] pb-[130px] text-center">
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
