import { BackgroundVideo } from "@/components/ui/background-video";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { SiteNav } from "@/components/ui/site-nav";
import { hero } from "@/lib/content";

/**
 * Hero — Figma 544:4024 (clip), 544:4026 (scrim), 544:4027 / 4028 / 4029.
 *
 * The band was rebuilt: it is now **892 tall, not 1071**, and the floating
 * translucent logo bar is gone, replaced by the solid 90px navbar (709:6387).
 *
 * Geometry, rebased to the 1440 x 892 clip:
 *   clip       1440 x 892 at y0 — the navbar covers its top 90px
 *   scrim      x-8 y469, 1489 x 423 — transparent -> black, bottom-anchored,
 *              so 47.42% of the band (it was 39.5% at the old height)
 *   headline   x80  y702, 2 lines, #F2F2F2
 *   body       x900 y711, 460 wide
 *   button     x900 y785 -> 827.7
 *
 * The clip really is 892 tall with 90px of it hidden behind an opaque bar —
 * NOT an 802-tall clip below the bar. object-cover on 802 crops the frame
 * differently, which moves the horizon.
 *
 * Content bottom-aligns on y827.7 of 892, i.e. 7.21% up from the base. As
 * before the two columns are bottom-aligned, not top-aligned — that is what the
 * differing y values (702 vs 711) are saying.
 */
export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-labelledby="hero-heading">
      <div className="relative aspect-1440/892 min-h-130 w-full">
        <BackgroundVideo
          src="hero"
          poster="/images/hero-poster.webp"
          alt="Kalinga Stone marble across sculptural stairs, a kitchen, bath and bedroom"
          loop
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* 544:4026 — straight transparent->black over the bottom 47.4%.
            Neutral black, not ink: a tinted scrim over photography casts a
            visible colour wash. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[47.42%]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), #000)" }}
        />

        {/* The bar is opaque and sits ON the clip, hiding its first 90px. */}
        <SiteNav className="absolute inset-x-0 top-0 z-40" />

        <div className="absolute inset-x-0 bottom-[7.21%] z-10 px-6 lg:px-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <h1 id="hero-heading" className="heading max-w-123.25 text-gray-6">
                {hero.headline}
              </h1>
            </Reveal>

            <Reveal delay={160} className="lg:pb-[0.3px]">
              <div className="max-w-115">
                <p className="body-copy text-white">{hero.body}</p>
                <KsButton href={hero.cta.href} variant="outline" className="mt-6.5">
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
