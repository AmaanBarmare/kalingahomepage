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
 *   721:30918  Download the App x 1020    y 584.85  251 x 21
 *   721:30908  google play      x 1287.11 y 575      39 x 39
 *   721:30951  app store        x 1339.11 y 575      39 x 39
 *   721:30920  KS/Button        x   80    y 581     184.19 x 42.69
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
 * THERE ARE TWO SCRIMS, NOT ONE, AND ONE OF THEM IS FLIPPED. 906:32016 carries
 * a matched pair of 1459 x 327 rects sharing one 193.78deg axis:
 *
 *   721:30917  y  -2 .. 325   ends rgb(253,253,253)   scaleY(-1)
 *   721:30907  y 328 .. 655   ends rgb(20,16,14)
 *
 * The vertical flip on the top one is the whole trick and it is invisible in a
 * node list. Flipping negates the axis's vertical component, so 193.78deg (down
 * and slightly left) becomes 346.22deg (UP and slightly left) — which is why a
 * gradient whose box sits in the top half puts its white end in the top-left
 * CORNER. Figma renders that corner at rgb(252,252,252); this used to render it
 * at rgb(143,140,105), a clear window onto a garden, and that was the whole of
 * the mismatch. The ink half was already right.
 *
 * Both are Figma's literal values now, on Figma's literal boxes, rather than the
 * single full-bleed gradient this used to solve for by dividing the board's
 * render by the untouched source. That fit was good — it reproduced the bottom
 * half to under one 8-bit level — but it could only ever find what it was
 * looking for, and it was not looking for a second layer above the fold.
 *
 * "Download the App" is Halogen **Bold** 13.053 / +4.3511 (542:5284) — the
 * display face, a heavier weight than it looks, and much wider tracking. It is
 * white now that it sits on the scrim rather than on the lockup's light plate.
 *
 * THE TWO BOTTOM BLOCKS TRADED SIDES. The board moved the CTA from the bottom
 * right to the bottom left and sent the app row the other way; everything above
 * them — lockup, badge, headline, body — measures unchanged.
 *
 * THE CTA ALSO DROPPED 19px, 562 -> 581, and that is not decoration. The body it
 * now sits beneath runs 521..571, so at its old height the button overlapped the
 * last line of copy. On the right, where it used to live, there was nothing
 * under it and the number never had to mean anything. Moving a block sideways
 * moved it into a column that was already occupied.
 *
 * The app row went the other way and down 4. Its right edge lands on 1378.11 —
 * not the 80px margin, not the badge's edge, nothing derivable; it is just where
 * the board puts it.
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

/**
 * FIGMA AND CSS INTERPOLATE GRADIENTS DIFFERENTLY, and pasting Figma's exported
 * stops verbatim gets the light scrim visibly wrong. Figma ramps colour and
 * alpha INDEPENDENTLY; CSS ramps them PREMULTIPLIED. Across the light scrim's
 * second segment — rgba(7,6,5,0.5) to opaque rgb(253,253,253), 246 levels of
 * colour while alpha only doubles — premultiplication drives the colour to white
 * far too early: measured against the board, the layer crossed from darkening to
 * lightening at 76% of the axis where Figma crosses at 83%.
 *
 * Solving the board's render for the layer it is actually compositing (per 8px
 * block, least squares for one alpha and one colour per 2.5% band of the axis)
 * gives a clean straight line — alpha 0 -> 1, colour 21, 42, 62, 83, 103, 124,
 * 144, 165, 185, 206, 225 — Figma's own linear ramp, sampled.
 *
 * So the segment is emitted as explicit sub-stops off that straight ramp. Inside
 * each 2.5% step CSS still premultiplies, but over ~20 levels of colour instead
 * of 246, which is a rounding error. The ink scrim needs none of this: its
 * colours are 0 -> 7 -> 20, so the two interpolations cannot meaningfully differ,
 * and it measured correct as the plain two-stop export.
 */
function straight(
  from: [number, number, number],
  fromA: number,
  fromPos: number,
  to: [number, number, number],
  toA: number,
  toPos: number,
  steps: number,
) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const u = i / steps;
    const [r, g, b] = from.map((v, k) => Math.round(v + u * (to[k] - v)));
    const a = +(fromA + u * (toA - fromA)).toFixed(4);
    return `rgba(${r},${g},${b},${a}) ${(fromPos + u * (toPos - fromPos)).toFixed(3)}%`;
  });
}

/** 721:30917. 193.78deg flipped vertically — see the note above. */
const SCRIM_TOP =
  "linear-gradient(346.22deg, rgba(0,0,0,0) 50.817%, " +
  straight([7, 6, 5], 0.5, 67.361, [253, 253, 253], 1, 97.235, 12).join(", ") +
  ")";
/** 721:30907, exactly as exported. */
const SCRIM_BOTTOM =
  "linear-gradient(193.78deg, rgba(0,0,0,0) 50.817%, rgba(7,6,5,0.5) 67.361%, rgb(20,16,14) 97.235%)";

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

        {/* 721:30917 — the light half. Its box is the top one; the flip is
            already baked into the angle. */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: X(-14),
            top: Y(-2),
            width: X(1459),
            height: Y(327),
            background: SCRIM_TOP,
          }}
        />
        {/* 721:30907 — the ink half. */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: X(-14),
            top: Y(328),
            width: X(1459),
            height: Y(327),
            background: SCRIM_BOTTOM,
          }}
        />

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
            left: X(1020),
            top: Y(584.85),
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
            style={{ left: X(1287.11 + i * 52), top: Y(575), width: X(39), height: Y(39) }}
          >
            <Image src={STORE_ICONS[i]} alt="" width={39} height={39} className="h-full w-full" />
          </a>
        ))}

        <div className="absolute" style={{ left: X(80), top: Y(581) }}>
          <KsButton href={maxguard.cta.href} variant="ruby">
            {maxguard.cta.label}
          </KsButton>
        </div>
      </div>
    </section>
  );
}
