# Kalinga Stone — homepage

The Kalinga Stone homepage, built from Figma
[`5SkKc300bE566PF5ltUzqi`](https://www.figma.com/design/5SkKc300bE566PF5ltUzqi/Kalinga-Design-2.0?node-id=544-3926)
frame `544:3926` (1440 × 9849).

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Where things are

| Path | What |
|---|---|
| [src/app/page.tsx](src/app/page.tsx) | composes the ten sections, in frame order |
| [src/app/globals.css](src/app/globals.css) | design tokens + the five type utilities + motion |
| [src/lib/content.ts](src/lib/content.ts) | **every string on the page**, in one file |
| [src/lib/fonts.ts](src/lib/fonts.ts) | the two brand faces, self-hosted |
| [src/components/home/](src/components/home/) | one file per section |
| [src/components/ui/](src/components/ui/) | `KsButton`, `TabBar`, `Reveal`, `SectionHeading`, the mark, the logo |
| [tools/optimize-assets.mjs](tools/optimize-assets.mjs) | the image pipeline |
| [tools/optimize-video.mjs](tools/optimize-video.mjs) | the video pipeline — watermark, trim, loop, encode |
| [tools/verify.mjs](tools/verify.mjs) | measures the running page against Figma |

## Scripts

```bash
npm run dev            # dev server
npm run build          # production build
npm run lint           # eslint

npm run assets         # rebuild public/images from assets-src/
npm run assets:audit   # report DPR / size per plate without writing

npm run video          # rebuild public/videos from assets-src/video/
npm run video:audit    # report DPR / crop / loop maths without writing

npm run verify         # measure the running page against the Figma frame
npm run verify:shots   # ...and write a full-page screenshot
```

`verify` expects a server on `http://localhost:3000`; point it elsewhere with
`URL=http://localhost:3100/ npm run verify`. It reports every anchor's delta
against its known y in the Figma frame. **The bar is 4px** — currently 15/15.

## Read these before changing anything

- **[CLAUDE.md](CLAUDE.md)** — how work gets done here. Three rules: the 95%
  confidence rule, plan → test → execute, and keep the files current.
- **[DESIGN.md](DESIGN.md)** — every measured value, all three carousels
  explained, the motion spec, the asset pipeline's reasoning, known Figma-side
  errors, and what is still outstanding.
- **[amahafigmapage.md](amahafigmapage.md)** — the playbook from a previous
  Figma build. Different client, same failure modes. Worth reading once.

## Three things that will bite you

1. **Section boxes are sized off 1440, not off the plate.** Several plates bleed
   past the frame (1457, 1472, 1449, 1672 wide). Driving a section's aspect box
   off the plate width makes it short, and the error compounds down the page.

2. **Clear the image cache after replacing anything in `public/images`.**
   ```bash
   rm -rf .next/cache/images
   ```
   Next keys it by pathname, not content, so a replaced file keeps serving the
   old bytes through a full rebuild.

3. **Three sections that look static are carousels.** Collections is vertical,
   Applications and Testimonials are horizontal. Figma can't show motion, so it
   parks the other slides off-canvas or below the clip boundary — see DESIGN.md
   before "simplifying" any of them into a grid.

4. **The hero is 892 tall now, and the intro absorbs the difference.** The
   band shrank from 1071, but Figma did NOT move anything below it — collections
   still starts at 1715. The 179px lives in the intro's padding. Change the hero
   height without re-padding the intro and all thirteen sections below go wrong.

5. **The MaxGuard band is two photographic layers.** The couple is cut out of
   the scene and drawn back on top so the ghost type passes *behind* them. And
   the scene node claims `x-16 width 1472` while Figma actually crops it to
   1440 at 1:1 — believing the box zooms the kitchen 2%. See DESIGN.md.

6. **The contact band is drawn OVER the footer's first 84px.** The band is 640
   tall and runs to 9159; the footer frame starts at 9075. The footer pays that
   overlap out of its own top padding, which is why its padding and its
   watermark percentages do not match the raw Figma numbers. Change one and you
   must change the other, or the page stops being 9849 tall.

7. **The footer's background tile is a raster on purpose.** The board draws it
   as 1487 loose vectors whose coordinates do not match the render's own 97 x 49
   period, so the tile was folded out of the render (r = 0.98) rather than
   rebuilt. Do not "restore" it to the vector mark — that tile repeats at half
   the pitch and is the wrong motif.

8. **The intro's clip is boxed to the HERO's aspect, not the viewport.** Both
   run `object-cover` on the same 16:9 source; a viewport-shaped box crops it
   differently and the picture jumps ~7% at handover. Keep `h-[61.944vw]` on
   that wrapper in sync with the hero's `aspect-1440/892`.

9. **Neither video looped, and measuring that needs a denominator.** A seam is
   only meaningful against a *typical* frame delta. The visualiser's first read
   was "341x" because the baseline was sampled from two frozen frames — its
   source holds 101 frozen transitions out of 299. The real figure was 17x.
   `npm run video` folds the tail back over the head to close both.

## Favicon

`src/app/favicon.ico`, `icon.svg` and `apple-icon.png` — the Kalinga mark in
white on ruby, generated from the mark's own path data. Next picks them up by
filename; there is nothing to wire in `layout.tsx`. Regenerate them only if the
mark changes.

## Outstanding

- Testimonial videos — the four cards currently render poster frames with the
  play control disabled.
- **Three nav fonts.** The drawer needs Haas Grot Disp **Round** 45 Light,
  65 Medium and 75 Bold; only Round 25 XThin is licensed here. `--font-nav` in
  globals.css falls back to the Display cut until they land — see DESIGN.md.
- Eleven image plates are below 2× DPR because the supplied sources are
  1280–1920px. Not a pipeline limit; see DESIGN.md § Assets.
- Both clips are under 2× too (hero 0.89×, visualiser 1.33×). The hero is also
  16:9 in a 1.345 box, so `object-cover` throws away 24.4% of its width — it
  wants a re-render at the section's aspect, not a harder crop.
- Only `/` exists, so footer and CTA links prefetch to 404s in the console.
  `/brochure`, behind the band's new Download brochure CTA, is one of them.
- The contact plate is 1x (1440px source against a 1440px box).
