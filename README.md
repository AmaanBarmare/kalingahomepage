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
| [tools/verify.mjs](tools/verify.mjs) | measures the running page against Figma |

## Scripts

```bash
npm run dev            # dev server
npm run build          # production build
npm run lint           # eslint

npm run assets         # rebuild public/images from assets-src/
npm run assets:audit   # report DPR / size per plate without writing

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

## Outstanding

- Testimonial videos — the four cards currently render poster frames with the
  play control disabled.
- Eleven image plates are below 2× DPR because the supplied sources are
  1280–1920px. Not a pipeline limit; see DESIGN.md § Assets.
- Only `/` exists, so footer and CTA links prefetch to 404s in the console.
