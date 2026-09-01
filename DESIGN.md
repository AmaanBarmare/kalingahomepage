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

## The MaxGuard band is two photographic layers, not one

`551:5467` is the **same couple, cut out** of the scene `542:5281` and drawn
back on top. The ghost type sits between them, which is what puts the "I" of
IPSUM behind the man's head. Composited over a single flat plate the type runs
across their faces, and it reads as wrong instantly.

Layer order, bottom to top: scene -> ghost type -> cutout -> badge, button,
lockup, app row. (Figma stacks the cutout above the UI too, but the overlap is
transparent there, and a photo layer over a link would eat the click.)

| node | element | x | y | size |
|---|---|---|---|---|
| 542:5281 | scene | 0 | 0 | 1440 x 655 |
| 551:5465 | ghost "lorem" | 434 | 78 | 343.9 x 95.53 |
| 551:5466 | ghost "ipsum" | 684 | 192 | 333 x 92 |
| 551:5468 | ghost "cal" | 684 | 284 | 210 x 95 |
| 551:5467 | **cutout** | 215 | 106 | 723 x 418 |
| 542:5282 | warranty badge | 1176 | 21 | 197 x 132 |
| 542:5290 | KS/Button | 649 | 500 | 184.19 x 42.69 |
| 542:5283 | MaxGuard lockup | 60 | 520.8 | 273.25 x 59.17 |
| 542:5289 | store badges | 339.99 | 570.41 | 248.01 x 41.61 |
| 542:5284 | "Download the App" | 80.89 | 580.85 | 253 x 21 |

### The scene node's box lies about its own size

`542:5281` reports **x -16, width 1472** — which reads as a 16px bleed past both
frame edges, and that is how the previous pass built it. It is wrong. Figma
**crops** the fill to the frame rather than scaling into that box. Matching a
clean background patch (the left cabinets — clear of the badge, the type and the
cutout) against Figma's own render of the frame returns **scale 1.000 at offset
(0, 0), r = 0.998**. Scaling the plate to 1472 zooms the whole kitchen ~2% and
drags every landmark right.

Worse, the previous pass divided the ghost x by 1472 while those x values are
frame coordinates, so the type sat ~10px left of where it belongs. If a divisor
is ever in doubt, render the frame from Figma and match a patch — do not reason
about it from the node box.

### The cutout does not sit on the couple already in the scene

Template-matching the cutout against Figma's frame render gives (215, 106) at
scale 1.000, r = **0.9996** — the node's coordinates taken literally. But the
placement that best fits the *background* couple is (224, 109) at 702 x 406.
The cutout is deliberately a touch larger and higher so it fully covers the pair
underneath. Do not "correct" it onto them: that reintroduces a visible edge.

### "Download the App" is the display face

`542:5284` is **Halogen Medium 13.053 / +4.3511**, not the body font at 13 / +3.
The tracking is nearly half again what it looks like, and it is the difference
between a 253px run and a 170px one.

### Ghost widths do not match their frames, and that is fine

Rendered vs Figma box: lorem 340.8 / 343.9, ipsum 300.3 / 333, cal 188 / 210.
Only lorem is close — and lorem is the one that settles it, because the three
boxes are hand-drawn (heights 95.53 / 92 / 95 for identical one-line text at one
size). One font at one size and tracking: if one word matches, they all do, and
the boxes are the loose thing.

Verified against Figma's own render of the band: median per-pixel difference
**3.67**, with the scene and the couple both at mean 5.6 — WebP and resampling
noise. The amplified difference map is thin edge outlines only.

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

### The hero clip is 16:9 and its box is not

1.778 against a box of 1.345, so `object-cover` **hides 24.4% of the width** —
and at 1280px on a 1440px box it is already under 1×. It is an 8-shot montage
(slab, hand, kitchen, living room, bath, edge, arch, slab), so it is worth
re-rendering at 1920×1440 or wider rather than cropping harder. The visualiser
has no such problem: 1.778 against 1.767 loses 0.6%.

---

## Known Figma-side issues — do not "fix" these

- **`MAXGAURD`** is misspelled in the footer (`544:4401`). Reproduced as-is so
  the discrepancy stays visible. Worth raising with the designer.
- **`544:3976` "Scrim"** — a vector at x865 y7214 covering only the top third of
  the testimonial cards. It does not appear in the rendered frame and no
  plausible edge-fade has that geometry. Treated as a stray layer and omitted.
- **`551:5470` "Rectangle 152"** is at **x1456** on a 1440-wide frame — parked
  off-canvas. Not built. (Amaha Part 1 §3: check `0 ≤ x < frameWidth` first.)
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
  ahdk"`. Only the contact paragraph and footer nav are real. All of it lives in
  [content.ts](src/lib/content.ts) so real copy drops in without touching layout.
- **No copyright line in the footer.** An earlier pass added one; Figma has
  none, so it was removed rather than kept as unrequested scope.
- The heading clamp below 889px (see Type).

## Outstanding

1. **Testimonial videos.** The four plates are poster frames; Figma draws a play
   control on each. `videoHref` is `null` in `content.ts`, so the card renders
   as a poster with a disabled control rather than a dead link.
2. **Higher-resolution imagery**, or approval to super-resolve — see Assets.
   The two clips have the same problem: the hero is 0.89× and the visualiser
   1.33× against their boxes. The hero also wants a re-render at the section's
   1.345 aspect rather than 16:9 — see Video.
3. Routes other than `/` do not exist yet, so `next/link` prefetches to
   `/collections`, `/contact` etc. return 404 in the console. Expected: only the
   homepage was in scope.
