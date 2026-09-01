import Image from "next/image";
import { KalingaLogo } from "@/components/ui/kalinga-logo";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { hero } from "@/lib/content";

/**
 * Hero — Figma 544:4024 (plate), 544:4025 (bar), 544:4026 (scrim),
 * 544:4027 / 544:4028 / 544:4029 (content).
 *
 * Geometry, all rebased to the 1440 x 1071 section:
 *   plate      1440 x 1071, full bleed
 *   logo bar   409 x 58 at x516 y38 — bg rgba(248,246,243,0.14), radius 2
 *   scrim      y648 -> 1071 (423 tall), transparent -> #000, straight down
 *   headline   x80  y842, 493 wide, 2 lines, #F2F2F2 (not pure white)
 *   body       x900 y851, 460 wide
 *   button     x900 y925 -> 967.7
 *
 * The headline block ends at 968 and the button at 967.7, so the two columns
 * are bottom-aligned on 968 with 103px of plate below — they are NOT top
 * aligned, which is what the differing y values (842 vs 851) are telling you.
 *
 * The frame carries no nav links; the bar holds the lockup alone.
 */
export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-labelledby="hero-heading">
      {/* 1440 x 1071 -> the plate drives the section height at every width. */}
      <div className="relative aspect-[1440/1071] min-h-[620px] w-full">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-[ks-drift_18s_var(--ease-out-expo)_forwards] object-cover"
        />

        {/* 544:4026 — a straight transparent->black wash over the bottom 39.5%.
            Neutral black, not ink: a tinted scrim over photography casts a
            visible colour wash. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[39.5%]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), #000)" }}
        />

        <header className="absolute inset-x-0 top-[3.55%] z-20 flex justify-center">
          <div className="flex h-[58px] items-center rounded-[2px] bg-[rgba(248,246,243,0.14)] px-[39px] backdrop-blur-[2px]">
            <KalingaLogo className="scale-[0.62] sm:scale-75 lg:scale-100" />
          </div>
        </header>

        {/* Content sits on the section's own 80px gutter and bottom-aligns on
            y968 of 1071 => 9.62% from the base. */}
        <div className="absolute inset-x-0 bottom-[9.62%] z-10 px-6 lg:px-[80px]">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <h1 id="hero-heading" className="heading max-w-[493px] text-gray-6">
                {hero.headline}
              </h1>
            </Reveal>

            <Reveal delay={160} className="lg:pb-[0.3px]">
              <div className="max-w-[460px]">
                <p className="body-copy text-white">{hero.body}</p>
                <KsButton href={hero.cta.href} variant="outline" className="mt-[26px]">
                  {hero.cta.label}
                </KsButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
