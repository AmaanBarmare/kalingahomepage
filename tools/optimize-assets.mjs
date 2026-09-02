/**
 * Kalinga homepage — asset pipeline.
 *
 * Reads the raw Figma sources from RAW_DIR and writes optimised WebP masters to
 * public/images. Two rules this enforces, both of them lessons the Amaha build
 * paid for (see amahafigmapage.md, Parts 3 and 10):
 *
 *  1. NEVER upscale. Figma's `export` at scale 2 is a pure resample of the same
 *     source — it round-trips at 38-53 dB PSNR, i.e. it carries no detail above
 *     the source Nyquist. The target width here is capped at the source's own
 *     width, so a plate is never inflated to hit a round number.
 *  2. Target width is DERIVED (display box x 2), not a round constant. A plate
 *     that lands under 2x does so because the client's source is small, which is
 *     a request to make of the client, not a pipeline bug. `npm run assets:audit`
 *     reports the difference.
 *
 * Usage:  node tools/optimize-assets.mjs [--audit] [--collections|--testimonials]
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAW_DIR = process.env.RAW_DIR ?? path.resolve("assets-src");
const OUT_DIR = path.resolve("public/images");
const QUALITY = 90;

/**
 * `display` is the CSS box the plate occupies in the 1440px Figma frame.
 * Target width = display.w * 2, clamped to the source's native width.
 */
const PLATES = [
  // --- hero -------------------------------------------------------------
  { src: "hero-raw1.png", out: "hero.webp", display: [1440, 1071], node: "544:4024" },

  // --- homepage collections scroll story --------------------------------
  // These are the four user-supplied production plates. Keep their own native
  // crop and never upscale; the two larger sources are capped at a 2880px 2x
  // master and the two smaller sources remain at their full native width.
  // Quartz is Figma 759:9016, a loose plate parked off-canvas at x-1227 y39002
  // rather than placed in the home frame — it is the kitchen scene reshot, and
  // it replaces the Michelangelo slab that stood here. Its native 1672 x 941 is
  // BELOW the 2880 master (1.16x), which the audit flags; see README.
  { src: "quartz-kitchen.png", out: "collection-scroll-quartz.webp", display: [1440, 1000], group: "collections" },
  { src: "collections-scroll-marble.png", out: "collection-scroll-marble.webp", display: [1440, 1000], group: "collections" },
  { src: "collections-scroll-terrazzo.png", out: "collection-scroll-terrazzo.webp", display: [1440, 1000], group: "collections" },
  { src: "collections-scroll-porcelain.png", out: "collection-scroll-porcelain.webp", display: [1440, 1000], group: "collections" },

  // --- applications strip (544:3950) -------------------------------------
  // Figma draws 3 cards; the strip's rawImages carry 4 scenes + 1 material swatch.
  { src: "strip-11.png", out: "application-kitchen.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-12.png", out: "application-bathroom.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-18.png", out: "application-living.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-19.png", out: "application-lounge.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-15.png", out: "application-swatch.webp", display: [140, 92], node: "544:3950" },

  // --- maxguard band ------------------------------------------------------
  // 542:5281 sits at x-16 and is 1472 wide — it bleeds 16px past BOTH frame
  // edges — and its fill is a 3:2 image drawn at 1472 x 981.4 and cropped to the
  // band's 655, i.e. object-position 50% 71.76%. The display box is therefore
  // the IMAGE's box, 1472 x 981, not the band's.
  { src: "mg-scene.png", out: "maxguard-scene.webp", display: [1472, 981], node: "542:5281" },
  // alpha-bearing originals: the Figma `export` of each of these has WHITE
  // flattened behind it, which is invisible in Figma and wrong on the page.
  { src: "badge-warranty.png", out: "badge-warranty.webp", display: [197, 132], node: "542:5282", alpha: true },
  // Figma's four rawImages for 542:5283 are all the "Powered by MAXGUARD"
  // lockup; the plain mark the band actually uses exists ONLY as the flattened
  // export, so maxguard-lockup.png is that export with the white unmixed back
  // out to straight alpha (see the note in tools/unmix notes / DESIGN.md).
  { src: "maxguard-lockup.png", out: "maxguard-logo.webp", display: [273, 59], node: "542:5283", alpha: true },

  // --- surface visualiser --------------------------------------------------
  { src: "vis-raw1.png", out: "visualiser.webp", display: [1449, 815], node: "544:4015" },

  // --- karigear BASE / FORM columns ----------------------------------------
  // THREE per column now, not four. The board's window is 722 x 666, so the
  // pipeline wants 1444px of source.
  //
  // THESE SIX ARE UPSCALED, and that is deliberate rather than accidental. The
  // supplied files are ~620-626 wide — 0.86x, under even 1:1 — so they were
  // resampled to 1444 (Lanczos3, then a gentle unsharp to recover the acuity a
  // 2.3x interpolation costs) before being listed here. The untouched originals
  // sit in assets-src/karigear/originals/ so the real provenance is never lost.
  //
  // Be honest about what that buys: interpolation cannot add detail that was
  // never captured. What it does buy is control of the resample — a browser
  // scaling a 620px asset into a 722px box at 2x DPR does it with a cheap
  // filter and no sharpening, and that looks worse than doing it here once.
  // Replace these with true 1444px exports and the upscale step goes away.
  //
  // They arrive with an alpha channel, but it is fully opaque and libwebp drops
  // such a channel on its own — flattening first is measurably a no-op (100.0KB
  // either way), so there is nothing to do about it here.
  { src: "karigear/base-1-wave-panel.png",       out: "karigear-base-1.webp", display: [722, 666], group: "karigear" },
  { src: "karigear/base-2-textured-wall.png",    out: "karigear-base-2.webp", display: [722, 666], group: "karigear" },
  { src: "karigear/base-3-inlay-medallion.png",  out: "karigear-base-3.webp", display: [722, 666], group: "karigear" },
  { src: "karigear/form-1-terrazzo-table.png",   out: "karigear-form-1.webp", display: [722, 666], group: "karigear" },
  { src: "karigear/form-2-travertine-bench.png", out: "karigear-form-2.webp", display: [722, 666], group: "karigear" },
  { src: "karigear/form-3-marble-table.png",     out: "karigear-form-3.webp", display: [722, 666], group: "karigear" },

  // --- karigare collage (Component 101) ------------------------------------
  // Named layers in Figma's own child order, which is the z-order: 1 sits at the
  // back, 6 on top. Every plate is ~430 x 242 (16:9), so the display box is the
  // same for all six.
  { src: "kari-1-inlay.png", out: "karigare-1.webp", display: [430, 242], node: "233:1033" },
  { src: "kari-2-hydra.png", out: "karigare-2.webp", display: [432, 243], node: "233:1034" },
  { src: "kari-3-aug31.png", out: "karigare-3.webp", display: [431, 243], node: "233:1035" },
  { src: "kari-4-form2a.png", out: "karigare-4.webp", display: [430, 242], node: "233:1036" },
  { src: "kari-5-form2.png", out: "karigare-5.webp", display: [430, 242], node: "233:1037" },
  { src: "kari-6-form1.png", out: "karigare-6.webp", display: [431, 242], node: "233:1038" },

  // --- store badges (542:5285) ---------------------------------------------
  // One 894x150 plate holding both badges; the alpha-bearing original, since
  // Figma's export flattens white behind it.
  { src: "appbadge-1.png", out: "app-badges.webp", display: [248, 42], node: "542:5285", alpha: true },

  // --- testimonials (video poster frames) -----------------------------------
  { src: "testimonial-clean-1.png", out: "testimonial-clean-1.webp", display: [321, 646], group: "testimonials" },
  // Cards 2 and 4 are no longer poster frames — they are still lifes of the
  // work, and they get NEW FILENAMES rather than reusing the old ones. Next's
  // image optimizer caches on the request URL, not on the bytes behind it, and
  // it sends `Cache-Control: max-age=14400` to the browser on top of that. So
  // replacing a file in place leaves both caches serving the old picture for
  // hours while the surrounding code updates immediately — which reads exactly
  // like "the image didn't change". A new name is a new URL, and both caches
  // miss on it the first time.
  // -2 on the out name, and it is the cache rule above again. The Figma export
  // of this one carried a 1px PURE BLACK column at its right edge (x=321 of
  // 322); the 2x upsample smeared it and the unsharp threw a bright halo off
  // it, which rendered as a hairline down the right side of the card. The
  // source in assets-src is now rebuilt from originals/ with that column cropped
  // BEFORE the resample — cropping after would have kept the halo. Same picture,
  // different bytes, so it needs a URL both caches miss on.
  { src: "testimonial-work-sample-wall.png", out: "testimonial-work-sample-wall-2.webp", display: [321, 646], group: "testimonials" },
  { src: "testimonial-clean-3.png", out: "testimonial-clean-3.webp", display: [321, 646], group: "testimonials" },
  { src: "testimonial-work-drawing-desk.png", out: "testimonial-work-drawing-desk.webp", display: [321, 646], group: "testimonials" },

  // --- contact band ----------------------------------------------------------
  // 544:4018 replaced the old 1672-wide bleed plate with a 1440 x 640 image
  // sitting flush in the frame, so the display box is the frame width now. The
  // source is exactly 1440 wide, i.e. 1x — see README, Outstanding.
  // New plate, and a NEW FILENAME with it — same reason as the testimonial
  // cards: replacing bytes at a path the optimizer has already cached leaves
  // the old picture on screen for hours. Supplied at 1440x640, i.e. 1x for a
  // full-width band, so it is upscaled to the 2880 the box wants; the untouched
  // original is in assets-src/originals/.
  { src: "contact-lounge.png", out: "contact-lounge.webp", display: [1440, 640], node: "544:4018" },

  // --- nav menu overlay, Engineered Surfaces thumbnails (1076:49128) ---------
  // Five 167.88 x 87.34 cards in the expanded accordion row. The display box is
  // the card, so the 2x target is 336 — every source clears it comfortably and
  // the cap in build() does the rest. Elixir's card is drawn 169 x 90 rather
  // than 167.88 x 87.34; the 1px is not worth a second display box.
  { src: "menu-elixir.png", out: "menu-elixir.webp", display: [169, 90], group: "menu", node: "1096:53019" },
  { src: "menu-quartz.png", out: "menu-quartz.webp", display: [168, 88], group: "menu", node: "1076:49129" },
  { src: "menu-marble.png", out: "menu-marble.webp", display: [168, 88], group: "menu", node: "1076:49135" },
  { src: "menu-terazzo.png", out: "menu-terazzo.webp", display: [168, 88], group: "menu", node: "1076:49141" },
  { src: "menu-porcelain.png", out: "menu-porcelain.webp", display: [168, 88], group: "menu", node: "1076:49147" },
];

async function build({ audit, plates = PLATES }) {
  await mkdir(OUT_DIR, { recursive: true });
  const rows = [];

  for (const p of plates) {
    const srcPath = path.join(RAW_DIR, p.src);
    if (!existsSync(srcPath)) {
      rows.push({ ...p, error: "MISSING SOURCE" });
      continue;
    }
    const meta = await sharp(srcPath).metadata();
    const wanted = p.display[0] * 2;
    const width = Math.min(wanted, meta.width); // rule 1: never upscale
    const outPath = path.join(OUT_DIR, p.out);

    if (!audit) {
      await sharp(srcPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, alphaQuality: 100, effort: 6 })
        .toFile(outPath);
    }

    const bytes = existsSync(outPath) ? (await stat(outPath)).size : 0;
    rows.push({
      ...p,
      srcW: meta.width,
      srcH: meta.height,
      width,
      wanted,
      dpr: meta.width / p.display[0],
      bytes,
    });
  }
  return rows;
}

function report(rows) {
  console.log(
    `${"plate".padEnd(28)}${"source".padEnd(12)}${"out".padEnd(11)}${"DPR".padStart(6)}${"KB".padStart(9)}  note`,
  );
  let short = 0;
  let total = 0;
  for (const r of rows) {
    if (r.error) {
      console.log(`${r.out.padEnd(28)}${"-".padEnd(12)}${"-".padEnd(11)}${"-".padStart(6)}${"-".padStart(9)}  ${r.error}`);
      continue;
    }
    total += r.bytes;
    const under = r.dpr < 2;
    if (under) short++;
    const note = under
      ? `source-limited (client asset is ${r.dpr.toFixed(2)}x, needs ${r.wanted}px)`
      : "ok";
    console.log(
      `${r.out.padEnd(28)}${`${r.srcW}x${r.srcH}`.padEnd(12)}${String(r.width).padEnd(11)}${r.dpr.toFixed(2).padStart(6)}${(r.bytes / 1024).toFixed(0).padStart(9)}  ${note}`,
    );
  }
  console.log(
    `\n${rows.length} plates, ${(total / 1024 / 1024).toFixed(2)} MB total. ` +
      `${short} below 2x DPR — limited by the supplied source, not by this pipeline.`,
  );
}

const audit = process.argv.includes("--audit");
/** `--group=<name>` rebuilds one group; --collections / --testimonials are the
    two that predate it and still work. Without one, everything is rebuilt. */
const groupFlag = process.argv.find((a) => a.startsWith("--group="));
const requestedGroup = groupFlag
  ? groupFlag.slice("--group=".length)
  : process.argv.includes("--collections")
    ? "collections"
    : process.argv.includes("--testimonials")
      ? "testimonials"
      : null;
const plates = requestedGroup ? PLATES.filter((plate) => plate.group === requestedGroup) : PLATES;
report(await build({ audit, plates }));
