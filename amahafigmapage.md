# Building a page from Figma — Amaha playbook

Every rule below was paid for once, on the home page, in a round of "this doesn't
match, fix it". The point of this file is that no other page pays for it again.

Figma file: `c0v9W0SMBKBeM8KVPtJwWy` ("Amaha Website"). Home frame is
**1440 × 6543**. Design tokens live in [globals.css](src/app/globals.css).

Read **Part 1** before writing a line. Read **Part 4** before saying you're done.

---

## Part 1 — The workflow that actually converges

Doing these in order is the difference between one pass and six.

### 1. Pull the node's real geometry, not a description

```
get_metadata(nodeId)      → the child tree with absolute x/y/w/h
get_design_context(nodeId) → text, fills, fonts, effects
get_screenshot(nodeId)     → what it should look like
```

**Work from absolute coordinates.** `get_design_context` will hand you plausible
CSS, but it flattens the frame nesting and rounds. The absolute x/y in
`get_metadata` is ground truth. Rebase every number to the section's own
top-left and derive spacing by subtraction:

> Figma 388:6811 — title 283→353, body 362→421, buttons 451
> ⇒ title→body gap = 362 − 353 = **9**… but the h2's box bottom is 350 and the
> `<p>`'s first baseline sits 3px into its box, so the CSS margin is `mt-[12px]`.

That comment is in [build-cta.tsx](src/components/home/build-cta.tsx) and it is
the pattern: **write the Figma coordinates into the code as a comment.** The
next person to touch it can re-derive the number instead of guessing.

### 2. Reproduce the frame *nesting*, not just the final look

This one cost a full round on brand overview. The paragraph wrapped one word
differently from Figma and the instinct was "font size is wrong." It wasn't.

Figma `375:3499` has a **718px frame (eyebrow + h2) nested inside a 764px frame
(with the paragraph)**. Two different wrap widths in what looks like one
centered column. Flattening it to a single `max-w-` makes the heading and the
body wrap at the same width, and the last line of the paragraph changes.

```jsx
<div className="mx-auto flex max-w-[764px] flex-col items-center gap-[29px]">
  <div className="flex w-full max-w-[718px] flex-col items-center gap-[29px]">
    {/* eyebrow + h2 */}
  </div>
  <p className="body-copy">…</p>
</div>
```

**Rule: if a text block's last line breaks differently from the screenshot, the
first suspect is the wrap width, not the font size.** Check the container
widths in `get_metadata` before touching typography.

Related: Figma's text frames are sized to the glyphs, CSS adds letter-spacing
*after* the last glyph. A 550px Figma frame needs `max-w-[552px]` in the browser
to hold the same line. See [art-of-living.tsx](src/components/home/art-of-living.tsx#L47).

### 3. Check whether a node is actually on the canvas

The teal band under the header survived two rounds of "why is this here?"
because it exists in Figma — as `418:8960`, at **x = 1440**. The frame is
1440 wide, so it is parked just off the right edge. Same for `300:367` at
x = 1439 and several stray components at x = -1697 and x = 1954.

**Rule: before building a node, check that `0 ≤ x < frameWidth`.** Designers
park deprecated layers beside the artboard rather than deleting them, and they
come back through `get_metadata` looking exactly like live ones. A node whose
x equals the frame width is off-canvas, not "flush right".

The corollary is the useful part: an exhaustive child listing is *proof of
absence*. The Our Story hero has no scrim child, which is how we knew to strip
the two gradients rather than guess at their opacity.

### 4. Page margins are per-page — measure, don't assume

Home insets 96px a side. **Our Story insets 240** — its mission, vision,
founders and careers bands are all 960px columns, and the sections had been
built at 1248. That is a 144px error on every band, and nothing about the
section markup hints at it.

**Rule: derive the page gutter from the first section's absolute x, once per
page, before writing any container widths.**

### 5. Columns stagger — don't top-align them

The footer grid looked wrong because all three columns started at the same y.
In Figma they start at **88 / 203 / 188**. That's not a grid row, that's three
independently-placed columns.

```jsx
<nav className="lg:mt-[115px]">        {/* 203 − 88 */}
<div className="lg:mt-[100px]">        {/* 188 − 88 */}
```

**Rule: never assume vertical alignment. Read each column's y.**

### 6. Gutters must be self-limiting

Figma column origins 94.77 / 603.62 / 1005 → 210px gutters at exactly 1440px
wide. Hard-coding `gap-x-[210px]` overflows the moment the viewport isn't 1440.

```jsx
lg:grid-cols-[299px_1fr_337px]
lg:gap-x-[min(210px,calc((100%-768px)/2))]   /* 768 = 299 + 337 + widest label */
```

**Rule: a Figma gutter is a max, not a constant.** Express it as
`min(figmaValue, calc(...))` with the floor derived from the fixed column widths
plus the widest content in the flexible one.

---

## Part 2 — Things that are already solved. Do not rebuild them.

Reaching for a raw `<a className="rounded-full border …">` is how the site drifts.

### Buttons — always `PillButton` / `PillAction`

[pill-button.tsx](src/components/ui/pill-button.tsx). One `BASE` string, four
variants, and a `<button>` twin so a submit CTA is pixel-identical to a link CTA.

```
h-[45px]  rounded-full  border-[1.175px]  pl-[30px] pr-[24px]  label-caps
```

Figma's eight pill instances were **hand-sized** — their padding ranges 27–31
left, 23–26 right. Don't copy any single instance. 30/24 is the cluster centre
and matches the two most prominent CTAs outright.

Variants: `solid` (filled ink, primary), `outline-gold` (on imagery/cream),
`outline-white` (header over hero), `on-light` (on a white card).

**Every variant hovers to `text-ink`.** White-on-gold is 2.4:1 and fails WCAG AA;
ink-on-gold is 4.8:1 and passes. If you add a variant, hover to ink.

Width overrides are legitimate but must cite Figma — e.g. brand overview's
"Know more" is 184px while its twin on the location section is 156px. Pass
`className="w-[184px]"`, don't fork the component.

### Typography — the five `@utility` classes

| Class        | Spec                                                    | Used for |
|--------------|---------------------------------------------------------|----------|
| `eyebrow`    | Manrope 400 / 13 / +2.6 / uppercase                      | "BRAND OVERVIEW", "OUR PROMISE" |
| `display`    | Cormorant 400 / clamp(34→48) / 1.354 / +0.75 / capitalize | h1, h2 |
| `display-lg` | Cormorant 400 / clamp(38→60) / +0.75                     | inner-page hero, drawer links, process carousel |
| `body-copy`  | Manrope 300 / 16 / 30 / +1.2                             | all body text |
| `label-caps` | Manrope 500 / 14 / +2 / uppercase                        | pills, nav |

**Rule: if you're writing `text-[16px] leading-[30px] tracking-[1.2px]`, you
meant `body-copy`.** A one-off size that appears twice belongs in `globals.css`
as a `@utility` — that's exactly why `display-lg` exists.

`display-lg` deliberately leaves line-height and text-transform to the caller;
they differ per context.

### Colours

```
--color-ink: #0c4142    (dark teal — NOT black)
--color-gold: #bea373
--color-cream: #f2ede3  (page background)
--color-sand: #e8dfcd   (alternating sections)
--color-mist: #f2f2f1
--color-muted: #8f8f8f  (inactive controls)
```

**`ink` is teal. Never use it for a scrim over photography** — see Part 3.

---

## Part 3 — The specific mistakes, so they aren't repeated

### Scrims over imagery must be neutral black

Shipped a hero with `from-ink … to-ink`. It cast a visible green wash over the
video and the user called it twice. The 89px top gradient was the obvious
culprit; **the bottom scrim was the bigger source and got missed on the first
fix.**

```jsx
bg-linear-to-b from-transparent via-black/45 via-45% to-black/75
```

**Rule: grep for `from-ink` / `to-ink` / `via-ink` on anything layered over a
photo or video. Overlay opacity is what tunes contrast; the hue should be black.**
`page-hero.tsx` still carries an 89px teal gradient — same bug, not yet fixed.

### Check contrast on video, not on the poster frame

The gold outline pill measured **1.44:1** on the brightest video frame while
measuring 4.33:1 on the dusk still it replaced. Sample the worst frame, not a
representative one. After the scrim: gold 3.39:1, white 8.16:1.

### `currentColor` does not cross `next/image`

An SVG rendered through `next/image` is an isolated document — it never
inherits `currentColor` from the JSX around it. The footer social icons and the
resource-page share icons were invisible for exactly this reason.

**Rule: SVGs used via `next/image` must have literal fills baked in** (`#BEA373`).
If you need it to change colour, inline the SVG as JSX instead.

### Verify icon SVGs actually contain their glyph

`phone-circle.svg` shipped with only the ring — the handset path was missing
entirely and nobody noticed until a screenshot comparison. When exporting an
icon, open the file and confirm every `<path>` survived, at the right offset:

```svg
<g transform="translate(6.048 6) scale(0.468376 0.473684)">
```

Also: `whatsapp-glyph.webp` came out of Figma with a "powered by" watermark
baked into the raster. **Prefer SVG for logos and marks; inspect any raster
icon at full size before committing it.**

### Look at every image before you ship it — the renders are watermarked

`story-mission.webp` and `story-vision.webp` both shipped with a **"Nim"
watermark** burned into the top-left corner. (Both were later re-shot as
`story-mission-sealink.webp` and `story-vision-conversation.webp`, and the
watermarked originals have since been deleted — the names below refer to the
files as they were at the time.) It was live on the page. The
generated renders in this project carry it, and Figma hides it because the
frame's crop rectangle happens to cut that corner off — so it is invisible in
Figma and visible on the site.

The fix is to take Figma's own crop instead of the raw fill:

```
download_assets(nodeId, defaultFormat: "png", defaultScale: 3)
  → export     = the node as Figma renders it, already cropped  ← use this
  → rawImages  = the uncropped source, watermark and all
```

**Rule: for a photographic plate, use `export`, not `rawImages`.** `rawImages`
is right only when you need to re-derive a crop Figma got wrong (the gallery
case above). Then batch-check the corners of everything before committing:

```js
sharp(f).extract({ left: 0, top: 0, width: w * 0.42, height: h * 0.16 })
```

### Clear `.next/cache/images` after replacing an image

Replacing `story-mission.webp` on disk changed nothing on the page — the dev
server kept serving the watermarked version out of `.next/cache/images`, keyed
by pathname, not content. Two minutes went into "did the write fail?"

**Rule: `rm -rf .next/dev/cache/images` after overwriting any file under
`public/images`, before you re-verify.** The path moved — this file said
`.next/cache/images` for a while and clearing that does nothing, which cost a
round on the Projects spec icons: the page kept serving the old plate through
a restart *and* a rebuild. The tell is the served aspect ratio, not the bytes
on disk:

```
curl -s "localhost:3000/_next/image?url=%2Fimages%2Fspec-ventilation.webp&w=256&q=75" -o /tmp/x.webp
```

If its aspect doesn't match the file you just wrote, you are still on cache.

### Read Figma's *visual* order, not its child-list order

The gallery toggle icons were built with masonry's glyph on the right because
that's how the layer list read. In the actual layout: icon at **x = 92**, label
at **x = 123** — icon is on the left, same as the other two.

**Rule: order comes from x/y coordinates. The layer panel's order means nothing.**

### Figma is not always right — ask before "fixing" copy wrap

Art of Living card 3 was widened to Figma's 495px so its last line would read
"for generations." rather than "cherished for generations." The user's response:
*"the figma is a mistake yours was correct"* — reverted to a uniform 436px.

**Rule: when Figma's own layout is internally inconsistent (one card in four
sized differently, for no structural reason), flag it rather than silently
matching it.** A per-card override field was added and then deleted; the churn
was avoidable.

**Brand rule: headlines never end in a full stop.** Body copy still does. This
came out of the home page's brand overview, where *"Every home tells a story
long before it's lived in."* had been copied faithfully from Figma — the Figma
was wrong. It applies to every `h1`/`h2`/`h3` display line on every page and to
display-set lines acting as headings (the footer newsletter line). Internal
punctuation in a two-clause headline stays — *"A home above the rush. A life by
the sea"* keeps its middle stop and loses its last one.

Known Figma-side errors, do not "fix" these:
- Art of Living card 3 copy width — use the uniform `max-w-[436px]`.
- The mission band's copy sits 14px higher than the vision band's for no
  structural reason. `SplitSection` centres both; don't add a prop for it.
- Trailing full stops on headings — see the brand rule above.
- Projects' FAQ header centres on 742 while its list centres on 719. Both are
  centred in code.
- Projects' second site-view plate is 872 wide but the frame clips it at 1440,
  so Figma exports 777. It is a slider; the rail scrolls.
- Contact's map has a **second plate parked over it** — `613:247` ("ChatGPT
  Image Jul 28") sits above `501:1803` in the layer order but renders 1×1, i.e.
  it is an empty placeholder. `501:1803` is the map that draws.
- The Resources Detail first body paragraph (`307:1915`) has a hand-sized 202px
  box; its seven lines actually occupy 210, so the gap to the next paragraph is
  22 and not the 30 the boxes imply. `307:1921` / `329:187` are honest 390s.
- The Related Blogs intro (`307:1962`) ends on a comma mid-sentence. Set as a
  full stop.

Deliberate deviations, where the user overruled Figma:
- **The hero chevron is dropped on the home page only.** It *is* in Figma
  there (`438:9017`, y811) — an earlier version of this file wrongly said it
  wasn't. Inner pages keep theirs (`335:188` / `335:191`, x712 y811).
- **The Projects location band gets an ocean layer Figma never drew.** Home's
  location *does* carry one in Figma (`696:338`); Projects' does not, and the
  user asked for it there too. See "The location map's ocean is a separate
  layer" below.

### Images: derive size from the raw fill, not the frame

Gallery sources were committed at 634 × 423 because that's the *displayed* size
in Figma's slider view. In Detail view they render full-width and looked soft.
The raw fills are 2281×2221 / 2400×1792 / 1402×1122.

Worse, `gallery-3` had been cropped to aspect 0.636 against Figma's 0.766 — the
crop rectangle from the node's transform was applied wrong.

**Rule: export from the raw fill at ≥1400px on the long edge, then apply the
node's crop transform with sharp.** Check the resulting aspect ratio against
the Figma frame's w/h before committing.

### Don't let `sizes` change between view modes

The gallery re-fetched every image on each toggle because `sizes` differed per
view, so the browser picked a different `srcset` entry. One constant for all
three views:

```js
const SIZES = "(max-width: 1024px) 100vw, 1248px";
```

### A static frame may be a resting state, not a static section

The residence gallery was built as three fixed plates because that is literally
what the frame contains: a centre image with a cropped rect running off each
edge. It is a **carousel** — those rects are the neighbouring slides. Figma
cannot show motion, so an animated section arrives looking like a still one.

The tell is that the numbers only reconcile under the animated reading. Lay
every slide out at 865×578 and scale the active one by 1129/865, and Figma's
98 / 99 slivers and 57 gutters fall out exactly. Three unrelated plates at two
different aspect ratios do not otherwise explain themselves.

**Rule: when a section holds a repeated element clipped by the frame edge, ask
whether it moves before building it.** Same for a lone element that looks
mid-way through something.

It happened again on the Projects wellness band, and the second time the tell
was cheaper: **an accent whose length does not divide its container evenly.**
The 3px rule at x240 is 454 long with a 120px ink segment — 120 is neither the
whole rule nor a half of it, and there is no reason for a decorative rule to
be two colours. It is a four-step progress indicator, and the other three
steps live in a variant set the page frame never shows.

**Where the other states hide: the variant set, parked off-canvas.** Projects
instances `Component 22` at 393:681, but the states are on `Component 20`
(237:178) at x = −33305 — four 1440 × 1170 symbols. `get_metadata` on the
instance flattens to the single active variant, so:

```
get_metadata(pageId)                   → find frames named "Component N"
get_metadata(thatFrame)                → <symbol> children = the variants
get_design_context(variantId)          → diffs against the default variant
```

`get_design_context` on a non-default variant is the useful call — it returns
a component with a `property1` union and ternaries on every field that
changes, which reads as a per-slide diff. That is how the four captions, four
photographs and the ink offsets (520 / 647 / 752 / 854 — hand-nudged, not an
even quarter split) came out in three calls.

### An infinite loop must not fight React over `transition`

The carousel resets from the third copy back to the first with the transition
suppressed. The first attempt did that imperatively:

```js
track.style.transition = "none";   // React's style prop puts it straight back
setIndex(i - n);
requestAnimationFrame(() => { track.style.transition = ""; });  // and now it's gone for good
```

React re-applies `transition` from the style prop on the very next render, and
clearing it to `""` later means React — which diffs prop values, not the DOM —
never restores it. The carousel jumped, then stopped animating entirely.

Drive it from state so the suppressed transition and the new transform land in
one render, and re-arm after a double `rAF`:

```jsx
const glide = jumping ? "none" : `transform 900ms cubic-bezier(0.22,1,0.36,1)`;
```

**The same switch must cover the slides, not just the track.** The reset also
changes *which element* is the active one, so if the plates kept their own
transition the outgoing one would visibly shrink while its twin grew.

Verify a loop by riding a full cycle and diffing the frame against the start:
`mean|Δ| = 0` is the only acceptable answer. Beware of comparing the wrong two
states — index 5 and index 3 are different photographs, and diffing those
"proves" a jump that isn't there.

### Layout transitions: FLIP, not CSS transitions

"It should be seamless, not like it reloads every time." Multi-column and flex
layouts can't be tweened by CSS. Capture `getBoundingClientRect()` before the
state change, invert with a transform in `useLayoutEffect`, release:

```js
el.animate(
  [{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
   { transform: "none" }],
  { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)", composite: "replace" },
);
```

Full implementation in [gallery.tsx](src/components/home/gallery.tsx#L138). Two
requirements that make it work: every view draws frames at their **natural
aspect ratio** (so before/after differ only by position + uniform scale), and it
is **skipped under `prefers-reduced-motion`**.

`useLayoutEffect` warns during SSR — alias it:

```js
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
```

### Reading browser storage: `useSyncExternalStore`, never effect + setState

The launch modal tripped `react-hooks/set-state-in-effect` and flashed on
hydration. Correct shape is in
[launch-modal.tsx](src/components/launch-modal.tsx#L19-L32): a no-op
`subscribe`, a client `readDismissed`, and a server snapshot that returns the
value which emits nothing into static HTML. Wrap the storage access in
`try/catch` — private-mode Safari throws.

### Modal focus goes on the dialog, not the close button

Focusing the close button paints a focus ring the design doesn't have. Focus the
dialog with `tabIndex={-1}` + `outline-none` — keyboard and screen-reader users
still get focus moved into the modal.

### The location map's ocean is a separate layer — three surfaces, two files

Both Location bands lay the transparent map (`amaha-project-location-map.webp`,
2144×1926, **has alpha**) over an **ocean wash**: a soft plate, warm off-white on
the left easing to sea-blue on the right. Where the map is transparent — the
Arabian Sea down the west coast, Mahim bay to the east — the ocean shows through
and the water reads blue; on `bg-mist` alone it reads grey. The off-white left
half sits behind the white card. Home's ocean **is** in Figma (`696:338`, "ChatGPT
Image", between the mist rect `696:336` and the map `698:861`, at **x−47 y0
1501×912**); the code just hadn't included it. Projects' band has no ocean node —
it was added on request.

**The raw Figma ocean export has a ~1px black frame border** baked in (corners
≈`[13,13,13]`, clean cream by ~12px in). Left on, it leaks a black triangle into
the composite corner. Crop ~11px each side before use → `amaha-location-ocean.webp`
(1573×964).

The wash ships as **two files** because the three places it appears have
different things behind them:

- **Desktop** — a live layer *under* the transparent map, because the ocean runs
  wider and taller than the map (past the card), so it can't be baked into the
  plate. `amaha-location-ocean.webp`, `object-cover`.
- **Mobile inline crop and the zoom popup** — no layer underneath (the phone crop
  sits on mist; the viewer is a bare popup on near-black `#0b0a06`), so both use a
  **pre-baked opaque composite**, `amaha-location-map-ocean.webp` (2144×1926, no
  alpha). Build it in three stacked layers so nothing shows grey or black:
  1. fallback = the ocean **cover-fit over the whole 2144×1926 plate** (fills the
     corners the positioned ocean can't reach),
  2. the ocean **positioned at its true spot relative to the map plate** (map-plate
     native ÷ display scale = 2144/1137 ≈ 1.886), over the fallback,
  3. the transparent map on top.
  `LocationMapMobile` uses this file directly. `ImageZoom` spreads `{...LOCATION_MAP}`
  (the transparent src), so its `src` must be **overridden** to `LOCATION_MAP_OCEAN_SRC`
  after the spread. Both live in [location-map.tsx](src/components/ui/location-map.tsx):
  `LOCATION_MAP` (transparent, + width/height/focus for the viewer) and
  `LOCATION_MAP_OCEAN_SRC`.

**Placing the desktop layer on any band** uses the home ocean↔map relationship,
scale-independent because both scale with the same plate. As fractions of that
band's map box: **left −0.5488, top 0.1068, width 1.3201, height 0.8932** (from
home's ocean −47/0/1501/912 against its map 577/−109/1137/1021). Home: the map box
is 1137×1021 at (577,−109), so the ocean lands at `left-[-47px] top-0 w-[1501px]
h-[912px]` and fills the 912 band.

**Projects' band is 1073 tall — taller than the ocean art's aspect** — so applying
the relationship straight (box −111/115/1578/958) put the ocean's top edge at y115
and cut a hard mist line across the sea and left of the card. Fix:
`amaha-location-ocean-tall.webp` — the ocean with its pale, near-uniform **top edge
replicated upward ~176px** (seamless because the top row barely varies), →
1573×1140. The box then bleeds 60px above the section and ends flush at the bottom:
`top-[-60px] left-[-111px] h-[1133px] w-[1578px]`, `object-cover`, so the water
fills top to bottom with no seam. Home's 912 band needs no such extension.

After overwriting `amaha-location-ocean.webp`, clear `.next/*/cache/images` (Part 3).
This whole feature was verified by **local `sharp` composites + live DOM** reads:
the in-app browser reports a 0×0 viewport at desktop width, so desktop screenshots
came back blank — mobile captures fine.

---

## Part 4 — Verify before you claim it matches

Eyeballing a screenshot is what produced most of Part 3. Measure.

Drive the running dev server with Playwright and read the DOM:

```js
// npx playwright install chromium-headless-shell  (once)
const box = await page.locator("h1").evaluate(el =>
  el.closest("section").getBoundingClientRect()
);
```

Gotchas already hit, each of which produced a confidently wrong measurement:

- `page.screenshot({ clip })` takes `width`/`height`, not `w`/`h`.
- A clip below the fold needs `fullPage: true`, or it throws "clipped area is
  either empty or outside the resulting image".
- `a[href='/contact-us']` matches the header drawer link too — scope selectors
  with `.closest("section")`.
- **The launch modal covers the viewport.** Every pixel sample on the first
  run returned `#e8dfcd` — the modal's sand card, not the hero. Dismiss it
  first: `page.locator('[role="dialog"] button[aria-label="Close"]').click()`.
  Geometry from `getBoundingClientRect` is unaffected; only pixels lie.
- **Lazy images race the screenshot.** The careers photo read as missing until
  the scroll pass slowed to 150ms a step and awaited `img.complete`.

A flat luminance histogram is the tell for all of these: if p50, p90 and p99
of a region are identical, you are sampling a solid fill — an overlay, a
placeholder, or an unloaded image — not a photograph. Check that before
concluding anything about contrast.

**The bar is 0–4px on every anchor.** The footer went 672 → **exactly 634**
that way. If a number is off by more than 4, it's a real mismatch, not rounding.

For overlay colours, don't guess the hue — **alpha-solve it.** Sample the
composite over a known background and solve per channel. A consistent alpha
across R/G/B identifies the colour; an incoherent one (0.37 / 0.26 / 0.13)
means you guessed wrong. That's how the footer divider was proven to be
gold @ 50% rather than white at some opacity.

Before saying done:

- [ ] Every section height and inter-section gap within 4px of Figma
- [ ] Text blocks break on the same words as the screenshot
- [ ] No raw pill/typography classes — `PillButton` + the `@utility` set
- [ ] No `ink` in any gradient over imagery
- [ ] Contrast checked on the worst frame; ≥4.5:1 for body, ≥3:1 for large text
- [ ] `npm run lint` and `npm run build` clean

---

## Part 5 — Assets and media

`.gitignore` blocks raw media (`*.mov *.avi *.mkv *.prores.mp4`,
`*-source.*`, `*-original.*`) and re-allows `public/images/`, `public/icons/`,
`public/video/`. Those negations are **last on purpose** — later rules win.
Don't add a blanket `*.tgz`; `tools/*.tgz` must stay committed or `npm install`
breaks. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

**Video** — encode before committing, never push camera output:

```
ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset slow -movflags +faststart out.mp4
```

The hero went 15.4 Mbps → 1.63 Mbps, **18.35 MB → 1.94 MB**, SSIM 0.985. Verify
faststart with `ffprobe`/`xxd` — atom order must be `ftyp moov free mdat`, or the
video won't start until fully downloaded.

Hero video needs `muted` + `playsInline` for autoplay to be legal on iOS and
Chrome, plus a `poster` so it paints instantly instead of flashing black.

**Images** — run through [tools/optimize-assets.mjs](tools/optimize-assets.mjs),
commit WebP. Figma-exported imagery is committed on purpose: the source URLs
expire.

**The brochure PDF** — served at `public/amaha-estates-brochure.pdf`, offered by
the "Download brochure" pill on Projects. Source is Canva design
**`DAHMa7A-m_U`, "Amaha Estate_Digital Brochure", 24 pages** — *not*
`DAHMbPe20JA`, which is the 43-page "Mallz copy" working file the floor plans
came out of.

Canva's own PDF export is no use here: `regular` caps embedded images at **800px**
(soft on a 1920-wide page) and `pro` ships print resolution at **65 MB**. There
is nothing in between, so the web build is assembled locally:

1. `export-design` → `jpg`, `width: 1920`, `quality: 92`, `export_quality: "pro"`
2. re-encode each page: sharp, mozjpeg **q80**, `chromaSubsampling: "4:4:4"`
   (keep 4:4:4 — the floor plans are fine grey linework on beige, and 4:2:0
   smears the dimension text)
3. assemble with [tools/build-brochure-pdf.mjs](tools/build-brochure-pdf.mjs),
   which embeds each JPEG verbatim via `/DCTDecode` so the build adds no second
   lossy pass. Pages are **1440 × 810 pt**, matching Canva's own MediaBox.

**38 MB → 4.4 MB**, and sharper than Canva's 8.8 MB `regular` export because the
images are 1920px rather than 800px. Ghostscript would be the obvious tool and
is deliberately not used: installing it needs `brew trust` on an unrelated
third-party tap on this machine.

Print-quality masters stay at the repo root and are ignored by `/*.pdf` — the
only PDF that belongs in the repo is the web build under `public/`.

**Outstanding:** the pre-optimisation 18.3 MB video blob is still in git history
(`.git` ≈ 78 MB). Purging it needs `git filter-repo`/BFG plus a force-push —
destructive, so it needs explicit approval before anyone does it.

---

## Part 6 — Home page reference values

Concrete numbers for pattern-matching on other pages.

| Section | Key values |
|---|---|
| Hero | `h-[878px]`, `pb-[51px]`, content group y632→768, caret y811 (`318:2884`) 43 under the buttons, `justify-end`, video `object-top` |
| Brand overview | `pt-[128px] pb-[108px]`, 764 outer / 718 inner, `gap-[29px]`, button `mt-[38px] w-[184px]` |
| Featured project | text column `max-w-[641px]` |
| Gallery | `pt-[99px] pb-[63px]`, rail `gap-[30px]`, slider frames `h-[423px]`. **Slider only** — `views={["slider"]}`, so the Detail/Masonry switcher is not rendered and the gold bar takes its `mt-[63px]` |
| Art of Living | `pt-[61px] pb-[79px]`, sub-copy `max-w-[552px]`, rail `mt-[57px]`, cards `w-[515px]` / image `h-[583px]` / `gap-[30px]`, h3 `mt-[20px]` 32/40 +1 italic, copy `mt-[6px] max-w-[436px]` |
| Location | Approved website band is **912px** with **0px gaps above and below**. The transparent map export `amaha-project-location-map.webp` sits in the centered 1440px coordinate frame at x577, y−109, 1137×1021; its painted edge begins just after the card's x658 right edge and its bottom ends at the section boundary. Figma child `696:336` is only the mist background; parent `696:415` supplies the map geometry, but its extra 1013px background/gradient tail must not be copied. **Behind the map is the ocean layer** `696:338` at x−47 y0 1501×912 (`left-[-47px] top-0 w-[1501px] h-[912px]`, object-cover); mobile/zoom use the baked composite — see "The location map's ocean is a separate layer" in Part 3 |
| Build CTA | `min-h-[781px] py-[120px]`, column `max-w-[793px]`, h2 `max-w-[636px]`, `mt-[12px]` → body, `mt-[30px]` → buttons, scrim `bg-black/71` |
| Footer | **634px tall**, `px-6 lg:px-[95px] pt-[88px] pb-[45px]`, columns 299/1fr/337, nav `mt-[115px]`, newsletter `mt-[100px]`, divider `mt-[80px] border-gold/50`, legal `mt-[25px]` |
| Launch modal | card 1014×770, image 946×435 inset 34, content 64 below image, close disc 38.8 at 28/27, CTA is the pill at 85% (h 38, 12px text) |
| WhatsApp FAB | `right-[32px] bottom-[32px]`, glyph `size-8` |

Section rhythm: `cream` → `sand` → `cream`, with the footer on `ink`.

### Header and menu drawer (Figma 318:2873 — "HOME PAGE 31")

The header lives on a **newer frame than the rest of Part 6**, so read it from
`318:2873` and not from the older home frame. Two things there contradict what
the earlier frames said:

**The 89px teal band under the header is real after all.** Part 1 records it as
off-canvas junk at x = 1440, and on `408:*` it is. On `318:2873` it is
`501:1973` at **x0, y80** — an 89px gradient rotated 180°, which resolves to ink
at ~59% under the bar easing to clear by the halfway mark. It is a scrim, not a
band: it stops the solid 80px bar from cutting a hard line across the hero.
Give it `pointer-events-none` or it eats the top 89px of every page.

**Drawer anchors** (panel `318:3224`, 1139 × 1031 at x −1):

| Anchor | Value |
|---|---|
| Panel | 1139/1440 = `w-[79.1%]`, ink, full height |
| Links | x102, Cormorant 60 `leading-[72px]` white, centres on **125px pitch** from y189 → `pt-[153px]` + `gap-[53px]` |
| Rule `318:3244` | y921, **x100 → x1138** — it runs to the panel's own right edge, so the panel carries no right padding |
| Contact | y944, 20/48 +1.2. Phone icon 21×19 at x103, its text frame **178 wide**; mail icon 22×16 at x369, its text at x405. Hold the 178 or the pair closes up and the mail icon lands short |
| Bottom pad | 1031 − 992 = **39**, not 159. The rule sits at 89.3% of the panel, low — `mt-auto` plus a big `pb` puts it around 78% |
| Close `612:136` | 38.8px disc at x1067/y24 → `top-[24px] right-[32px]` |
| Scrim `318:3225` | rgba(11,10,6,0.5) over the exposed 302px strip only |

The header bar's own three items are each centred differently in Figma —
hamburger 33.4, logo 45.5, Book a Visit 39.5 against an 80px bar. That is
eyeballing, not intent; centre all three.

---

## Part 7 — Our Story reference values (Figma 248:230, 1440 × 8936)

Page gutter is **240**, not 96. Every anchor below verified within 4px.

| Section | Key values |
|---|---|
| Hero (`PageHero`, shared) | 876 tall; title 477 → intro 633 (+24) → CTA 723 (+31) → caret 811 (+43) → base 876 (+49). Title 60/66 w510, intro 468 wide. **No scrim** — Projects passes `scrim`, Our Story does not |
| The Amaha Way | photo 453×523 at x238 y965; copy 459 wide at x730, hanging 119 below the photo top; eyebrow→h2 14, h2→body 13; `pt-[89px] pb-[145px]` |
| Pull quote | 831 tall, text 670 wide sitting 36 below centre, 167px fade into the ink band, **plus a flat `bg-black/50` over the whole frame** — it lives on the image node (`187:443`), not on the section, which is how a read of `393:614` alone concluded there was no wash. Without it the sun glare behind the quote measures 1.19:1 |
| Mission (ink) | 642 tall, `py-[75px]`; copy x240 w497, photo 388×491 at x812 |
| Vision (sand) | 648 tall (`lg:pb-[83px]`); photo x240, copy x710 w488 |
| Founders | eyebrow 3886 → title +7 → body +4; plates 439 each, 82 gutter, 419 tall; name (`display` gold) +58, bio +6 |
| Residence gallery | an **autoplaying carousel**, not three plates — see below. Active plate 1129×754 at x155, neighbours peeking 98/99, 57 gutters. *(The component was removed from Our Story and the file deleted in the asset cleanup; the reading of the frame below is kept because it is the lesson, not the code.)* |
| What shapes | title 656 wide, body +6, `pb-[85px]` |
| Careers (ink) | band 696; photo 408×447 at x792 y6877; h2 is **white**, 48/60, hand-broken after "Careers at", second line italic; h2→body 30, body→CTA 46, CTA `w-[170px]` |
| FAQs | title 7578, body +18, list +46; 1100 wide at x170; rows 100 tall, open row 210; toggle is a **filled gold 33px disc with a white caret**, flipped when open |

Two components are shared and were re-anchored for this page — re-check
[projects/page.tsx](src/app/projects/page.tsx) when touching either:
`PageHero` (Projects passes `scrim`) and `FaqAccordion`.

### The process carousel's gold arrows (Figma 330:3007)

`Component 21` is drawn on a **1951 × 1021** frame, not 1440, and its x/y are
used at 1:1 — which is why the arrow inset reads 146. The control is a **42px
gold disc carrying a 16.258px caret** at 12.87/12.87, so the glyph fills 39% of
the disc. It was first built at 62/24: the same ratio at the wrong scale, and
the ratio is what makes it *look* right while being half again too large.
"Know More" under the stage label is **16px** Manrope Medium underlined.

### The residence gallery is a finite drag slider

> **Historical.** `residence-carousel.tsx` no longer exists — Our Story was
> rebuilt without it and the dead file was deleted. Kept because the drag,
> damping and bounded-reel rules below apply to the next slider anyone builds
> here, and to `ProcessCarousel` and `WellnessCarousel` today. Recover the
> implementation with `git log --diff-filter=D -- src/components/ui/`.

Rebuilt on request: **no arrows, no wrap.** The white chevrons are gone, the
plates are dragged, and the 2px gold rail underneath is both the readout and
the only control. The 5s timer still runs, but it walks to the last slide and
**stops** instead of starting over.

This deleted a lot of machinery, and it is worth knowing why it was there. The
old version ran an *unbounded* index through `wrap()` with a widening render
window, purely so clicking faster than the 900ms glide could not outrun the
reel. A finite reel has no such failure mode: three slides, `clamp(0, LAST)`,
three slots, done. Do not reintroduce `wrap` unless looping comes back.

What a bounded reel buys you visually: at slide one the left sliver is empty
and at slide three the right one is, so you can see you have hit the end
without a counter. That is the "show when it is the last image" behaviour.

Drag specifics worth keeping:

- Handle **all** pointer types here — the track is transform-driven, not a
  scroll container, so touch has nothing native to fall back on. Pair it with
  `touch-pan-y` so a vertical swipe still scrolls the page.
- The live drag offset must run **untransitioned** (`transition: none` while
  dragging) or the plates lag the finger. Restore the glide on release.
- Past either end, damp the drag to 0.35× rather than blocking it. A reel that
  refuses to move reads as broken; one that resists reads as bounded.
- Commit at a quarter of a plate's pitch; below that, spring back.

### The photo rail's slider view

`PhotoGallery` in slider view got the same treatment — mouse drag, a timer that
stops on the last frame, and a gold bar under the rail. **Home passes
`views={["slider"]}`** and the Detail/Masonry switcher disappears; Projects
still offers all three.

Two things that are easy to get wrong:

- **Mouse-drag only.** This one *is* a scroll container, so touch already has
  native panning with momentum. Driving `scrollLeft` from `pointermove` on top
  of that doubles every swipe.
- **The bar is written straight to the node, not through state.** It updates on
  every scroll frame, and re-rendering nine `next/image`s at 60fps to move one
  hairline is a bad trade. Same reason it carries no transition: scroll events
  already arrive continuously, and easing on top makes it trail the drag.

The bar uses the **scrollbar model** — fill width = `clientWidth / scrollWidth`,
offset = progress through the remainder. A segment-per-image bar lies here,
because these frames are laid out at their own aspect ratios and so have
different widths.

---

## Part 8 — Projects reference values (Figma 283:1093, 1440 × 9665)

Gutters are **per band**, not per page. Every anchor below verified within 4px
with Playwright except where noted.

| y range | bg | section |
|---|---|---|
| 0 – 876 | photo + scrim | hero (header 0–80 is solid `ink`) |
| 876 – 1512 | `sand` | philosophy |
| 1512 – 2515 | `white` | floor plans |
| 2515 – 4377 | `cream` | site view gallery + specification |
| 4377 – 5295 | photo | a home above the rush |
| 5297 – 6371 | map | location |
| 6371 – 8290 | `cream` | wellness + FAQs |
| 8290 – 8982 | `sand` | enquiry |
| 8982 – 9616 | `ink` | footer |

| Section | Key values |
|---|---|
| Hero | `PageHero` with `scrim`, `introWidth={598}`, `caretGap={49}`. The scrim is 283:1246 — **#101010**, 56% held to 64.5% then eased to 41% by 90.5%. Title breaks after "luxury", "stillness" is italic |
| Philosophy | `pt-[147px] pb-[153px]`, eyebrow 1023, copy `mt-[43px]` — Cormorant **36/55**, `max-w-[865px]`, hard break after "enduring quality" |
| Floor plans | gutter **100**; panel 1038×673 at y1651, white on `#dcdcdc`; plan 947×324 inset 46/164; rail of **four** 192×104 thumbs at x1148 starting 57 lower, 13 apart; Prev/Next 8 under. Each thumb drives its own plate — see below |
| Site view | h2 2591.5 → copy `mt-[9px]` (`max-w-[775px]`) → rail 2797. `PhotoGallery` at `frameHeight={496} gap={21} inset={100} toggleGap={65}`. Figma hangs a 46px gold scroll disc at 294:170; **dropped on request**. Figma draws only the two plates that fit the frame — the rail carries **seven** on request (site subjects only; amenity interiors belong to the wellness carousel). Do not "correct" this back to two |
| Specification | gutter **240**, container 960. Row 1 is **two** cards, `grid-cols-[569fr_374fr]` gap 17; row 2 is three on gap 20, rows 19 apart. Card 218 tall, `p-[13px]`, `rounded-[7.742px]`, fixed **109px icon plate** so both rows put the title on card-top + 122. Row-1 copy carries hard breaks |
| A home above the rush | card is on the **right** — 553 wide, right edge on the 240 gutter. `pt-[196px]`, card `px-[37px] pt-[26px] pb-[49px]`, h2 `max-w-[479px]`, copy `mt-[14px] max-w-[439px]` two paragraphs on 30, CTA `mt-[31px] w-[229px]` **solid** |
| Location | `ProjectLocation`, **not** the home `Location` — 330:2321 is the old band parked underneath. Gutter **84**; card 554×983 at y5342, `px-[39px] pt-[43px] pb-[64px]`, blocks on a flat `gap-[17px]` (body gets `mt-[10px]` more), copy `max-w-[358px]`. The transparent map `amaha-project-location-map.webp` is 1195×1073 at x545 (top-0), which puts its painted edge at the card's x638 right edge and keeps Bandra Station visible. **An ocean layer is added here (Figma has none)** behind the map: `amaha-location-ocean-tall.webp` at `left-[-111px] top-[-60px] w-[1578px] h-[1133px]`, object-cover — the *tall* variant because this 1073 band would otherwise cut a mist line across the sea. Mobile/zoom use the baked composite — see Part 3 |
| Wellness | `pt-[194px] pb-[176px]`, gutter 240, container 968. Row = 3px rule (454, gold/20, **120px ink segment**) + 79 + text + 24 + photo 560×487. h3 `mt-[129px]`, copy `mt-[2px]`. A **three-slide carousel** — [wellness-carousel.tsx](src/components/projects/wellness-carousel.tsx) |
| FAQs | `pt-[4px] pb-[82px]`, gutter **169**; title → copy `mt-[16px]` → list `mb-[46px]`. Rules are **1px gold**, answers **#555** |
| Enquiry | `pt-[162px] pb-[170px]`, `pl-[238px] pr-[226px]`, `grid-cols-[1fr_444px]` gap 74. Address 14/25, contact details 15/36.354 |

**Projects location exception:** Figma parent `501:454` is 1128px tall, but
the approved website section is deliberately **1073px** tall and meets the
wellness section with a **0px gap**. Use Figma for the card/map relationship
only; do not restore the 55px background tail. The linked child `501:470` is
only the `#f2f2f1` background rectangle. The useful map geometry is the
transparent 1131×1016 plate at x554/y−3 in the parent, proportionally adapted
to the site's gap-free 1073px band as documented above.

### The wellness band is a carousel (Component 20, 237:178)

Three slides, auto-advancing on **2s** (asked for; the crossfade stays 700ms),
pausing on hover/focus and not advancing at all under `prefers-reduced-motion`. The 3px rule is the progress indicator —
`role="tablist"` with 24px-wide invisible hit areas so it is clickable and
keyboard-reachable without thickening the rule.

| # | Title (h3 width) | Copy width | Ink top | Photograph |
|---|---|---|---|---|
| 1 | Your Daily Retreat (302) | 225 | 0 | `projects-wellness` |
| 2 | Fitness, Within Reach (230) | 237 | 127 | `projects-wellness-2` |
| 3 | Open to Calm (163) | 245 | 334 | `projects-wellness-4` |

Every caption is hand-wrapped — one shared width puts "Open to Calm" on a
single line and breaks the other captions. The heading, intro and the
*position* of the text block are identical across all three, so only the h3,
copy, photograph and ink offset are per-slide; the panels are stacked
absolutely so a three-line caption does not reflow against a four-line one.

Four shared components were re-anchored for this page — re-check
[our-story/page.tsx](src/app/our-story/page.tsx) and
[contact-us/page.tsx](src/app/contact-us/page.tsx) when touching them:

- `PageHero` gained `introWidth` and `caretGap`; the defaults are Our Story's.
- `FaqAccordion` rules went black/20 → **gold**, answers → `#555`.
- `ContactForm` fields are **one 40px box with the label inside it**, floating
  on focus. Both frames draw it that way (303:643 / 303:929); the stacked
  label was adding 15px a row. It later gained `messageGap` / `sendGap` /
  `className`, defaulting to Projects' 123 / 35 / `max-w-[648px]` — the contact
  page runs 43 / 28 / `w-full`, so the two are not interchangeable.
- `Gallery` was split into [photo-gallery.tsx](src/components/ui/photo-gallery.tsx),
  driven by CSS custom properties so the per-page geometry survives Tailwind's
  static class scan. `home/gallery.tsx` is now just its shot list.

### The floor plans come from the Canva deck, not Figma

Figma carries four placeholder drawings. The real ones are in **"Amaha
Estate_Digital Brochure", Canva design `DAHMbPe20JA`, slides 28–37** — ground
floor, the typical floor, three floor-plate options, and five unit plans
(2BHK 670 / 3BHK 971 / 2BHK 661 / 4BHK 1157 / 3BHK 871, the last two marked
*Optional*). Read them with the Canva MCP `read-design`; export with
`export-design` at `png`, `width: 2560`, `export_quality: "pro"`.

**Every slide bakes four things into the raster** that have to come off before
the drawing is usable on the page: a green header bar, the title bottom-left, a
key plan bottom-left on the unit slides, and a compass bottom-right. Crop to the
drawing's own bounding box with those four regions masked out, or the box
inflates to the full 2560 and the plan floats in dead space. Two traps found the
hard way:

- **The green bar is not always full-bleed.** On slide 33 it spans about 43% of
  the width, so a "row is >50% inked" test misses it and the bar lands in the
  crop. Hard-skip `y < 90` instead; no drawing sits that high.
- **The key plan is what stretches the box**, not the compass. It sits far
  bottom-left and pulls `x0` to the page margin, leaving half the frame empty.

The caption and compass are rebuilt in the site's own type — the baked ones are
raster, unselectable and illegible once the plan is scaled to the 947px panel.

**North is up on all ten.** The deck marks it with a vertical stroke through a
small open circle, bottom right. Check this against the source before changing
the compass: a north arrow pointing the wrong way is worse than none.

### Two things Figma's export cannot give you

**A clipped slide.** The second site-view plate (283:1377) is 872 wide but the
1440 frame cuts it at 777, and `download_assets` exports the *clipped* 777 —
so the rail had nothing to scroll to and the section read as two static
photographs. Rebuild it from the raw fill using the node's own transform
(`w-full h-167.98% top -29.64%` of a 2048 square). Same class of mistake as
the spec icons below: **when a node is clipped or cropped, `export` is the
composited result, and the geometry you want is in `get_design_context`.**

**A control's other states.** All four floor-plan thumbnails pointed at
`floorplan-main.webp` because that is the only plate the frame renders — the
selection changed, the panel didn't. The other three plans are the
thumbnails' own `rawImages`, which come back at full resolution (2328×988,
1466×1216, 1696×1216) rather than the 150×54 the thumb displays.

**Rule: any control Figma draws in one state — a thumbnail rail, a tab set, a
carousel — needs its other states sourced before it is wired up, or it ships
looking broken.**

### The spec icons were sliced wrong

`spec-*.webp` are cells of one 1536×1024 contact sheet, and the crop lives in
the node's fill transform, not in the export — `download_assets` returned the
**whole sheet** for 294:307 and 300:338. Read the percentages off
`get_design_context` and cut them yourself:

```
container 111×97, img w698.18% h533.33% left-507.49% top-47.4%
  → sheet 775×517.3, crop at (563.3, 46.0) size 111×97
```

They also ship on a **cream ground that Figma renders as white**. Unmix
ink-over-cream to straight alpha (soft floor ≈0.12 to kill the ground) rather
than compositing, or the plate shows as a box on the white card.

---

## Part 9 — Contact, Resources and Resources Detail

Three pages, three different gutters. Measure, don't assume — see Part 1 §4.

| Page | Figma | Frame | Gutter |
|---|---|---|---|
| Contact us | `300:373` | 1440 × 1931 | **105** (card 1237 wide) |
| Resources | `330:2648` | 1440 × 3863 | **127** (card 1186 wide) |
| Resources Detail | `307:1546` | 1440 × 4308 | **105**, article column indents a further 197 to x302 |

The node IDs in the dev-mode links point at *children*, not frames —
`388:7594` is Contact's header rectangle and `307:1902` is Detail's hero
gradient. `get_metadata` with no `nodeId` lists the pages; the page dump
exceeds the tool's token cap, so pull it to a file and slice out the frame.

Both card pages use `rounded-[10px]` on the sand panel and **#e8decd**, which
is the `sand` token to within 1/255.

### Contact us (300:373)

| Anchor | Value |
|---|---|
| Page | `pt-[210px] pb-[112px]`, card 210 → 1185, footer 1297 |
| Card | `pl-[46px] pr-[57px] pt-[64px] pb-[100px]` — asymmetric, and that is what makes the inner box 1134 = **696 + 438** with no gutter, so `lg:grid-cols-[1fr_438px]` lands the form on x847 |
| h1 | `display` (48/65), "Come Home" italic. Its Figma frame is 103 tall holding one centred 65px line — the glyphs run 274 → 339, not 255 → 358 |
| Copy | intro `mt-[11px]` 15/30 +0.885 w448; Visit Us / Contact Us `mt-[31px]`, 30px Cormorant on `leading-[36px]`; address `mt-[9px]` 13/20 w200; phone+email `mt-[7px]` 13/19, columns 31 apart |
| Form | staggered `lg:mt-[51px]` below the h1 — **the two columns are not top-aligned**. Fields 325 / 385, message underline 509, send 537 → 582 at `w-[114px]` |
| Map | `mt-[70px]`, `aspect-[1133/433]`, `rounded-[10px]`, fills the inner box |

### Resources (330:2648)

Card `px-[113px] pt-[38px] pb-[83px]` on the 1186 panel → a 960 content column.

| Anchor | Value |
|---|---|
| Title | `display` **italic gold**, box 234.5 → 299.5 |
| Intro | `mt-[4px]`, 14/30 +0.882, `max-w-[403px]` |
| Filters | right-aligned onto x1200, `gap-[27px]`, 14/30 +1; active is Manrope SemiBold gold with a 27px gold rule 2px under it. `lg:items-end` bottom-aligns them with the intro |
| Rule 70 | `mt-[37px]`, gold 1px, x194 w1052 — **46 wider a side than the content column**, so it breaks out with `lg:-mx-[46px]` |
| Featured | `mt-[32px]` (the rule occupies 431 → 432), plate 959.82 × 550.04 `rounded-[8.449px]` |
| Overlay | cream card 466.39 × 261.08, `-mt-[130px] ml-[32px] p-[29px]`, shadow `0 3.38 23.911 10.984 rgba(0,0,0,.1)`; title `max-w-[377px]` so it takes two lines |
| Grid | `mt-[121px]`, `gap-x-[28px] gap-y-[70px]`, rows 1266 / 1850 / 2434 |
| Load more | `mt-[83px]`, centred, `w-[153px]` |

### Resources Detail (307:1546)

| Anchor | Value |
|---|---|
| Hero | 876 tall; scrim `307:1902` is **#101010 at 31% held to 51.1%, easing to 41% at 103.8%** — far lighter than Projects' 56%. Date 563 (16/27 white), h1 604 → 802 (Cormorant **50/66**, w751, 3 lines), `pb-[74px]` |
| Back | `330:3006` is a **filled 38.03px gold disc with a white arrow**, not an outlined caret. On the page gutter, x105 y918 |
| Column | x302 w816 → `lg:ml-[197px] lg:max-w-[816px]` inside a `lg:px-[105px]` container |
| Lead | 999, Cormorant **Medium Italic 30/50**, justified |
| Body | `mt-[49px]` / `mt-[22px]` / `mt-[67px]`, Manrope Light 16/30 **+1px** (not the system's 1.2 — over 816 the difference is a whole word), `#555`, justified. The first paragraph opens on a 32px initial |
| Quote | breaks out of the column: `lg:-ml-[41px] lg:w-[918px]`, centred on the **page** (720), not the column (710). Mark is **Nunito Sans 150 ink** — the only non-Cormorant/Manrope face on the site, so it is declared on this route, not in the root layout |
| Share | rule 2626 gold 1px w810; label 2643 14/25 +0.882 uppercase #555; **four** gold marks on a 29px pitch ending on 1112 |
| Related | sand, full-bleed 2759 → 3675. `pt-[100px] pb-[100px]`, title `display` gold centred, intro `mt-[4px]` `body-copy` w775, cards `mt-[73px]`. The 960 is the *content* column — do not spend it on `px-6` |

### Two things that cost a round here

**A trailing inline-block compounds.** `ResourceCard`'s "Read more" was an
`inline-block`; it sits on the parent's baseline and its descent added 1.3px to
every plate, which is invisible on one card and a 6.7px miss by the load-more
button. `block w-fit` fixes it and keeps the underline shrink-wrapped.

**A larger inline grows its line box even when `line-height` is set.** The
32px initial in the first body paragraph inherits `leading-[30px]`, but its
*content area* is 32px tall, so the union with the strut makes line 1 36px and
pushes every anchor below it down 6. `leading-[0]` on the span removes it from
the line-box calculation while still painting.

Contrast note: the hero h1 measures **10.6:1 at the median but 2.63:1 on its
brightest 1% of background** — Figma's 31% scrim is thin. It is left at Figma's
value; deepening the two stops to 0.39 / 0.49 clears 3:1 if that is ever wanted.

---

## Part 10 — Carried back from the Kalinga Stone build

Two rules learned on a different Figma file (`4CcBZqK341EDC1MAbSJJN3`, see
[Figmapage.md](Figmapage.md)) that are not specific to that client and would
have saved rounds here. They are recorded in this file because this is the file
that exists to stop a lesson being paid for twice.

### Verification that only measures the page is blind to the pictures on it

Amaha's checks — geometry, contrast, responsive — are the same shape as
Kalinga's, and all of them passed while that repo shipped, in order: three card
plates silently replaced by downscales of the wrong source, and four cards
rendered at **1.43× their display box from a source good for 3.15×** because the
resolution cap in the asset table was a round number rather than a derived one.

Neither is visible in a screenshot, a layout measurement or a contrast reading.
The check that catches them measures the **files**: for each plate, effective
device-pixel-ratio against its display box, PSNR against its own source, and
bytes per megapixel. It needs no browser, so it runs first.

The distinction that makes it usable: a plate under 2× **because the table threw
pixels away** is a failure with a one-number fix; a plate under 2× **because the
client supplied a 1× file** is a request to make of the client. Conflating the
two produces a check nobody can act on.

Two corollaries, both measured rather than assumed:

- **A flat bytes-per-megapixel ceiling is the wrong test on its own.** A dense
  subject (terrazzo, foliage, anything re-encoded from an already-lossy source)
  is expensive because of what it *is*. Apply density only above a size where it
  costs something, and add a plain per-file ceiling for what density misses.
- **Look at every plate as a contact sheet whenever the encoder changes**, not
  just the new ones — a pipeline change rewrites the whole directory. That pass
  found a competitor's signage baked into one raster and an asterisked
  marketing claim baked into another, both of them client-supplied and neither
  of them anything the page could reveal.

### A clipped frame's child list is not its contents

Part 1 § 4 already says nodes can sit off-canvas. The Kalinga file had a
sharper version: a **179 × 167 clipped frame** whose children were an image at
(890, −466), a title at (−320, −50) and eight map pins spread over 400px. Every
label and every pin is outside the window. What Figma renders is the raster and
one 34px bracket.

Building from the node tree would have produced a panel carrying four city
labels the design never shows. **Screenshot a clipped frame at its own size and
build what renders** — `get_screenshot(nodeId, maxDimension: <4× the frame>)`
costs one call and settles it.
