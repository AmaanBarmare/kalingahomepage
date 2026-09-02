import Image from "next/image";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { maxguard } from "@/lib/content";

/**
 * MaxGuard band — frame y4092 -> 4747, 655 tall. Every node is rebased to that
 * top and expressed as a percentage of the 1440 x 655 box, so the composition
 * scales as one piece.
 *
 *   721:30906  photo plate       x  -16  y   0    1472 x 655
 *   721:30917  scrim, light      x  -14  y  -2    1459 x 327   (flipped)
 *   721:30907  scrim, ink        x  -14  y 328    1459 x 327
 *   721:30950  MaxGuard lockup   x   56  y  23     273.25 x 59.17
 *   721:30919  warranty badge    x 1176  y  21     197 x 132
 *   721:30948  LOREM IPSUM       x   80  y 435     442 x 47
 *   721:30949  body              x   80  y 492     487 x 50
 *   721:30920  KS/Button ruby    x   81  y 552     184.19 x 42.69
 *   998:37554  KS/Button outline x  297  y 551     175.19 x 42.69
 *
 * THE APP ROW IS GONE AND IT DID NOT MOVE — IT WAS REPLACED. The board used to
 * close the band with a "Download the App" label at x1020 and two 39px store
 * marks at x1287.11 / x1339.11, all on the bottom right. Those three nodes
 * (721:30918, 721:30908, 721:30951) are deleted from the file. In their place
 * 998:37554 puts a SECOND KS/Button — the plain white-outline variant, label
 * "Download the app" — immediately to the right of the ruby one, so the band
 * now ends in a two-button row at the bottom left and nothing at all on the
 * bottom right. The Play/App Store SVGs in `public/icons` are now unreferenced.
 *
 * THAT SECOND BUTTON IS NOT INSIDE THE PAGE FRAME. 998:37554 is parented to the
 * "Homepage" SECTION, not to the "Home Page" frame that holds every other node
 * here, so it does not appear as a sibling of the band and a node-list walk of
 * the frame misses it entirely — it only shows up in a render, or in a scan
 * that leaves the frame. It is a layering slip in the board, not a signal; it
 * sits in the band, so it belongs to the band.
 *
 * THE WHOLE TEXT COLUMN ROSE 29px. Headline 464 -> 435, body 521 -> 492, ruby
 * CTA 581 -> 552, one constant shift, and the left margin went 79/80 -> 80/81.
 * The block had to climb to open the room the second button now occupies.
 *
 * The two buttons disagree about their own top by 1px (552 vs 551) at identical
 * heights, which is board noise rather than intent, so they are laid out as one
 * flex row on 551 instead of being placed apart and left 1px out of true. The
 * 31.81px between them is the real measurement: the ruby button closes at
 * 265.19 and the outline one opens at 297. It is a fixed px gap because
 * KS/Button is fixed px everywhere on this page — it does not scale with the
 * plate, so a percentage gap would drift away from the buttons it separates.
 *
 * THE BODY IS WHITE NOW, not #eee — 721:30949 carries the shared "Body Copy"
 * style, White #FFFFFF.
 *
 * THE PLATE'S NODE BOX IS REAL, and the fill carries the crop rather than the
 * box: 721:30906 is 1472 wide at x-16 with an IMAGE/CROP fill whose transform
 * is [[1,0,0],[0,0.667459,0.238621]] — a window 0.667459 of the source tall
 * starting 0.238621 down it. So the image draws at 1/0.667459 = 149.82% of the
 * node's height, offset -35.75%, which is an object-position of
 * 0.238621 / (1 - 0.667459) = 71.76%. Letting the image simply cover the band
 * instead centres it and moves every landmark up ~90px.
 *
 * THERE ARE TWO SCRIMS, NOT ONE, AND ONE OF THEM IS FLIPPED. The band carries a
 * matched pair of 1459 x 327 rects sharing one 193.78deg axis:
 *
 *   721:30917  y  -2 .. 325   ends rgb(253,253,253)   scaleY(-1)
 *   721:30907  y 328 .. 655   ends rgb(20,16,14)
 *
 * The vertical flip on the top one is the whole trick and it is invisible in a
 * node list — it lives in the relativeTransform as a -1 in the y row. Flipping
 * negates the axis's vertical component, so 193.78deg (down and slightly left)
 * becomes 346.22deg (UP and slightly left) — which is why a gradient whose box
 * sits in the top half puts its white end in the top-left CORNER. Figma renders
 * that corner at rgb(252,252,252); a single unflipped scrim renders it at
 * rgb(143,140,105), a clear window onto a garden, and that is the whole of the
 * difference. The ink half is the same either way.
 *
 * "Download the App" is a button label now, so the Halogen Bold 13.053 / +4.35
 * display setting that used to carry it as loose type is gone with the row.
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

export function MaxGuard() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-label="MaxGuard">
      <div className="relative aspect-1440/655 w-full">
        {/* The node is 1472 wide at x-16 and its fill is a 3:2 image drawn at
            1472 x 981.4 with the top 234.2 cropped away, so the wrapper is the
            node box and object-position carries the crop. */}
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

        {/* 721:30948 and 721:30949 are placed on their own node tops rather than
            flowed one under the other: a Figma text box already includes its
            half-leading, so top-to-top is exact and needs no margin to guess at.
            Both get the body's 487 column — the headline measures 442 and sets
            on one line inside it. */}
        <div className="absolute" style={{ left: X(80), top: Y(435), width: X(487) }}>
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
        </div>

        <div className="absolute" style={{ left: X(80), top: Y(492), width: X(487) }}>
          <Reveal delay={120}>
            <p
              className="font-body font-light text-white"
              style={{
                fontSize: `clamp(12px, ${VW(16)}, 16px)`,
                letterSpacing: `clamp(0.5px, ${VW(1)}, 1px)`,
                lineHeight: 1.5,
              }}
            >
              {maxguard.body}
            </p>
          </Reveal>
        </div>

        {/* 721:30920 + 998:37554 — see the note above for why these are one row
            on 551 and why the gap is fixed px rather than a percentage. */}
        <div
          className="absolute flex items-center"
          style={{ left: X(81), top: Y(551), gap: "31.81px" }}
        >
          <KsButton href={maxguard.cta.href} variant="ruby">
            {maxguard.cta.label}
          </KsButton>
          <KsButton href={maxguard.appCta.href} variant="outline">
            {maxguard.appCta.label}
          </KsButton>
        </div>
      </div>
    </section>
  );
}
