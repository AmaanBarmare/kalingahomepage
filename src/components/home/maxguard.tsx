import Image from "next/image";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { maxguard } from "@/lib/content";

/**
 * MaxGuard band — y4092 -> 4747, 655 tall. Every node is rebased to that top and
 * expressed as a percentage of the 1440 x 655 box, so the composition scales as
 * one piece.
 *
 *   542:5281  scene            x    0  y   0    1440 x 655
 *   551:5470  scrim            x   -3  y 328    1459 x 327
 *   665:15196 scrim            x   -3  y 325    1459 x 327
 *   542:5283  MaxGuard lockup  x   56  y  23     273.25 x 59.17
 *   542:5282  warranty badge   x 1176  y  21     197 x 132
 *   665:15191 LOREM IPSUM      x   79  y 464     442 x 47
 *   665:15192 body             x   79  y 521     487 x 50
 *   542:5284  Download the App x   80.9 y 580.85 251 x 21
 *   665:15367 google play      x  348  y 571      39 x 39
 *   665:15352 app store        x  400  y 571      39 x 39
 *   542:5290  KS/Button        x 1165  y 562     184.19 x 42.69
 *
 * REBUILT. The board dropped the whole two-layer composition this used to be:
 * there is no ghost headline any more, and no cutout of the couple laid back
 * over it, so `maxguard-foreground.webp` and the `ghost` copy are gone with
 * them. The lockup moved from the bottom left to the top left, the CTA moved
 * from the middle to the bottom right and became the ruby Style=Primary, and a
 * real headline and body arrived where the ghost type used to be.
 *
 * THE PLATE'S NODE BOX LIES. 542:5281 reports x-16 and width 1472, which reads
 * like a 16px bleed on each edge — but Figma CROPS the fill to the frame rather
 * than scaling into that box, and matching a clean background patch against the
 * board's own render gives scale 1.000 at offset (0,0), r = 0.998. The scene is
 * 1:1 across 1440; scaling it to 1472 zooms the kitchen ~2%.
 *
 * THE SCRIM IS DIAGONAL, and that is not guessable from the node list — the two
 * rects are plain boxes over the bottom half. Dividing the board's render by the
 * untouched source gives the alpha per tile, and the map is not horizontal: at
 * y550 it runs 0.74 at the left edge and 0.02 at the right. A plane fit puts the
 * axis at 193.2deg, within 3deg of the contact band's own 195.8deg, and along
 * that axis the profile is clean and monotone — flat zero from 22% to 68%, then
 * the ramp below. The stops are those measurements.
 *
 * "Download the App" is Halogen **Bold** 13.053 / +4.3511 (542:5284) — the
 * display face, a heavier weight than it looks, and much wider tracking. It is
 * white now that it sits on the scrim rather than on the lockup's light plate.
 *
 * The badge and lockup are alpha-bearing originals. Figma's own `export` of each
 * flattens opaque white behind it, invisible in Figma (they sit on white there)
 * and a white box over the photograph here.
 */

const PCT = (v: number, total: number) => `${(v / total) * 100}%`;
const X = (v: number) => PCT(v, 1440);
const Y = (v: number) => PCT(v, 655);
/** px in the 1440 frame -> vw, so type scales with the plate like the images do */
const VW = (px: number) => `${((px / 1440) * 100).toFixed(5)}vw`;

/** Solved off the board: 193.2deg, flat to 68%, then the measured ramp. */
const SCRIM =
  "linear-gradient(193.2deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 67.5%, rgba(0,0,0,0.24) 72.5%, " +
  "rgba(0,0,0,0.45) 77.5%, rgba(0,0,0,0.57) 82.5%, rgba(0,0,0,0.68) 87.5%, " +
  "rgba(0,0,0,0.78) 92.5%, rgba(0,0,0,0.90) 100%)";

const STORE_ICONS = ["/icons/google-play.svg", "/icons/app-store.svg"];

export function MaxGuard() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-label="MaxGuard">
      <div className="relative aspect-1440/655 w-full">
        {/* The node is 1472 wide at x-16 and its fill is a 3:2 image drawn at
            1472 x 981.4 with the top 234.2 cropped away, so the wrapper is the
            node box and object-position carries the crop: 234.2 / (981.4 - 655)
            = 71.76%. Letting the image simply cover the band instead centres it
            and moves every landmark up ~90px. */}
        <div
          className="absolute inset-y-0 overflow-hidden"
          style={{ left: X(-16), width: X(1472) }}
        >
          <Image
            src="/images/maxguard-scene.webp"
            alt="A kitchen with MaxGuard-protected surfaces"
            fill
            sizes="103vw"
            className="object-cover"
            style={{ objectPosition: "50% 71.76%" }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} />

        <Image
          src="/images/maxguard-logo.webp"
          alt="MaxGuard — Building Trust. Delivering Value."
          width={546}
          height={119}
          sizes="19vw"
          className="absolute"
          style={{ left: X(56), top: Y(23), width: X(273.25), height: "auto" }}
        />

        <div className="absolute" style={{ left: X(1176), top: Y(21), width: X(197) }}>
          <Reveal delay={200}>
            <Image
              src="/images/badge-warranty.webp"
              alt="Lifetime warranty — 99.9% bacteria-free surfaces"
              width={394}
              height={263}
              sizes="14vw"
              className="h-auto w-full"
            />
          </Reveal>
        </div>

        <div className="absolute" style={{ left: X(79), top: Y(464), width: X(487) }}>
          <Reveal>
            <h2
              className="font-display font-medium text-white uppercase"
              style={{
                fontSize: `clamp(19px, ${VW(30)}, 30px)`,
                letterSpacing: `clamp(3px, ${VW(5)}, 5px)`,
                lineHeight: 1.58,
              }}
            >
              {maxguard.headline}
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p
              className="font-body font-light text-[#eee]"
              style={{
                marginTop: Y(12.2),
                fontSize: `clamp(12px, ${VW(16)}, 16px)`,
                letterSpacing: `clamp(0.5px, ${VW(1)}, 1px)`,
                lineHeight: 1.5,
              }}
            >
              {maxguard.body}
            </p>
          </Reveal>
        </div>

        <p
          className="absolute font-display font-bold whitespace-nowrap text-white uppercase"
          style={{
            left: X(80.89),
            top: Y(580.85),
            fontSize: `clamp(9px, ${VW(13.053)}, 13.053px)`,
            letterSpacing: `clamp(1.5px, ${VW(4.3511)}, 4.3511px)`,
            lineHeight: 1.58,
          }}
        >
          {maxguard.appPrompt}
        </p>

        {/* Two separate 39 x 39 marks on a 52px pitch — 665:15367 and 665:15352,
            not the single flattened strip the board used to carry. */}
        {maxguard.stores.map((store, i) => (
          <a
            key={store.label}
            href={store.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={store.label}
            className="absolute transition-opacity hover:opacity-80"
            style={{ left: X(348 + i * 52), top: Y(571), width: X(39), height: Y(39) }}
          >
            <Image src={STORE_ICONS[i]} alt="" width={39} height={39} className="h-full w-full" />
          </a>
        ))}

        <div className="absolute" style={{ left: X(1165), top: Y(562) }}>
          <KsButton href={maxguard.cta.href} variant="ruby">
            {maxguard.cta.label}
          </KsButton>
        </div>
      </div>
    </section>
  );
}
