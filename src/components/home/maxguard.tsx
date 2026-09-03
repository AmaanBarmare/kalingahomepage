import Image from "next/image";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { maxguard } from "@/lib/content";

/**
 * MaxGuard band — frame y4145 -> 4840, 695 tall. THE BAND MOVED AND GREW: it
 * used to open at y4092 and run 655. Every node is rebased to the new top and
 * expressed as a percentage of the 1440 x 695 box, so the composition scales as
 * one piece.
 *
 *   1264:46804  photo plate       x  -27  y   0      1483 x 695
 *   721:30917   scrim, light      x   -7  y   0      1695 x 304.53  (flipped)
 *   721:30907   scrim, ink        x  -12  y 475.36   1459 x 219.64
 *   1258:86037  lockup wordmark   x   57  y  40      273.25 x 59.17
 *   1258:86043  lockup tagline    x  190  y  79      123 x 12
 *   721:30919   warranty badge    x 1176  y  40      197 x 132
 *   721:30948   LOREM IPSUM       x   80  y 491      442 x 47
 *   721:30949   body              x   80  y 545      487 x 50
 *   721:30920   KS/Button ruby    x   81  y 605      184.19 x 42.69
 *   1264:46805  KS/Button outline x  284  y 606      175.19 x 42.69
 *
 * THE PHOTOGRAPH IS A NEW ONE — an evening kitchen on a marble waterfall
 * island, replacing the daylit one. The node is 1483 wide at x-27 with a fill
 * cropped to the bottom of a 3:2 source, but NONE OF THAT REACHES THIS FILE:
 * the asset shipped here is the client's own 1440 x 695 export, already cropped
 * to exactly the band. Measured against the board's render it lands at a mean
 * absolute error of 1.24/255 laid flat across the band, against 9.60 if it is
 * instead cover-fitted into the 1483-wide node box. The node's overhang is
 * already paid for inside the asset, so the plate is a plain `inset-0` cover.
 * DO NOT reintroduce the -27/1483 offsets; they would apply the crop twice.
 *
 * THE LOCKUP IS TWO NODES NOW, and the second is why the tagline is legible at
 * all. Both point at the same artwork. 1258:86037 is the wordmark (the source's
 * rows 305..695 of 871, full width). 1258:86043 draws the tagline strip AGAIN,
 * 123 x 12, exactly over the copy already inside the wordmark — and because
 * that tagline is semi-transparent in the source, drawing it twice doubles its
 * alpha and lifts "Building Trust. Delivering Value" from a grey that vanished
 * against the photograph to something reading as white. That is the whole of
 * the change, and it is invisible in a node list.
 *
 * Its window was derived, not searched: the strip sits at x190..313, y79..91 in
 * band coordinates, which maps back through the wordmark's own scale to source
 * x883..1693, y559..639. Verified against the board — the region's error drops
 * 8.57 -> 7.69 with the overlay, and a +/-8px search around the derivation
 * lands within one pixel of it.
 *
 * BOTH LOCKUP NODES FAIL TO EXPORT. Figma's asset endpoint returns a fully
 * transparent PNG for 1258:86037 and 1258:86043 (2121 bytes, alpha 0
 * everywhere), and its flattened `export` of the group lays opaque WHITE behind
 * a now-white tagline, erasing it. The assets here are cut instead from the raw
 * uploaded source that `download_assets` returns alongside those, which is
 * alpha-bearing at 1805 x 871. The tagline is cut from that same high-res
 * source rather than the 452 x 218 copy the board actually references: same
 * artwork, same measured error (7.69 vs 7.66 — noise), four times the pixels.
 *
 * THE APP BUTTON IS BACK, AND IT IS A DIFFERENT NODE. The history, because this
 * thing keeps moving: the band once closed on a "Download the App" label at
 * x1020 with two 39px store marks at the bottom right (721:30918, 721:30908,
 * 721:30951 — all deleted). Those became a second KS/Button, the white-outline
 * variant, beside the ruby one. That button was 998:37554, which then got
 * dragged out of the band onto the visualiser plate, and is now gone from the
 * file altogether. In its place 1264:46805 is a FRESH instance at section x1346
 * y5383 = frame x284 y4751, back inside this band.
 *
 * IT IS STILL NOT PARENTED TO THE PAGE FRAME. Like the one before it, it hangs
 * off the "Homepage" SECTION, so it is a sibling of nothing else here and a
 * walk of the frame misses it — it shows up only in a render, or in a scan that
 * leaves the frame. Treated as part of the band because that is where it draws.
 * The Play/App Store SVGs in `public/icons` stay unreferenced: the board made
 * this a button, not a label plus two store marks, and that has not been walked
 * back.
 *
 * THE WHOLE TEXT COLUMN ROSE 29px. Headline 464 -> 435, body 521 -> 492, ruby
 * CTA 581 -> 552, one constant shift, and the left margin went 79/80 -> 80/81.
 * The block had to climb to open the room the second button now occupies.
 *
 * THE GAP BETWEEN THEM NARROWED, 31.81px -> 18.81px: the ruby button still
 * closes at 265.19 and the outline one now opens at 284 rather than 297. It
 * stays a fixed px gap because KS/Button is fixed px everywhere on this page
 * and does not scale with the plate, so a percentage would drift away from the
 * buttons it separates.
 *
 * THE BODY IS WHITE NOW, not #eee — 721:30949 carries the shared "Body Copy"
 * style, White #FFFFFF.
 *
 * THE WARRANTY BADGE IS THE ONLY THING IN THIS BAND THAT DID NOT CHANGE.
 * 721:30919 carries the same fill at the same 197 x 132; only its y moved with
 * the band, 21 -> 40. Its asset is untouched.
 *
 * THERE ARE TWO SCRIMS, NOT ONE, AND ONE OF THEM IS FLIPPED. The band carries a
 * matched pair of 1459 x 327 rects sharing one 193.78deg axis:
 *
 *   721:30917  x  -7  y   0 .. 304.53   189.17deg  ends rgb(253,253,253)  flipped
 *   721:30907  x -12  y 475.36 .. 695   189.35deg  ends rgb(20,16,14)
 *
 * THEY NO LONGER MEET. Every previous version of this band butted the two
 * halves together at the midpoint — 327 + 327 against a 655 box. Now the light
 * one ends at 304.53 and the ink one does not begin until 475.36, so 170px, a
 * quarter of the band, carries no scrim at all and the photograph is left alone
 * through the middle. The light half also grew well past the frame, 1459 ->
 * 1695 wide, which is 117.7% of 1440.
 *
 * The angles moved with the recomposition (light 191.39 -> 189.17, ink
 * 193.78 -> 189.35). The colour stops on both are unchanged.
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
 *   x   -7 ->  -0.4861%   x   57 ->  3.9583%    x  190 -> 13.1944%
 *   x  -12 ->  -0.8333%   x   80 ->  5.5556%    x   81 ->  5.6250%
 *   x 1176 -> 81.6667%    w 1459 -> 101.3194%   w 1695 -> 117.7083%
 *   w  123 ->  8.5417%    w  197 ->  13.6806%   w  487 -> 33.8194%
 *   w 273.25 -> 18.9756%
 *   y   40 ->  5.7554%    y   79 -> 11.3669%    y 475.36 -> 68.3970%
 *   y  491 -> 70.6475%    y  545 -> 78.4173%    y  605 -> 87.0504%
 *   h 304.53 -> 43.8168%  h 219.64 -> 31.6030%
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

/** 721:30917. 189.17deg flipped vertically — see the note above. */
const SCRIM_TOP =
  "linear-gradient(350.825deg, rgba(0,0,0,0) 48.543%, " +
  straight([7, 6, 5], 0.5, 67.363, [253, 253, 253], 1, 107.81, 12).join(", ") +
  ")";
/** 721:30907, exactly as exported. */
const SCRIM_BOTTOM =
  "linear-gradient(189.35456deg, rgba(0,0,0,0) 50.817%, rgba(7,6,5,0.5) 67.361%, rgb(20,16,14) 97.235%)";

export function MaxGuard() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-label="MaxGuard">
      {/* PLATE. 4:3 on phones so the kitchen still reads as a room; the board's
          1440 x 695 from lg up. */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-1440/695">
        {/* 1264:46804. THE ASSET IS THE BAND, so there is no node box and no
            object-position here any more — see the note above. It fills the
            plate edge to edge and `cover` only ever has work to do below lg,
            where the box is taller than 2.07:1 and the crop goes horizontal;
            centring it there keeps the couple in frame. */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/maxguard-scene.webp"
            alt="A kitchen with MaxGuard-protected surfaces"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* 721:30917 — the light half. Its box is the top one; the flip is
            already baked into the angle. THE TWO NO LONGER MEET: the light half
            ends at 43.82% and the ink half does not begin until 68.40%, so a
            quarter of the band in the middle now carries no scrim at all. Both
            are solved against the 695 band and mean nothing at another height,
            so they stay desktop-only. */}
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            left: "-0.4861%",
            top: "0%",
            width: "117.7083%",
            height: "43.8168%",
            background: SCRIM_TOP,
          }}
        />
        {/* 721:30907 — the ink half. */}
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            left: "-0.8333%",
            top: "68.3970%",
            width: "101.3194%",
            height: "31.6030%",
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

        {/* 1258:86044 — the lockup is TWO nodes now, and the second one is
            the whole reason the tagline reads. See the note above. */}
        {/* 1258:86037 — the wordmark. */}
        <Image
          src="/images/maxguard-logo.webp"
          alt="MaxGuard — Building Trust. Delivering Value."
          width={819}
          height={177}
          sizes="(max-width: 1023px) 168px, 19vw"
          className="absolute top-5 left-6 h-auto w-[136px] sm:w-[168px] lg:top-[5.7554%] lg:left-[3.9583%] lg:w-[18.9756%]"
        />
        {/* 1258:86043 — the same tagline again, over its own copy. `alt=""`
            because the line above already carries it; this node adds opacity,
            not words. Its offsets are a fraction of the WORDMARK's width below
            lg, where the wordmark is a fixed px width rather than 18.9756vw:
            48.72% of it across, 65.98% down, at 45.01% of its width. */}
        <Image
          src="/images/maxguard-logo-tagline.webp"
          alt=""
          aria-hidden
          width={369}
          height={36}
          sizes="(max-width: 1023px) 76px, 9vw"
          className="absolute top-[calc(1.25rem+0.6598*136px)] left-[calc(1.5rem+0.4872*136px)] h-auto w-[61px] sm:top-[calc(1.25rem+0.6598*168px)] sm:left-[calc(1.5rem+0.4872*168px)] sm:w-[76px] lg:top-[11.3669%] lg:left-[13.1944%] lg:w-[8.5417%]"
        />

        {/* 721:30919 */}
        <div className="absolute top-4 right-5 w-[84px] sm:w-[104px] lg:top-[5.7554%] lg:right-auto lg:left-[81.6667%] lg:w-[13.6806%]">
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
        <div className="lg:absolute lg:top-[70.6475%] lg:left-[5.5556%] lg:w-[33.8194%]">
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

        <div className="mt-2.5 lg:absolute lg:mt-0 lg:top-[78.4173%] lg:left-[5.5556%] lg:w-[33.8194%]">
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

        {/* 721:30920 + 1264:46805 — the pair is back, on a NARROWER gap than
            the one it left on. See the note above. The two disagree about their
            own top by 1px (605 vs 606) at identical heights, which is board
            noise, so they are one flex row rather than two placed boxes left
            1px out of true. The pair measures 378px against a 390px phone, so
            below lg they are allowed to wrap rather than be shrunk to fit. */}
        <div className="mt-7 flex flex-wrap items-center gap-3 lg:absolute lg:mt-0 lg:top-[87.0504%] lg:left-[5.6250%] lg:flex-nowrap lg:gap-[18.81px]">
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
