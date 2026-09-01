# Kalinga homepage — design reference

Everything measured, every deviation, and every thing that surprised us. The
companion to [CLAUDE.md](CLAUDE.md) (how to work) and
[amahafigmapage.md](amahafigmapage.md) (mistakes already paid for once).

**Figma:** `5SkKc300bE566PF5ltUzqi` — "Kalinga Design 2.0", frame `544:3926`,
**1440 × 9849**. Page gutter is **80** (derived from hero text x80, strip x82,
progress rule x80, footer column x79 — measured once, per Amaha Part 1 §4).

Verified with `npm run verify`: **15/15 anchors within 4px**, page renders
1440 × 9819 against Figma's 9849.

---

## Tokens

Read straight off Figma's variable set — do not invent values here.

| Token | Value | Used for |
|---|---|---|
| `ink` | `#14100e` | body text, second tab bar's active fill, scrim end-stop |
| `ruby` | `#70000e` | the page's only accent — logo, marks, first tab bar, one CTA |
| `ruby-pressed` | `#4a000e` | CTA pressed |
| `off-white` | `#f8f6f3` | **unused on this frame** (bands sample `#ffffff` every time) |
| `line-soft` | `#e4dfd8` | tab borders, progress-rule track |
| `gray-6` | `#f2f2f2` | hero headline — *not* pure white |
| `placeholder` | `#cfc8c0` | image placeholders |

## Type

Figma carries exactly **two** named text styles. Everything else on the page is
one of them, scaled.

| Style | Spec |
|---|---|
| Heading | Halogen **Medium** 40 / 1.58 / +5, uppercase |
| Body Copy | Neue Haas Grot **Disp** 45 Light 16 / 1.5 / +1 |

Utilities live in [globals.css](src/app/globals.css): `.heading`, `.body-copy`
and `.ghost-display`. If you catch yourself writing
`text-[16px] leading-[1.5] tracking-[1px]`, you meant `.body-copy`. The
collection slides' Halogen Regular 45.603 / +6.8404 is set inline in `cqw`
rather than as a utility, because it has to scale with the carousel — see
[collections-carousel.tsx](src/components/home/collections-carousel.tsx).

`.heading` is `clamp(26px, 4.5vw, 40px)`. The `4.5vw` term only bites below
~889px, so every viewport at or above 1024 still gets Figma's exact 40 / +5.

### Fonts

All nine faces are self-hosted, converted OTF → WOFF2 (700 KB → 278 KB,
identical outlines):

```
Halogen-{Light,Regular,Medium,Bold}                  → --font-halogen
NeueHaasGrotDisp-{45Light,55Roman,65Medium,75Bold}-Trial → --font-neue-haas
NeueHaasGrotDispRound-25XThin-Trial                  → --font-neue-haas-round
```

The body face is Neue Haas Grotesk **Display**. Not `Text`, not `Round` — those
ship under near-identical filenames and look subtly wrong.

The **Round** cut is loaded separately, as its own family, and used by exactly
one node: the MaxGuard ghost headline (`551:5465`), Round 25 XThin 90 / +13.5.
Folding it into `neueHaas` as a 200 weight would let the browser substitute
Round for Display body copy, which is why it gets its own `localFont` call.

Verified against Figma: `"lorem"` renders 341px of glyphs against Figma's
343.9px text frame (−2.9). `"ipsum"` and `"cal"` sit 33 and 22 short of *their*
frames, but those frames are hand-drawn — the three boxes have heights 95.5 /
92 / 95 for identical one-line text at one size. One font, one size, one
tracking: if one word matches, they all do, and the boxes are the loose thing.

---

## Section reference

y values are the element's top in the 1440 × 9849 frame.

| y | Section | Key values |
|---|---|---|
| 0 | **Hero** | plate 1440×1071 full bleed. Logo bar 409×58 at x516 y38, `rgba(248,246,243,0.14)`, radius 2 — **no nav links in the frame**. Scrim y648→1071, transparent→`#000`, straight down. Headline x80 y842 w493 `#f2f2f2`; body x900 y851 w460; CTA x900 y925. Headline ends 968 and CTA ends 967.7 — the columns are **bottom-aligned on 968**, not top-aligned |
| 1071 | **Intro** | headline 1235 (w644, 2 lines) → +31 → body 1392 (w539, 4 lines) → +68 → ruby mark 1556. All three centre on x720 |
| 1715 | **Collections** | Component 102 — a **vertical carousel**, see below |
| 2839 | **Applications** | heading 2986 → tabs 3141 → progress rule 3230 → active card 3259. Card rail, see below |
| 4092 | **MaxGuard** | plate 1472×655 at x-16. Ghost text x434/684/684 at y78/192/284. Badge x1176 y21 197×132. CTA x649 y500. Lockup x60 y521. Store badges x340 y570 |
| 4747 | **Visualiser** | heading 4894 → plate 5065 (1449×815 at x-9) → CTA 5927. **The page's only filled button** — Figma's Style=Primary, "Ruby CTA" |
| 6050 | **Karigare** | heading 6136 → collage 6286. Component 101, 1420×860 **at x60** |
| 7146 | **Testimonials** | heading 7273 → tabs 7434 → cards 7555 → mark 8328 |
| 8519 | **Contact** | plate 1672×640 at x-114 runs to 9159, i.e. 84px *under* the opaque footer. Visible band is **556**, not 640 |
| 9075 | **Footer** | 1440×774, see below |

**Section boxes are driven off 1440, not off the plate width.** Several plates
bleed past the frame (1457, 1472, 1449, 1672). Sizing the section's aspect box
off the plate makes the section short — this cost a full measurement round and
produced the −318px cumulative drift on the first verify pass.

---

## The three carousels

Figma cannot show motion, so all three arrive looking like static sections.
Each one only reconciles numerically under the animated reading.

### Collections (Component 102) — vertical

Figma draws one slide and parks three more below the clip boundary.

1. The instance is 1124 tall but its first slide is 1022.636 — a 73px band left over.
2. Slide 2 sits at top 1050.85, left 177.06, w 1102.886. In page space that is
   x168.6 y2765.9 w1102.9 — **exactly** the beige sliver visible under the
   Quartz slide in the rendered frame. It is the next slide peeking.
3. `1102.886 / 1457 = 0.7569`, and every type size on the parked slides is the
   active slide's size × that same 0.7569 (45.603 → 34.519, 18.241 → 13.808).
   One slide at two scales, not four designs.

So the slide scales as a unit. Sized in `cqw` against the frame so the scale is
one transform rather than a table of breakpoint values.

Slides: Quartz / 30 · Natural Marble / 40 · Terrazzo / 30 · Porcelain / 70.
The peeking slide is the only affordance in the frame, so it *is* the control.

### Applications (544:3950) — horizontal, active card pushes

```
SP/Kitchen      x0    y10   460 × 600
SP/Bathroom     x484  y-15  498 × 650   ← active
SP/Living Room  x1006 y10   460 × 600

gaps      484-460 = 24  and  1006-(484+498) = 24     → one 24px gutter
scale     498/460 = 1.0826, 650/600 = 1.0833         → one uniform scale
centring  600×1.0833 = 650; half the 50px growth is 25; 10-25 = -15  → exact
```

The active card **pushes, it does not scale**. A transform-scale about the
centre would put it at 465..963; Figma has it at 484..982 with the next card
displaced by exactly the 38px of growth. So width/height animate and the flex
row reflows.

The active card also moves its label from the bottom (512/534) to the top
(30/52) and gains the material swatch at (287,521) 191×107.

Content runs to 1466 inside a 1250 frame → the rail scrolls. The strip's
rawImages carry **four** scenes plus the swatch, not the three the frame draws.

Vertical overflow is *not* clipped: in Figma the active card renders 3256..3904
against a 3274..3894 frame. Reproduced with `-my-[25px] py-[25px]`, since
`overflow-x: hidden` alone would force the other axis to `auto`.

### Testimonials (Groups 196/197/199) — horizontal drag rail

Card origins 82 / 432.16 / 780.66 / 1130.54 → deltas 350.16, 348.5, 349.88.
A 321-wide card on a **349.5 pitch** (28.5 gutter). The fourth runs to 1451.5
and is clipped by the 1440 frame — the tell that it is a rail, not a three-up.

Drag is wired for **mouse only**. This is a real scroll container, so touch
already has native panning with momentum; driving `scrollLeft` from
`pointermove` on top of that doubles every swipe.

`snap-mandatory` was removed: it forced `scrollLeft` past the container's left
padding, rendering the first card flush at x0 instead of on the 82px gutter.
The design shows the fourth card clipped mid-plate anyway — free positioning,
not snapped.

---

## The "progress" rule (544:3948)

1280 × 2 at x80, track `#e4dfd8`. Measured ruby fill runs **x560..1058**
(499 wide). The active card's page box is 566..1064 (498 wide) — a 1:1 mirror
to within 6px.

So despite the layer name it marks the **focus slot**, not progress. Because
the rail recentres the active card into that slot, it is stationary. Kept as
drawn. If a travelling progress bar is ever wanted, that is a one-line change
in [applications.tsx](src/components/home/applications.tsx) — but it would be a
deviation from the frame, not a fix.

---

## Motion

`get_motion_context` on the frame returns an **empty node list** — Figma carries
no keyframe data for this file. Every animation is therefore authored, derived
from what the layout implies. Nothing here is transcribed from a spec.

| Where | What |
|---|---|
| Global | `Reveal` — 18px rise + fade, 900ms expo-out, fires once, never replays |
| Hero | a looping video plate. The 18s drift the still used is **dropped** — the clip carries its own camera moves and the two fought each other |
| Collections | 6s auto-advance, 1100ms glide; pauses on hover/focus |
| Applications | 5s auto-advance, 780ms glide; pauses on hover/focus |
| Karigare | scroll-linked parallax, per-plate depth 10–34px, via `animation-timeline: view()` — zero JS, and browsers without it render the plates at rest, which *is* the Figma frame |
| Testimonials | mouse drag on a native scroll rail |
| Video | clips play only while on-screen and never start under `prefers-reduced-motion`; the poster stands in |

Every one of them is off under `prefers-reduced-motion`. The reveal's resting
(hidden) state lives in CSS rather than React state so that reduced-motion
readers — and readers with no JS at all, via a `<noscript>` rule — can never be
left looking at an invisible page.

The applications reel rebases from the third copy to the first with the
transition suppressed **from state**, not by writing `track.style.transition`
imperatively: React re-applies the style prop on the next render, and clearing
it to `""` later loses it permanently. The same suppression covers the **cards**,
not just the track — the rebase changes which element is active, so a card
keeping its own transition would visibly shrink while its twin grew.

---

## Assets

`npm run assets` rebuilds `public/images` from `assets-src/`;
`npm run assets:audit` reports without writing. **26 plates, 2.85 MB total.**

### Figma's 2× export is a pure upscale — do not use it

Round-tripping each export through its own source resolution gives PSNR
**52.8 / 41.2 / 38.5 dB** (hero / visualiser / MaxGuard). That is no detail
above the source Nyquist: the 2880px exports carry nothing the originals don't,
at 1.2–5.3 MB each. The pipeline works from the raw fills and **never upscales**
— target width is `min(display × 2, source width)`.

### Eleven plates are below 2× DPR, and it is not the pipeline

| Plate | Source | Display | DPR |
|---|---|---|---|
| hero | 1280×720 | 1440×1071 | **0.89** |
| contact | 1672×940 | 1672×640 | **1.00** |
| maxguard-scene | 1536×1024 | 1472×655 | **1.04** |
| collection × 4 | 1536–1672 | 1457 | **1.05–1.15** |
| testimonial 1–3 | 387–388×712 | 321×646 | **1.21** |
| visualiser | 1920×1080 | 1449×815 | **1.33** |

These are client-supplied AI renders at modest resolution. A plate under 2×
**because the table threw pixels away** is a one-number fix; a plate under 2×
**because the source is 1×** is a request to make of the client. These are all
the second kind. Options: re-render at higher resolution, or run super-resolution
(offered, not yet done — it invents detail, which on marble veining is the
client's call).

### Three exports had white flattened behind them

`badge-warranty`, `maxguard-logo` and `app-badges` are alpha-bearing in their
raw form; Figma's `export` composites them onto opaque white. Invisible in
Figma, a white box over the photograph on the page. The pipeline uses the raws.

`maxguard-logo` is worse: all four of `542:5283`'s rawImages are the *"Powered
by MAXGUARD"* lockup, while the band actually uses the plain mark — which
exists **only** as the flattened export. So it is unmixed back to straight
alpha rather than composited:

```
a = 1 - min(r,g,b)/255          # greys and the red X both survive this
c = (c_over - (1-a)·255) / a
```

→ 25.9% inked, 74.1% transparent.

### After replacing any file under `public/images`

```
rm -rf .next/cache/images
```

Next keys its image cache by **pathname, not content**. Replacing
`maxguard-logo.webp` on disk changed nothing on the page until this was
cleared — the old lockup kept serving through a rebuild. The tell is the served
aspect ratio, not the bytes on disk:

```
curl -s "localhost:3100/_next/image?url=%2Fimages%2Fmaxguard-logo.webp&w=640&q=75" -o /tmp/x.webp
```

### Icons

`kalinga-mark.svg`, `kalinga-wordmark.svg`, `socials.svg`, `search.svg`,
`gps.svg` all carry **literal fills** (`#70000E` / `white`), because they are
served through `next/image`, which renders an SVG as an isolated document that
never inherits `currentColor`.

The Kalinga mark is *also* inlined as JSX in
[kalinga-mark.tsx](src/components/ui/kalinga-mark.tsx), because it is used as a
ruby divider, a white footer watermark, **and** the footer's tiled background —
three colours, so it has to inherit. The footer tile repeats it on a measured
**48px period** at 0..21 luminance over black.

---

## Intro, navbar and the resized hero

### The hero band went 1071 -> 892, and nothing below it moved

`544:4024` is now **1440 x 892** at y0, and the floating translucent logo bar is
gone — replaced by the solid 90px navbar. The trap: the board did **not** pull
the rest of the page up. Matching each section against Figma's own render:

| section | y | shift |
|---|---|---|
| intro headline | 1129 | **-106** |
| collections … footer | 1715 … 9075 | **0** (r = 1.000) |

So the hero lost 179px and the intro absorbed all of it — 73 above the headline
(padding 164 -> 237) and 106 below the mark (130 -> 236). Shrink the hero
without re-padding the intro and all thirteen sections below it sit 179px high.

New hero geometry, rebased to the 1440 x 892 clip:

| element | node | x | y |
|---|---|---|---|
| clip | 544:4024 | 0 | 0 (1440 x 892) |
| scrim | 544:4026 | -8 | 469, 1489 x 423 -> bottom 47.42% (was 39.5%) |
| headline | 544:4027 | 80 | 702 |
| body | 544:4028 | 900 | 711 |
| button | 544:4029 | 900 | 785 |

The clip is 892 tall with its **top 90px hidden behind an opaque bar** — not an
802-tall clip sitting below the bar. `object-cover` on 802 crops the frame
differently and moves the horizon.

### Navbar — 709:6387, six variants of one 1440 x 90 bar

Bar: white, lockup 308 x 35.93 at x80 y27, hamburger 36 x 32 at x1324 y29
(1324 + 36 = 1360 = 1440 - 80).

Drawer `709:6661`: **521 x 937 at x919**, flush right and starting at the top of
the page, so it covers the bar's right end including the hamburger. Fill
**#70020f — not** the brand ruby `#70000e`; the extra green is real.

- close 46 x 41 at x460 y15, white plate, X 32 at x7 y4.5
- sections 404 wide at x58 y113, **one every 136px while collapsed** = a 40px
  header + a 96px gap, so the gap is fixed and an expanded list simply pushes
  the sections below it down. Children start 48 below the header top, 36 pitch.
- inquiry x45 y794 · rule x45 y839 w425 · legal x45 y858, items on a 21px gap

Casing is not what the export implies. Figma reports `capitalize` on the
inquiry paragraph with `lowercase` on the spans inside it; the spans win and it
renders **"Any inquiry info@kalingastone.com"** — sentence case, lowercase
email, bold + underlined. Title-casing it gives "Info@Kalingastone.Com". The
legal row is **full uppercase**. Read the rendered board, not the class list.

Two more preserved Figma spellings, same rule as the footer's MAXGAURD:
**TERAZZO** (709:6683) and **TERAM AND CONDITIONS** (709:6666).

### The drawer type is the Round cut, and three weights are missing

709:6387 specifies **Haas Grot Disp R Trial** — Round — at 45 Light, 65 Medium
and 75 Bold. Only Round 25 XThin is licensed here (it was supplied for the
MaxGuard ghost). `--font-nav` in globals.css therefore resolves to the Display
cut: same family, square terminals instead of rounded. When the three OTFs
arrive, add them to `fonts.ts` and change that **one line** to
`var(--font-neue-haas-round)`.

### The intro overlay

Full-bleed hero clip under a centred lockup, dismissed by whichever comes first:
a 7s timer, any scroll/wheel/touch, or any pointer or key press.

**Once per tab**, via `sessionStorage` — closing the tab replays it, navigating
away and back inside the tab skips it. `localStorage` would suppress it forever;
no storage would replay it on every internal navigation.

It is **server-rendered** so a first-time visitor has it in the very first
frame. Deciding in an effect would paint the page and then drop the intro on top
of it — and would trip the same `set-state-in-effect` rule reveal.tsx had to be
rewritten for, which is why the skip decision goes through
`useSyncExternalStore` with a `false` server snapshot.

The mirror-image flash — a returning visitor briefly seeing an overlay that
hydration then removes — is handled by the inline script in `layout.tsx`, which
stamps `data-intro-seen` on `<html>` before first paint so CSS hides it. The
same `<noscript>` rule hides it outright, which matters: with JS off nothing
would ever dismiss it and the page would be permanently covered.

---

## Two faces sit inches apart on the application cards

The room caption and the material link are **different typefaces**, and they are
close enough together that setting both to the display face looks fine and is
wrong. Verified per node:

| element | node | face | size | tracking |
|---|---|---|---|---|
| index "01" | 544:3954 | Halogen Regular (400) | 12 | — |
| room "Kitchen" | 544:3955 | Halogen Regular (400) | 20 / lh 31.6 | 1 |
| **"View material"** | 544:4014 | **Haas Grot Disp Trial 45 Light (300)** | 9 | 1, uppercase, underline |
| sector chip | 544:3935 | Halogen **Medium** (500) | 12 | 1 |
| audience chip | 544:4005 | Halogen **Medium** (500) | 12 | 1 |

Two were wrong and both were font-family errors, not size errors:

- `.space-material-link` was `--font-display` at weight 500. It is the **body**
  face at weight 300 — the one place on a card that is not Halogen.
- `TabBar` was `font-body font-normal` on **both** bars. Both are Halogen Medium.

One trap in the Figma output: 544:3935 reports `font-['Transducer_Test:Medium']`
on the paragraph, and `Halogen:Medium` on the spans inside it. The paragraph font
is a leftover on an empty style — the spans are what renders. Read the spans.

Still deliberately off, pending a call from the client: the link renders at 13px
against Figma's 9 and the chips at 13 against 12. Those are sizes the build
already carried; only the faces were corrected here.

---

## The MaxGuard band was rebuilt — the ghost type is gone

The board dropped the whole two-layer composition this section used to be. There
is **no ghost headline any more, and no cutout of the couple** laid back over it,
so `maxguard-foreground.webp` and the `ghost` copy went with them. What arrived
instead:

| | was | is |
| --- | --- | --- |
| MaxGuard lockup | bottom left, y520.8 | **top left**, x56 y23 |
| headline | ghost type behind the couple | `665:15191` LOREM IPSUM, x79 y464 |
| body | — | `665:15192`, x79 y521, 487 wide |
| CTA | outline, mid-band x649 y500 | **ruby** Style=Primary, x1165 y562 |
| store badges | one flattened 248 x 41.6 strip | two 39 x 39 marks, x348 and x400 |
| "Download the App" | Halogen Medium, ink | Halogen **Bold**, white |
| scrim | none | two rects over the bottom half |

Headline is Halogen Medium 30 / +5 / 1.58 white; body is Haas Grot Disp Trial 45
Light 16 / +1 / 1.5 on `#EEEEEE`. The body string stops one clause earlier than
the hero's — `LOREM_BRIEF`, not `LOREM_SHORT`.

### The fill moved, and the old note about it was wrong

`542:5281` is 1472 wide at x-16 and its fill is a 3:2 image drawn at 1472 x
981.4 with the top 234.2 cropped away — `object-position: 50% 71.76%` inside a
wrapper that is the node box, not the band. An earlier pass concluded the fill
sat 1:1 across 1440 and that the 1536 x 1024 `mg-raw1.png` was "a different,
more zoomed render". Both were true of the old board and are false now: the
1536 x 1024 file **is** the current fill, byte for byte, and letting it simply
cover the band centres it and moves every landmark up ~90px.

### The scrim is diagonal, and the node list cannot tell you that

The two rects (`551:5470`, `665:15196`) are plain boxes over the bottom half.
Dividing the board's render by the untouched fill gives the alpha per tile, and
the map is not horizontal — at y550 it runs **0.74 at the left edge and 0.02 at
the right**. A plane fit puts the axis at **193.2deg**, within 3deg of the
contact band's own 195.8deg, and along that axis the profile is clean and
monotone: flat zero from 22% to 68%, then 0.24 / 0.45 / 0.57 / 0.68 / 0.78 /
0.90. Composited back over the fill, that reproduces the board to a median of
1 level across the counter and 2 across the text block.

### One thing that is NOT reproduced

A soft, lighter, lower-contrast haze covers roughly x0-500 y0-275 — behind the
MaxGuard lockup. It is worth knowing what it is *not*, because each of these was
tested and rejected:

- **not a blur** — fitting Gaussians from sigma 1 to 25 never improves the
  correlation over sigma 0.
- **not a global image adjustment** — the tone curve it implies (highlights
  crushed 248 -> 142) makes every other region *worse* when applied, 1 -> 3.
- **not a linear gradient on the scrim axis** — adding one there leaves the
  top-left at 41 and damages the top-right.
- **not a node** — nothing in the band's metadata sits there, and the fill is
  confirmed byte-identical.

Best guess is an effect on the scene layer that the API does not expose —
Figma's progressive blur, a background blur, or a masked overlay. Everything
else in the band matches; ask the designer what that layer is.

## The brochures were 1.8 GB, and two thirds of that was invisible

The four collection brochures arrive as Illustrator print masters — PDF/1.4,
612 x 846pt, every placed photograph a ~300ppi CMYK JPEG. 1812 MB across four
files. `tools/optimize-brochures.py` takes them to **95 MB (19x)** with the
worst sampled page at 29.4 dB and no visible change.

### Most of the file is the editable .ai document, not artwork

Illustrator's *Create PDF Compatible File* embeds the whole editable document
inside the PDF, hung off `/PieceInfo << /Illustrator ... >>` on the catalogue
and on **every page**. On Quartz that is **234 MB in 3733 objects** against
79 MB of actual unique images, and nothing renders it — it exists so the PDF can
be reopened in Illustrator. Dropping the key and garbage-collecting takes
340 MB -> 112 MB **in two seconds with not one pixel changed**.

Measure before compressing. Downsampling every image in Quartz to 150ppi saves
less than deleting a key that no reader ever looks at.

### Why this does not use PyMuPDF's `rewrite_images`

The built-in only scales by **powers of two**, and skips anything it cannot
halve into the target — aim at 200ppi and a 300ppi plate is left completely
untouched, because 150 would undershoot. It also keeps CMYK. Same 150ppi target
on Quartz:

| path | result |
| --- | --- |
| `rewrite_images` | 71.4 MB |
| arbitrary-ratio Lanczos + CMYK -> RGB | **26.0 MB** |

Each image is resampled against **its widest placement on the page**, not its
own dimensions — a plate drawn into half a column needs half the pixels
whatever the source says. CMYK -> RGB goes through MuPDF's colour management
rather than PIL, because these are Adobe-inverted CMYK JPEGs and PIL reads them
wrong often enough to matter. Chroma subsampling is 4:2:2, not the 4:2:0
default: these are photographs of stone and the veining lives in chroma.

### The type is not at risk

Zero embedded fonts, zero extractable text — every glyph is already vector
outline, so downsampling the placed images cannot touch it. Verified by
rendering: the logotype is pixel-identical before and after, and only the
photography moves at all. That is what makes 150ppi safe here in a way it would
not be for a text PDF.

### Reading the PSNR

Terrazzo's cover is the worst page in the set at 29.4 dB, and it is fine —
terrazzo is dense high-frequency speckle, the hardest possible content for
PSNR, where sub-pixel differences tank the metric without being visible. Checked
at 1:1: aggregate, mirror edge and fixtures are indistinguishable. Use the
number to find pages worth looking at, not as a verdict.

### Cost

`public/brochures` is **95 MB in the repo**, which is the real price of this
decision. Halving it again means ~110ppi, which measured 3-4 dB worse and is
visible on the stone. Worth revisiting only if deploy size becomes a problem.

---

## Video

`npm run video` rebuilds `public/videos` from `assets-src/video`;
`npm run video:audit` reports without writing. Two clips, **2.7 MB** for a
browser that takes WebM (4.0 MB if it falls back to MP4).

| Clip | Source | Ships | Box | DPR |
|---|---|---|---|---|
| `hero` | 1280×720 24fps 10.0s | 216f / 9.00s — webm 870 KB, mp4 1514 KB | 1440×1071 | **0.89×** |
| `visualiser` | 1920×1080 30fps 10.0s | 204f / 6.80s — webm 1829 KB, mp4 2387 KB | 1440×815 | **1.33×** |

WebM is listed first in the `<source>` order because VP9 won on both axes: at
matched SSIM it came in ~25% under H.264. CRFs are per-clip, from a sweep —
the visualiser is a far denser render, and at the hero's setting its **MP4 came
out larger than the source file**.

`hero.webp` and `visualiser.webp` are still built by the image pipeline but are
no longer referenced by the page — the posters come from the clips' own first
frames, because a poster that does not match frame 0 shows as a jump the moment
the video starts. They are left in place as stills for whoever needs them; drop
the two rows from `optimize-assets.mjs` if you want the ~1.1 MB back.

### The hero's Gemini watermark

A sparkle at **x1137..1182 y576..622** (46×47, inset 97px from both the right
and bottom edges). Located by accumulating a high-pass residual over all 240
frames: the fixed glyph reinforces, the panning marble cancels.

It is a constant white composite. Solving per-pixel across the clip gives
alpha **[0.315, 0.314, 0.315]** over RGB — equal across channels, i.e. a
neutral overlay, which is what makes the solve trustworthy — peaking at 0.37
over [241.2, 239.2, 235.9]. Two independent estimators (regression against an
inpainted background, and a DC root-find) agreed to within 2%.

Un-blending that recovers the *true* marble rather than inventing it, and it
fixes the interior — but the glyph's anti-aliased edge cannot be pinned
precisely enough, and every variant left a visible rim. **`delogo` measured
better**: it takes the region's mean temporal residual to 0.06 against a
clean-marble floor of 8.15, an order of magnitude *below* the surrounding
noise, with frame-to-frame flicker unchanged at 0.90× the surround.

It interpolates rather than recovers — but the marble there carries only
**2.24 levels RMS** of high-frequency detail, so there is nothing to preserve.
That measurement is what settles the choice; without it the "recover the real
pixels" argument sounds better than it is.

### Neither clip looped, and one had a dead tail

Measured against a *typical* frame delta, not against zero:

- hero last→first = **21×** a normal frame step
- visualiser = **17×** — and it holds **101 frozen frame-transitions of 299**,
  including a 49-frame (1.63 s) completely static tail and a 22-frame freeze
  after the opening. Trimming to frames 23..250 leaves 25 frozen transitions,
  longest run 3 frames.

Both seams are closed by folding the tail back over the head:

```
O(t) = orig(t)·(t/X) + orig(t+L)·(1 − t/X)    t < X
O(t) = orig(t)                                t ≥ X        L = N − X
```

which is continuous at the wrap by construction. Shipped: hero **1.04×**,
visualiser **1.73×** — the loop point is now no more visible than an ordinary
frame transition.

Watch the denominator here. The visualiser's seam first measured as *341×*
because the "typical" delta was sampled from frames 0→1 — which sit inside
that head freeze. Sampling a frozen pair makes any seam look catastrophic.

### The visualiser clip was replaced with the surface-swap demo

The client supplied `kalinga-marble-20-surface-visualizer.mp4` to stand in for
the old dolly push-in. It is a different clip — PSNR against the previous raw is
**13.3 dB**, i.e. unrelated footage — and a far better fit under "Visualise Your
Space": it shows a cursor picking swatches and the surface actually changing,
rather than a static room.

**The pipeline config did not need to move.** Measuring the new clip's per-frame
delta gives a 23-frame head freeze and a 50-frame dead tail with motion in
frames 23–250 — the same structure as the clip it replaces, so the existing
`keep: [23, 251]` trim and 24-frame loop fold were already correct. The four
internal holds are 3 frames each, which are the deliberate pauses on each
surface and are kept.

### The hero clip is 16:9 and its box is not

1.778 against a box of 1.345, so `object-cover` **hides 24.4% of the width** —
and at 1280px on a 1440px box it is already under 1×. It is an 8-shot montage
(slab, hand, kitchen, living room, bath, edge, arch, slab), so it is worth
re-rendering at 1920×1440 or wider rather than cropping harder. The visualiser
has no such problem: 1.778 against 1.767 loses 0.6%.

---

## The contact band and footer were rebuilt — 544:4017 / 555:2863

The band changed in four ways at once, and the footer moved with it.

### The plate stopped bleeding, and the band is 640 not 556

`544:4018` is **1440 x 640 at x0**, the frame's own width. The old plate was
1672 wide at x-114 and hung 114px off both edges; nothing hangs off the sides
now, so the band is a plain 9:4 box.

It still hangs off the BOTTOM. The band runs to 9159 while the footer frame
starts at 9075, and it is drawn OVER the footer. An earlier pass read this the
other way — footer on top, band clipped to 556 — which is wrong: sampling the
board down a clean column shows the photograph still present at 9075 and only
reaching pure black at 9159. The band is the full 640 and the footer gives back
the 84px overlap out of its own top padding. Page total is unchanged: 640 + 690
= 1330 from 8519.

### The scrim was solved, not eyeballed

Figma stacks two rects over the plate (1430 x 495 at y8594, 1443 x 411 at
y8751). Because the source image is now supplied untouched, the alpha per row
comes straight out of `1 - rendered/source`, and the quartiles land within 0.02
of the median — that tightness is the check that the solve is real:

| band y | alpha |
| --- | --- |
| 0 → 364 | 0 |
| 364 → 410 | 0 → 0.68, steep |
| 410 → 635 | 0.68 → 1, slope 0.00143/px, dead straight |

i.e. stops at 56.9% / 64.1% / 99.2%. Reproducing this as one gradient is exact
to within a level; guessing a two-stop fade is not.

### The CTA is "Download brochure" and carries a chevron

`695:2576` is an 11.67 x 6.06 stroked chevron drawn as a loose vector ON TOP of
the button, not inside the component — and Figma pays for it out of the right
padding. The label ends at x254.3, the chevron runs 267.3 → 279, the box closes
at 297. So `KsButton` grew a `trailing` slot that swaps its symmetric 24px
padding for **13px of gap and 18px on the right**.

**It is now a dropdown** (`brochure-menu.tsx`), on the client's instruction —
the chevron became a real disclosure opening the four collection brochures.
The board still draws no panel, so none of the panel is copied from Figma; it
is assembled entirely out of parts that already ship, which is the only way to
add UI to this page without inventing a second visual language:

| part | borrowed from |
| --- | --- |
| trigger box | `ksButtonClass` — the KS/Button recipe itself, so it is pixel-identical to the link it replaced |
| item type | the same 11.272px / +1.0247 / Haas 55 Roman |
| item hover | the `outline` variant's own hover — white fill, ink text |
| open/close | the nav drawer's disclosure: chevron `rotate-180`, `grid-template-rows` 0fr → 1fr, `--ease-out-expo` |

**It opens UPWARD, and that is forced, not chosen.** The CTA's base sits 70.3px
above the band's bottom edge and the footer starts immediately below, so a
downward panel would be born inside the footer. `bottom-full` puts it over the
band's own scrim, which is at or near black by that height, so white-on-dark
holds. The panel is `w-max min-w-full` because the items are longer than the
trigger's label.

Each item opens in a new tab (`target="_blank"` + `rel="noopener noreferrer"`).
`download` is deliberately NOT set — the ask was to open the PDF, and `download`
would push a file to disk instead.

### The body copy went back to lorem

`544:4022` is now named after the lorem string and renders it. The real Client
Care paragraph it replaced is kept verbatim in the comment above `contact` in
content.ts, so restoring it is one edit rather than git archaeology. Flagging it
because it looks more like an accidental board edit than a decision.

## The footer's background is two mirrored marks, and it fades

Three things were wrong here, and none of them were visible without measuring.

**The period is 97 x 49, not 48 x 49.** Autocorrelating a clean column band of
the board's render puts the horizontal period at 97 — exactly twice what was
built. One period holds **two mirrored marks**, so a single-mark tile repeats at
half the pitch and reads as a different motif entirely. That is why the shipped
footer looked like diamonds where the board has arrowheads.

**It could not be rebuilt from the vectors.** The board draws the pattern as
**1487 loose vector nodes**. Their three distinct shapes come back with exact
path data, but their reported coordinates imply a 65.81 x 48.67 period that the
render does not have, and the best arrangement fitted from them correlates at
only 0.68. So the tile is a raster: folded out of 12 clean periods of the
board's own render, thresholded, and shipped as a 776 x 396 PNG (3.5 KB) used at
97 x 49. It correlates back against the board at **r = 0.98**. Its origin sits
at Figma footer x45 y40, which is `background-position: 45px 5px` once the 84px
overlap is taken off.

**It fades in.** Sampling the pattern's peak per row: nothing until y200, then a
*decelerating* ramp to 21/255 by the base. A flat tile — what was there — is
visibly wrong across the top third of the frame. The mask in the component is
those measurements as stops, not an eased guess.

**There is no centre watermark.** An earlier pass put the mark at x678 y341 in
full white. The board has only background there.

## The footer's two type families

The split is real and both halves were wrong.

| run | family | size | tracking | fill |
| --- | --- | --- | --- | --- |
| Find a store / FOLLOW US | Halogen Regular | 12 | 2 / 1.0247 | white |
| left body, placeholder | Haas Grot Disp **Trial** 45 Light | 14 / 13 | 1 | white |
| COLLECTIONS, KARIGARE, ABOUT | Haas Grot Disp **R** 55 Roman | 16 | 1.5 | `#f3f3f3` |
| Quartz, Residential, … | Haas Grot Disp **R** 45 Light | 16 | 2 | white/70 |
| legal row | Haas Grot Disp **R** 45 Light | 13 | 1 | white |

The build had all of it at 14px `font-body` with no tracking on the links, so
the right column was ~12% too small and the newsletter line failed to wrap where
the board wraps it. The **R** is the Round cut — the same one the nav drawer
wants, still on the Display fallback.

**"55 Roman" is Haas's REGULAR.** The numbering is 45 Light / 55 Roman / 65
Medium / 75 Bold, so 55 is 400. Setting those headings to 500 put 30% more ink
on the glyphs than the board has; the ink-pixel count is what caught it (569
against 709), because the peak brightness matched either way.

Fills were confirmed by sampling peaks off the board rather than trusting the
export: headings land on 243, which is `#f3f3f3` exactly.

### Rhythm: Figma's auto-layout gaps are between boxes, this is between ink

Frame 497 declares gaps of 52 / 27 / 9 / 13 / 15. Using them literally puts
every row 1-6px low, because a text node's box is not where its ink starts. The
values in the component are those gaps carried short by the measured difference,
and the result is every ink row in the left column landing on the board's, with
the right column exact at all nine. Measured by row-profiling both renders, not
by eye.

## Verification below the collections carousel

The carousel is a scroll story: the board draws its 1271px sticky view, the page
gives it a runway several times that, so **every anchor below it is displaced by
a real and intended amount**. `verify.mjs` now reads that overshoot off the
applications section's own top (Figma y2839) and rebases the anchors below 1715
by it. Anchors above stay absolute, and each rebased anchor still checks its own
spacing — the overshoot is one number, not fifteen fudge factors.

## The intro's bar is the menu bar — 615:2395

The intro screen carries a **translucent centred plate**, not the page's white
navbar. That plate went missing when the hero was rebuilt at 892 and grew the
solid bar; `615:2395` is it, and it is now its own component:

  plate   330 x 70 at y13, fill `rgba(248,246,243,0.14)`, 1px border
          `rgba(255,255,255,0.67)`
  lockup  285 x 32.087 inside it — 22.5 clear left and right, 18.95 top and
          bottom, i.e. simply centred at 285 wide, which is the lockup
          component's natural 329 scaled 0.8663.

Figma puts the plate 26px left of centre. That is an artefact of the component
being 1396 wide inside a 1440 frame (22 + 672 = 694 against a centre of 720),
not a design decision — on the page it is centred.

**Not built: the mega-menu.** The variant also carries four panels — Engineered
Surfaces (Quartz, Marble, Terazzo, Porcelian Tiles, **Elixir · Premium
Edition**), Karigare (Base, Form), Projects (Residential, Commercial,
Healthcare, Hospitality), World of Kalinga (About, Media, **Blogs**) — as rows
of 226 x 186 image cards 25px below the bar, 47px apart, each a cover image
under a 0.2 black wash with a Halogen Bold 20/+2 white label at y147 carrying a
`-3px 4px 5.5px rgba(0,0,0,0.35)` shadow. Variant6's bar has **no labels to open
them from**, so there is nothing to hang the hover on. Elixir and Blogs are also
new — neither is in the hamburger drawer's four sections.

### Two bugs the intro had been carrying

**The 7s hold never happened.** `getSnapshot` is re-read on every render, and
the intro wrote its own `ks-intro-seen` flag on mount — so the next render read
that flag back, decided the intro had been seen, and unmounted it on the spot.
StrictMode's second pass was enough to trigger it. The flag is now written after
the fade completes, when the component is on its way out anyway, so nothing it
reads can change underneath it while it is on screen. Measured: present at 1.5s
and 5.5s, gone by 8.1s (7000 + 900).

**The picture jumped at handover.** Both the intro and the hero run
`object-cover` over the same 16:9 clip, but a viewport-shaped box and the hero's
1440 x 892 crop it differently — 1484 wide against 1586, a ~7% zoom the moment
the intro handed over. The intro's clip is now boxed to the hero's own aspect
and top-anchored; both video elements measure 1440 x 892 at y0, so the handover
is a pure fade.

**A hydration warning came with it.** The pre-paint script stamps
`data-intro-seen` on `<html>`, which the server HTML cannot carry, so React
flagged the attribute. `suppressHydrationWarning` on `<html>` is the fix; it
only reaches one level deep, so nothing else on the page is silenced.

## The collections scroll story hands over by rising, not fading

Each material owns one viewport of scroll: its plate contracts from full-bleed
to 0.7569, then the next plate takes the screen. What was wrong was the handover
— the incoming plate simply cross-faded in at full size, so nothing moved and
the next material appeared on top of the shrinking one out of nowhere.

**The incoming plate is what the shrink reveals.** While the current plate
contracts, the next one's top edge is pinned to the current one's BOTTOM edge,
so the gap the shrink opens is never empty — it is always filled by the material
coming next. Then it climbs the rest of the way:

| the plate in front is at | the incoming plate |
| --- | --- |
| 0 → 0.45 | y 100% → 87.845%, tracking the shrinking bottom edge |
| 0.45 → 1 | y 87.845% → 0, covering as it goes |

87.845% is `50 + restScale x 50` — the resting plate's own bottom edge, so the
two segments meet exactly and there is no seam at 0.45.

A first attempt ran the rise strictly *after* the shrink. That gave motion but
still failed the brief: the gap stayed white for the whole contraction, and you
only saw the next material once the current one had finished. The point is being
able to watch it arrive as the picture gets smaller.

**Outgoing plates do not fade.** They hold their resting pose at opacity 1,
because at rest consecutive plates are the same size in the same place, so the
one on top occludes the one below exactly. A plate more than a stage away parks
at y = 100% — one viewport down, clipped by the sticky box — and its opacity
flips while it is still fully below the fold, so the switch is never seen.

Everything derives from page scroll and nothing is stored, so the sequence
reverses exactly: measured 7/7 sampled stages byte-identical on the way back up.

## Favicon

Generated from the Kalinga mark's own path data (`kalinga-mark.tsx`, the same 12
paths the page uses), white on brand ruby `#70000E` with 14% padding — the mark
is 12 separate shapes, so it needs air to keep its counters open once scaled to
a tab.

Three files in `src/app/`, which is all Next's metadata file convention needs —
no `<link>` tags, no config:

| file | what it serves |
| --- | --- |
| `favicon.ico` | 16 / 32 / 48, PNG-in-ICO |
| `icon.svg` | the scalable one modern browsers prefer |
| `apple-icon.png` | 180 x 180 for iOS home screens |

Next emits all three with hashed query strings, so a deploy busts the browser
cache rather than leaving the old icon in the tab.

**A ruby tile, not the mark on transparency.** Transparent-background ruby
disappears against dark browser chrome — the mark and the chrome are both near
black. The tile also gives the icon a colour to be recognised by at 16px, where
the 2 x 2 geometry itself is below the resolution to read.

**At 16px it is a textured ruby chip, not a legible mark.** If that matters,
the top half of the mark alone (paths 1-6, a 28 x 13.27 box) fills the tile at
twice the scale and reads clearly at 32px — but it is a crop of the client's
logo, so it is not something to adopt without asking them.

## Known Figma-side issues — do not "fix" these

- **`MAXGAURD`** is misspelled in the footer (`544:4401`). Reproduced as-is so
  the discrepancy stays visible. Worth raising with the designer.
- **`615:2395` Variant6 has mega-menu panels but no labels on the bar to open
  them.** Ask for the variant that shows the menu labels before wiring hover.
- **The contact paragraph is lorem again** (`544:4022`). It used to be the real
  Client Care copy. Kept verbatim in a comment in content.ts — see above.
- **`544:3976` "Scrim"** — a vector at x865 y7214 covering only the top third of
  the testimonial cards. It does not appear in the rendered frame and no
  plausible edge-fade has that geometry. Treated as a stray layer and omitted.
- **`551:5470` "Rectangle 152"** used to be parked off-canvas at x1456. It has
  since moved on-canvas to x-3 y4420 and is now one of the MaxGuard scrims.
- Card captions are hand-placed: rule widths 23.18 vs 28.39, caption tops
  8162.42 vs 8173.58. The *text* tops land within 2.4px, so one uniform value
  is correct and the variance is noise.
- The header bar carries **no navigation** — the lockup alone. All site
  navigation is in the footer. That is what the frame contains.

## The ghost headline is pure white, not a tint

An earlier pass rendered the MaxGuard ghost text at 55% white — plausible, and
wrong. Alpha-solving the stroke against its own background in the Figma render
(sample the composite, solve per channel) gives **[1.00, 1.00, 1.00]**: a
coherent per-channel alpha, which is what a *valid* solve looks like. An
incoherent result would have meant the assumption was wrong.
`get_design_context` independently says plain `text-white`, no opacity.

The headline reads soft because the face is XThin, not because it is faded.
The build now solves to the same [1.00, 1.00, 1.00] against Figma.

## Deviations, stated

- **Copy is Figma's lorem ipsum, verbatim**, including `"Lorem ipsum hakdinaik
  ahdk"`. Only the footer nav is real now — the contact paragraph went back to
  lorem on the board. All of it lives in
  [content.ts](src/lib/content.ts) so real copy drops in without touching layout.
- **No copyright line in the footer.** An earlier pass added one; Figma has
  none, so it was removed rather than kept as unrequested scope.
- The heading clamp below 889px (see Type).

## Outstanding

1. **Testimonial videos.** The four plates are poster frames; Figma draws a play
   control on each. `videoHref` is `null` in `content.ts`, so the card renders
   as a poster with a disabled control rather than a dead link.
2. **Higher-resolution imagery**, or approval to super-resolve — see Assets.
   The new contact plate is 1440px against a 1440px box, i.e. exactly 1x.
   Quartz (Figma 759:9016) replaced the Michelangelo slab and is a 1672 x 941
   render, so it dropped from the 2880 master to 1.16x; with Marble at 1.03x
   that is two of the four collection plates now source-limited.
   The two clips have the same problem: the hero is 0.89× and the visualiser
   1.33× against their boxes. The hero also wants a re-render at the section's
   1.345 aspect rather than 16:9 — see Video.
3. Routes other than `/` do not exist yet, so `next/link` prefetches to
   `/collections`, `/contact` etc. return 404 in the console. Expected: only the
   homepage was in scope.
