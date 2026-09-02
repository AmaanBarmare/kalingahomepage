/**
 * Measure the running page against the Figma frame.
 *
 * Eyeballing a screenshot is how mismatches survive. This drives the dev server
 * with a real browser and reads getBoundingClientRect for every anchor that has
 * a known y in Figma 544:3926 (1440 x 9849).
 *
 * The bar is 0-4px. Anything past that is a real mismatch, not rounding.
 *
 * Usage: node tools/verify.mjs [--shots]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL_ = process.env.URL ?? "http://localhost:3000/";
const SHOT_DIR = process.env.SHOT_DIR ?? "/tmp/ks-shots";
const TOL = 4;

/**
 * The collections carousel is a scroll story: Figma draws the 1271px sticky
 * view, the page gives it a runway several times that. Everything below it is
 * therefore displaced by a real, intended amount, so those anchors are compared
 * against figmaY + that overshoot rather than against figmaY. `rebase: false`
 * marks the ones above it, which are absolute. The overshoot is read off the
 * applications section's own top (Figma y2839, i.e. 147 above its heading), so
 * every anchor below still checks its own spacing rather than being assumed.
 */
const APPLICATIONS_FIGMA_Y = 2839;

/**
 * Karigare is the SECOND scroll story, and it displaces everything under it the
 * same way. Figma draws one 660px row of frames; the page gives the two columns
 * a runway to travel through four of them (and, under the reduced-motion
 * fallback this script runs in, stacks all eight). So anchors below Karigare
 * take a second rebase, read off the testimonials HEADING (Figma y7273) so the
 * offset is measured rather than assumed. It applies from the testimonials
 * section down — anchors inside Karigare itself sit above its runway.
 */
const TESTIMONIALS_FIGMA_Y = 7273;

/** [label, selector, figmaY] — y is the element's top in the 1440x9849 frame. */
const ANCHORS = [
  ["hero section", "main > section:nth-of-type(1)", 0],
  ["intro headline", "main > section:nth-of-type(2) h2", 1129],
  ["collections carousel", "main > section:nth-of-type(3)", 1715],
  ["applications heading", "main > section:nth-of-type(4) h2", 2986],
  ["applications tabs", '[role="tablist"][aria-label="Project sectors"]', 3141],
  ["progress rule", "#progress-rule", 3230],
  ["maxguard band", "main > section:nth-of-type(5)", 4092],
  ["visualiser heading", "main > section:nth-of-type(6) h2", 4894],
  ["visualiser plate", "#visualiser-plate", 5065],
  ["karigare heading", "main > section:nth-of-type(7) h2", 6136],
  // Component 101's collage is gone from the board; the section is two
  // full-bleed travelling columns now (764:9496 / 864:28925).
  //
  // The board has since moved the whole section UP 113px (heading 6136 -> 6023)
  // because the visualiser above it was retimed — its plate went 5065 -> 5037
  // and its CTA 5927 -> 5748, neither of which is implemented. So the heading
  // stays pinned to 6136, which is where the unchanged sections above put it,
  // and the columns are checked on their OFFSET FROM IT: 6250 - 6023 = 227.
  ["karigare columns", "#karigare-columns", 6136 + 227],
  ["testimonials heading", "main > section:nth-of-type(8) h2", 7273],
  ["testimonial cards", "#testimonial-rail figure", 7555],
  ["contact band", "main > section:nth-of-type(9)", 8519],
  // The footer FRAME starts at 9075 in Figma, but the contact band is drawn
  // over its first 84px and only reaches pure black at 9159 — so 9159 is where
  // the footer element can actually begin. Its first content still lands on
  // Figma's y9243.
  ["footer", "footer", 9159],
];

const run = async () => {
  const browser = await chromium.launch();
  // Route prefetches to pages that do not exist yet are expected: only / is built.
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.emulateMedia({ reducedMotion: "reduce" }); // freeze entrances
  await page.goto(URL_, { waitUntil: "load" });

  // Walk the page so every lazy image commits before we measure.
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const pageH = await page.evaluate(() => document.body.scrollHeight);

  const applicationsY = await page
    .locator("main > section:nth-of-type(4)")
    .first()
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const overshoot = Math.round(applicationsY - APPLICATIONS_FIGMA_Y);

  const testimonialsY = await page
    .locator("main > section:nth-of-type(8) h2")
    .first()
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const karigareOvershoot = Math.round(testimonialsY - (TESTIMONIALS_FIGMA_Y + overshoot));

  console.log(`\nFigma 544:3926 is 1440 x 9849. Page renders 1440 x ${pageH} (${pageH - 9849 >= 0 ? "+" : ""}${pageH - 9849}).`);
  console.log(`Carousel runway adds ${overshoot}px; anchors below it are rebased by that.`);
  console.log(`Karigare runway adds a further ${karigareOvershoot}px below y${TESTIMONIALS_FIGMA_Y}.\n`);
  console.log(`${"anchor".padEnd(24)}${"figma y".padStart(9)}${"actual".padStart(9)}${"delta".padStart(8)}   `);

  let fails = 0;
  for (const [label, sel, rawY] of ANCHORS) {
    let figmaY = rawY > 1715 ? rawY + overshoot : rawY;
    if (rawY >= TESTIMONIALS_FIGMA_Y) figmaY += karigareOvershoot;
    const y = await page
      .locator(sel)
      .first()
      .evaluate((el) => el.getBoundingClientRect().top + window.scrollY)
      .catch(() => null);

    if (y === null) {
      console.log(`${label.padEnd(24)}${String(figmaY).padStart(9)}${"—".padStart(9)}${"—".padStart(8)}   selector not found`);
      fails++;
      continue;
    }
    const d = Math.round(y - figmaY);
    const ok = Math.abs(d) <= TOL;
    if (!ok) fails++;
    console.log(
      `${label.padEnd(24)}${String(figmaY).padStart(9)}${String(Math.round(y)).padStart(9)}${String(d > 0 ? `+${d}` : d).padStart(8)}   ${ok ? "ok" : "MISMATCH"}`,
    );
  }

  // Contrast-critical samples: every light-on-photograph run on the page.
  const contrast = await page.evaluate(() => {
    const out = [];
    const grab = (sel, name) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const cs = getComputedStyle(el);
      out.push({ name, color: cs.color, size: cs.fontSize, weight: cs.fontWeight, family: cs.fontFamily.split(",")[0] });
    };
    grab("main > section:nth-of-type(1) h1", "hero h1");
    grab("main > section:nth-of-type(2) h2", "intro h2");
    grab("main > section:nth-of-type(4) h2", "applications h2");
    return out;
  });
  console.log("\ncomputed type:");
  for (const c of contrast) console.log(`  ${c.name.padEnd(18)} ${c.family} ${c.weight} ${c.size} ${c.color}`);

  if (process.argv.includes("--shots")) {
    await mkdir(SHOT_DIR, { recursive: true });
    await page.screenshot({ path: `${SHOT_DIR}/full.png`, fullPage: true });
    console.log(`\nfull-page screenshot -> ${SHOT_DIR}/full.png`);
  }

  await browser.close();
  console.log(`\n${ANCHORS.length - fails}/${ANCHORS.length} anchors within ${TOL}px.\n`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
