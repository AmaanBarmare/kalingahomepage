import Image from "next/image";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { maxguard } from "@/lib/content";

/**
 * MaxGuard band — the band runs y4092 -> 4747 (655 tall). Every node below is
 * rebased to that top and expressed as a percentage of the 1440 x 655 box, so
 * the whole composition scales as one piece.
 *
 *   542:5281  scene           x   0   y   0     1440 x 655   <- see note below
 *   551:5465  ghost "lorem"   x 434   y  78      343.9 x 95.53
 *   551:5466  ghost "ipsum"   x 684   y 192      333 x 92
 *   551:5468  ghost "cal"     x 684   y 284      210 x 95
 *   551:5467  foreground      x 215   y 106      723 x 418    <- 1:1, no scaling
 *   542:5282  warranty badge  x1176   y  21      197 x 132
 *   542:5290  KS/Button       x 649   y 500      184.19 x 42.69
 *   542:5283  MaxGuard lockup x  60   y 520.8    273.25 x 59.17
 *   542:5289  store badges    x 340   y 570.41   248.01 x 41.61
 *   542:5284  "Download..."   x  80.9 y 580.85   253 x 21
 *
 * THE SCENE IS TWO LAYERS, NOT ONE. 551:5467 is the same couple cut out of
 * 542:5281 and drawn back on top, so the ghost type sits BETWEEN them — that is
 * what puts the "I" of IPSUM behind the man's head. Compositing the type over a
 * single flat plate is wrong and reads immediately as wrong. Template-matching
 * the cutout against Figma's own render of the frame puts it at (215, 106) at
 * scale 1.000 with r = 0.9996 — the node's coordinates, taken literally.
 *
 * Note it does NOT sit exactly on the couple already in the scene: the closest
 * fit to those pixels would be (224, 109) at 702x406. The cutout is deliberately
 * a touch larger and higher, so it fully covers the pair underneath. Do not
 * "correct" it onto the background couple — that reintroduces a visible edge.
 *
 * THE PLATE'S NODE BOX LIES. 542:5281 reports x-16 and width 1472, which reads
 * like a 16px bleed on each edge — but Figma CROPS the fill to the frame rather
 * than scaling into that box. Matching a clean background patch (the left
 * cabinets, clear of the badge, type and cutout) against Figma's own render of
 * the frame gives scale 1.000 at offset (0,0), r = 0.998: the scene is 1:1
 * across 1440. Scaling it to 1472 zooms the whole kitchen ~2% and drags every
 * landmark right. Everything here is positioned against 1440 / 655; the earlier
 * pass divided the ghost x by 1472 and sat ~10px left as a result.
 *
 * Ghost type is Haas Grot Disp **Round** 25 XThin 90 / +13.5 — the only use of
 * the Round cut or of a sub-300 weight anywhere on the page. It is pure white at
 * FULL opacity, not a tint: alpha-solving the stroke against its own background
 * in the Figma render gives [1.00, 1.00, 1.00], a coherent per-channel alpha and
 * therefore a valid solve. It reads soft because the face is XThin.
 *
 * "Download the App" is **Halogen Medium 13.053 / +4.3511** (542:5284) — the
 * display face, not the body one, and much wider tracking than it looks.
 *
 * The badge, lockup and store strip are alpha-bearing originals. Figma's own
 * `export` of each has opaque white flattened behind it, invisible in Figma
 * (they sit on white there) and a white box over the photograph here.
 */

const PCT = (v: number, total: number) => `${(v / total) * 100}%`;
const X = (v: number) => PCT(v, 1440);
const Y = (v: number) => PCT(v, 655);
/** px in the 1440 frame -> vw, so type scales with the plate like the images do */
const VW = (px: number) => `${((px / 1440) * 100).toFixed(5)}vw`;

const GHOST = [
  { x: 434, y: 78 },
  { x: 684, y: 192 },
  { x: 684, y: 284 },
];

export function MaxGuard() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-label="MaxGuard">
      <div className="relative aspect-1440/655 w-full">
        {/* 1. the scene, 1:1 across the frame */}
        <Image
          src="/images/maxguard-scene.webp"
          alt="A kitchen with MaxGuard-protected surfaces"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />

        {/* 2. the ghost headline, over the scene but under the couple */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {maxguard.ghost.map((word, i) => (
            <span
              key={word}
              className="ghost-display absolute text-white"
              style={{
                left: X(GHOST[i].x),
                top: Y(GHOST[i].y),
                fontSize: `clamp(28px, ${VW(90)}, 90px)`,
                letterSpacing: `clamp(4px, ${VW(13.5)}, 13.5px)`,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* 3. the couple, cut out of the scene and laid back over the type */}
        <Image
          src="/images/maxguard-foreground.webp"
          alt=""
          aria-hidden
          width={723}
          height={418}
          sizes="51vw"
          className="pointer-events-none absolute"
          style={{ left: X(215), top: Y(106), width: X(723), height: Y(418) }}
        />

        <div className="absolute" style={{ left: X(1176), top: Y(21), width: X(197) }}>
          <Reveal delay={200}>
            <Image
              src="/images/badge-warranty.webp"
              alt="Lifetime warranty — 99.9% bacteria-free surfaces"
              width={394}
              height={263}
              sizes="14vw"
              className="h-auto w-full"
            />
          </Reveal>
        </div>

        <div className="absolute" style={{ left: X(649), top: Y(500) }}>
          <KsButton href={maxguard.cta.href} variant="outline">
            {maxguard.cta.label}
          </KsButton>
        </div>

        <Image
          src="/images/maxguard-logo.webp"
          alt="MaxGuard — Building Trust. Delivering Value."
          width={546}
          height={119}
          sizes="19vw"
          className="absolute"
          style={{ left: X(60), top: Y(520.8), width: X(273.25), height: "auto" }}
        />

        <p
          className="absolute font-display font-medium whitespace-nowrap text-ink uppercase"
          style={{
            left: X(80.89),
            top: Y(580.85),
            fontSize: `clamp(9px, ${VW(13.053)}, 13.053px)`,
            letterSpacing: `clamp(1.5px, ${VW(4.3511)}, 4.3511px)`,
            lineHeight: 1.58,
          }}
        >
          {maxguard.appPrompt}
        </p>

        {/* One 248 x 41.6 strip holds both badges; each link shows its half. */}
        <div
          className="absolute flex"
          style={{ left: X(339.99), top: Y(570.41), width: X(248.01), height: Y(41.61) }}
        >
          {maxguard.stores.map((store, i) => (
            <a
              key={store.label}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={store.label}
              className="block h-full overflow-hidden transition-opacity hover:opacity-80"
              style={{ width: "50%" }}
            >
              <span
                className="block h-full"
                style={{
                  width: "200%",
                  marginLeft: i === 0 ? 0 : "-100%",
                  backgroundImage: "url(/images/app-badges.webp)",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
