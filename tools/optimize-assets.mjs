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
 * Usage:  node tools/optimize-assets.mjs [--audit]
 */
import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
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

  // --- collections carousel (Component 102) ------------------------------
  // Figma renders one slide; the other four are the instance's own rawImages.
  { src: "comp102-01.png", out: "collection-quartz.webp", display: [1457, 1124], node: "544:4012" },
  { src: "comp102-03.png", out: "collection-marble.webp", display: [1457, 1124], node: "544:4012" },
  { src: "comp102-06.png", out: "collection-terrazzo.webp", display: [1457, 1124], node: "544:4012" },
  { src: "comp102-07.png", out: "collection-porcelain.webp", display: [1457, 1124], node: "544:4012" },
  { src: "comp102-10.png", out: "collection-onyx.webp", display: [1457, 1124], node: "544:4012" },

  // --- applications strip (544:3950) -------------------------------------
  // Figma draws 3 cards; the strip's rawImages carry 4 scenes + 1 material swatch.
  { src: "strip-11.png", out: "application-kitchen.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-12.png", out: "application-bathroom.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-18.png", out: "application-living.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-19.png", out: "application-lounge.webp", display: [445, 620], node: "544:3950" },
  { src: "strip-15.png", out: "application-swatch.webp", display: [140, 92], node: "544:3950" },

  // --- maxguard band ------------------------------------------------------
  { src: "mg-raw1.png", out: "maxguard-scene.webp", display: [1472, 655], node: "542:5281" },
  // alpha-bearing originals: the Figma `export` of each of these has WHITE
  // flattened behind it, which is invisible in Figma and wrong on the page.
  { src: "badge-warranty.png", out: "badge-warranty.webp", display: [197, 132], node: "542:5282", alpha: true },
  { src: "maxguard-raw2.png", out: "maxguard-logo.webp", display: [273, 59], node: "542:5283", alpha: true },

  // --- surface visualiser --------------------------------------------------
  { src: "vis-raw1.png", out: "visualiser.webp", display: [1449, 815], node: "544:4015" },

  // --- karigare collage (Component 101) ------------------------------------
  { src: "karigare-21.png", out: "karigare-1.webp", display: [520, 300], node: "544:4013" },
  { src: "karigare-24.png", out: "karigare-2.webp", display: [520, 300], node: "544:4013" },
  { src: "karigare-27.png", out: "karigare-3.webp", display: [520, 300], node: "544:4013" },
  { src: "karigare-28.png", out: "karigare-4.webp", display: [520, 300], node: "544:4013" },
  { src: "karigare-29.png", out: "karigare-5.webp", display: [520, 300], node: "544:4013" },
  { src: "karigare-31.png", out: "karigare-6.webp", display: [520, 300], node: "544:4013" },

  // --- testimonials (video poster frames) -----------------------------------
  { src: "testi-b1.png", out: "testimonial-1.webp", display: [321, 646], node: "544:3983" },
  { src: "testi-a3.png", out: "testimonial-2.webp", display: [321, 646], node: "544:3978" },
  { src: "testi-a1.png", out: "testimonial-3.webp", display: [321, 646], node: "544:3978" },
  { src: "testi-c1.png", out: "testimonial-4.webp", display: [321, 646], node: "544:3989" },

  // --- contact band ----------------------------------------------------------
  { src: "contact-raw1.png", out: "contact.webp", display: [1672, 640], node: "544:4017" },
];

async function build({ audit }) {
  await mkdir(OUT_DIR, { recursive: true });
  const rows = [];

  for (const p of PLATES) {
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
report(await build({ audit }));
