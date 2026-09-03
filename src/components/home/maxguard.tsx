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
 *
 * THE BAND IS BACK TO ONE BUTTON, FOR NOW. The history, because this node keeps
 * moving and the next reader will otherwise re-derive it: the band once closed
 * on a "Download the App" label at x1020 with two 39px store marks at the
 * bottom right (721:30918, 721:30908, 721:30951 — all deleted). Those were
 * replaced by a second KS/Button, the white-outline variant, to the right of
 * the ruby one. That button, 998:37554, is STILL IN THE FILE but is no longer
 * in this band: it is parented to the "Homepage" SECTION rather than to the
 * "Home Page" frame, and its section coordinates are now x1359 y5794 — frame
 * x297 y5162, inside the visualiser plate (962:30520, y5058..5874), about 519px
 * below where it used to sit. It was not deleted, it was dragged onto the next
 * section.
 *
 * THE CLIENT HAS SAID IT IS COMING BACK — the board is simply not carrying it
 * yet. So this is a removal from the render only: `maxguard.appCta` stays in
 * content.ts, and the note on it in this file's git history has the exact
 * markup. Restoring it is putting the outline KS/Button back beside the ruby
 * one and returning the row to `flex flex-wrap gap-3 lg:flex-nowrap
 * lg:gap-[31.81px]`. The Play/App Store SVGs in `public/icons` stay
 * unreferenced either way — the board made it a button, not a label plus two
 * store marks, and that part has not been walked back.
 *
 * THE WHOLE TEXT COLUMN ROSE 29px. Headline 464 -> 435, body 521 -> 492, ruby
 * CTA 581 -> 552, one constant shift, and the left margin went 79/80 -> 80/81.
 * The block had to climb to open the room the second button now occupies.
 *
 * The 31.81px that used to separate the two buttons goes with the second one.
 * It is recorded here because it is the measurement, not a guess, and the
 * button is expected back: the ruby button closed at 265.19 and the outline one
 * opened at 297. Fixed px, because KS/Button is fixed px everywhere on this
 * page and does not scale with the plate. The ruby button has not moved — still
 * x81 y552, which rounds to the same 84.1221% the pair was laid out on.
 *
 * THE BODY IS WHITE NOW, not #eee — 721:30949 carries the shared "Body Copy"
 * style, White #FFFFFF.
 *
 * THE PLATE'S NODE BOX IS REAL, and the fill carries the crop rather than the
 * box: 721:30906 is 1472 wide at x-16, drawing the source at 149.82% of the
 * node's height with a top offset of -18.51%.
 *
 * THE CROP MOVED, and this is the change that makes the band look redesigned
 * even though not one asset in it was replaced. The window height is what it
 * always was — 1/1.4982 = 0.667468 of the source — but its START slid up the
 * source, from 0.238621 down it to 0.123534. As an object-position:
 *
 *   0.123534 / (1 - 0.667468) = 37.15%,  where it used to read 71.76%
 *
 * which lifts the whole kitchen and brings the ceiling into the top of the
 * band. The consequence worth remembering: the MaxGuard lockup at x56 y23 used
 * to sit over the middle of the garden window, bright and busy, and now sits on
 * plain wall. THE MARK ITSELF DID NOT CHANGE — 721:30950 still carries the same
 * "ChatGPT Image Jul 29, 2026, 12_06_06 PM 1" fill in the same box, and
 * 721:30919 is untouched too. Only the photograph behind them moved.
 *
 * Letting the image simply cover the band centres it, which is a third framing
 * again and matches neither.
 *
 * THERE ARE TWO SCRIMS, NOT ONE, AND ONE OF THEM IS FLIPPED. The band carries a
 * matched pair of 1459 x 327 rects sharing one 193.78deg axis:
 *
 *   721:30917  x  -9  y   1 .. 328   191.39deg  ends rgb(253,253,253)  scaleY(-1)
 *   721:30907  x -14  y 328 .. 655   193.78deg  ends rgb(20,16,14)
 *
 * The light half's numbers drifted with the recrop — angle 193.78 -> 191.39,
 * first stop 50.817% -> 48.543%, last 97.235% -> 107.81% (so the ramp is cut
 * off before it reaches full white), and its box from x-14 y-2 to x-9 y1.
 * Rendering the band both ways against the board's own export: the new numbers
 * land at a mean absolute error of 2.0/255 against 4.4 for the old ones, so
 * this is a real change and not export noise. The ink half is unchanged.
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

/**
 * MOBILE. The board has no phone artboard — every frame in the file is 1440 or
 * wider — so the small-screen layout below is authored, not transcribed.
 *
 * The desktop composition CANNOT survive a narrow viewport, and it is worth
 * being precise about why. `aspect-1440/655` on a 390px screen is a 177px band;
 * the headline, the body and two fixed-px buttons are all positioned inside it
 * as percentages of 655, so at 390 the copy clips to "LOREM" and both buttons
 * hang off the bottom-right corner. Scaling the type down further does not fix
 * it — the band itself is too short to hold three stacked blocks.
 *
 * So below `lg` the section stops being one aspect-locked plate and becomes two
 * things: a 4:3 image with the lockup and badge on it, then the copy and the
 * CTAs in normal flow underneath, on the section's own ink. The plate keeps a
 * bottom fade to ink so the two read as one band rather than a photo with a
 * caption bolted under it.
 *
 * The copy block is a CHILD OF THE SECTION, not of the plate, and goes
 * `lg:absolute lg:inset-0` — so on desktop it overlays the plate exactly as it
 * did before, and on mobile it simply flows. One DOM, no duplicated markup, and
 * in particular no second copy of the 1536x1024 photograph for a hidden branch
 * to download.
 *
 * The geometry therefore has to live in `lg:` CLASSES rather than the inline
 * `style` the desktop-only version used: an inline `width` applies at every
 * width, and Tailwind cannot see a class name built at runtime. The px -> %
 * conversions that the X()/Y() helpers used to do are spelled out here instead:
 *
 *   x  -16 -> -1.1111%    x   56 ->  3.8889%    x 1176 -> 81.6667%
 *   x  -14 -> -0.9722%    x   80 ->  5.5556%    x   81 ->  5.6250%
 *   w 1472 -> 102.2222%   w 1459 -> 101.3194%   w  487 -> 33.8194%
 *   w  197 ->  13.6806%   w 273.25 -> 18.9757%
 *   x   -9 ->  -0.6250%    y    1 ->  0.1527%    y   21 ->  3.2061%
 *   y   23 ->  3.5115%
 *   y  328 ->  50.0763%   y  435 -> 66.4122%    y  492 -> 75.1145%
 *   y  551 ->  84.1221%   h  327 -> 49.9237%
 */

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

/** 721:30917. 191.39deg flipped vertically — see the note above. */
const SCRIM_TOP =
  "linear-gradient(348.61deg, rgba(0,0,0,0) 48.543%, " +
  straight([7, 6, 5], 0.5, 67.363, [253, 253, 253], 1, 107.81, 12).join(", ") +
  ")";
/** 721:30907, exactly as exported. */
const SCRIM_BOTTOM =
  "linear-gradient(193.78deg, rgba(0,0,0,0) 50.817%, rgba(7,6,5,0.5) 67.361%, rgb(20,16,14) 97.235%)";

export function MaxGuard() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-label="MaxGuard">
      {/* PLATE. 4:3 on phones so the kitchen still reads as a room; the board's
          1440 x 655 from lg up. */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-1440/655">
        {/* 721:30906. The node is 1472 wide at x-16 and its fill is a 3:2 image
            drawn at 1472 x 981.4 with the top 234.2 cropped away, so on desktop
            the wrapper is the node box and object-position carries the crop. On
            mobile the box is taller than 3:2, so cover scales by height and the
            crop is horizontal — centring it keeps the couple in frame. */}
        <div className="absolute inset-y-0 left-0 w-full overflow-hidden lg:left-[-1.1111%] lg:w-[102.2222%]">
          <Image
            src="/images/maxguard-scene.webp"
            alt="A kitchen with MaxGuard-protected surfaces"
            fill
            sizes="(max-width: 1023px) 100vw, 103vw"
            className="object-cover object-[50%_50%] lg:object-[50%_37.15%]"
          />
        </div>

        {/* 721:30917 — the light half. Its box is the top one; the flip is
            already baked into the angle. Both scrims are solved against the 655
            band and mean nothing at another height, so they are desktop-only. */}
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            left: "-0.6250%",
            top: "0.1527%",
            width: "101.3194%",
            height: "49.9237%",
            background: SCRIM_TOP,
          }}
        />
        {/* 721:30907 — the ink half. */}
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            left: "-0.9722%",
            top: "50.0763%",
            width: "101.3194%",
            height: "49.9237%",
            background: SCRIM_BOTTOM,
          }}
        />

        {/* Mobile only: the plate has to hand off to the copy below it, so it
            fades into the section's own ink instead of ending on a hard edge. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,16,14,0) 0%, rgba(20,16,14,0.55) 55%, rgba(20,16,14,0.92) 85%, #14100e 100%)",
          }}
        />

        {/* 721:30950 */}
        <Image
          src="/images/maxguard-logo.webp"
          alt="MaxGuard — Building Trust. Delivering Value."
          width={546}
          height={119}
          sizes="(max-width: 1023px) 150px, 19vw"
          className="absolute top-5 left-6 h-auto w-[136px] sm:w-[168px] lg:top-[3.5115%] lg:left-[3.8889%] lg:w-[18.9757%]"
        />

        {/* 721:30919 */}
        <div className="absolute top-4 right-5 w-[84px] sm:w-[104px] lg:top-[3.2061%] lg:right-auto lg:left-[81.6667%] lg:w-[13.6806%]">
          <Reveal delay={200}>
            <Image
              src="/images/badge-warranty.webp"
              alt="Lifetime warranty — 99.9% bacteria-free surfaces"
              width={394}
              height={263}
              sizes="(max-width: 1023px) 104px, 14vw"
              className="h-auto w-full"
            />
          </Reveal>
        </div>
      </div>

      {/* COPY. Flows under the plate on mobile; overlays it from lg up, where
          `inset-0` makes this box the section and the children take the board's
          own percentages again. */}
      <div className="px-6 pt-7 pb-14 sm:px-8 lg:absolute lg:inset-0 lg:p-0">
        {/* 721:30948 and 721:30949 sit on their own node tops rather than being
            flowed one under the other: a Figma text box already includes its
            half-leading, so top-to-top is exact and needs no margin to guess
            at. Both take the body's 487 column — the headline measures 442 and
            sets on one line inside it. */}
        <div className="lg:absolute lg:top-[66.4122%] lg:left-[5.5556%] lg:w-[33.8194%]">
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

        <div className="mt-2.5 lg:absolute lg:mt-0 lg:top-[75.1145%] lg:left-[5.5556%] lg:w-[33.8194%]">
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

        {/* 721:30920, on its own again — see the note above. y552 rounds into
            the same 84.1221% the pair used, so the ruby button has not moved. */}
        <div className="mt-7 lg:absolute lg:mt-0 lg:top-[84.1221%] lg:left-[5.6250%]">
          <KsButton href={maxguard.cta.href} variant="ruby">
            {maxguard.cta.label}
          </KsButton>
        </div>
      </div>
    </section>
  );
}
