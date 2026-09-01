import Image from "next/image";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { maxguard } from "@/lib/content";

/**
 * MaxGuard band — Figma 542:5281 (plate) and siblings, y4092 -> 4747 (655 tall).
 *
 * Positions rebased to the band top:
 *   ghost "lorem"      x434  y78
 *   ghost "ipsum"      x684  y192
 *   ghost "cal"        x684  y284
 *   warranty badge     x1176 y21   197 x 132
 *   Discover MaxGuard  x649  y500
 *   MaxGuard lockup    x60   y521  273 x 59
 *   "Download the App" x81   y581
 *   store badges       x340  y570  248 x 41.6
 *
 * The badge and the lockup are the alpha-bearing ORIGINALS. Figma's `export` of
 * both has opaque white flattened behind it, which is invisible in Figma (they
 * sit on white there) and would print a white box over the photograph here.
 *
 * Ghost type is Haas Grot Disp **Round** 25 XThin 90 / +13.5 — the only use of
 * the Round cut or of a sub-300 weight anywhere on the page.
 *
 * It is pure white at FULL opacity, not a tint. An earlier pass had it at 55%,
 * which is the sort of thing that looks plausible and is simply wrong:
 * alpha-solving the stroke against its own background in the Figma render gives
 * [1.00, 1.00, 1.00] — a coherent per-channel alpha, i.e. a valid solve, and
 * `get_design_context` says plain `text-white` with no opacity. The headline
 * reads as soft because the face is XThin, not because it is faded.
 */
export function MaxGuard() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-label="MaxGuard">
      <div className="relative aspect-[1440/655] min-h-[420px] w-full">
        <Image
          src="/images/maxguard-scene.webp"
          alt="A kitchen with MaxGuard-protected surfaces"
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* Ghost headline. Positioned as a percentage of the 1472 x 655 plate so
            it stays locked to the counter as the plate scales. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {maxguard.ghost.map((word, i) => (
            <span
              key={word}
              className="ghost-display absolute text-white"
              style={{
                left: `${[434, 684, 684][i] / 1472 * 100}%`,
                top: `${[78, 192, 284][i] / 655 * 100}%`,
                // 90 / 1440 = 6.25vw and 13.5 / 1440 = 0.9375vw, so a 1440
                // viewport lands on Figma's exact 90 / +13.5.
                fontSize: "clamp(28px, 6.25vw, 90px)",
                letterSpacing: "clamp(4px, 0.9375vw, 13.5px)",
              }}
            >
              {word}
            </span>
          ))}
        </div>

        <Reveal
          className="absolute right-[6.5%] top-[3.2%] w-[13.4%] max-w-[197px] min-w-[92px]"
          delay={200}
        >
          <Image
            src="/images/badge-warranty.webp"
            alt="Lifetime warranty — 99.9% bacteria-free surfaces"
            width={394}
            height={263}
            className="h-auto w-full"
          />
        </Reveal>

        <div className="absolute left-1/2 top-[76.3%] -translate-x-1/2">
          <KsButton href={maxguard.cta.href} variant="outline">
            {maxguard.cta.label}
          </KsButton>
        </div>

        {/* Lockup + app prompt + store badges, bottom-left on the page gutter. */}
        <div className="absolute left-6 bottom-[5%] flex flex-col gap-[14px] lg:left-[60px]">
          <Image
            src="/images/maxguard-logo.webp"
            alt="MaxGuard — Building Trust. Delivering Value."
            width={546}
            height={264}
            className="h-[42px] w-auto lg:h-[59px]"
          />
          <div className="flex flex-wrap items-center gap-[38px]">
            <p className="font-body text-[13px] tracking-[3px] text-ink uppercase">
              {maxguard.appPrompt}
            </p>
            <div className="flex items-center gap-[10px]">
              {maxguard.stores.map((store, i) => (
                <a
                  key={store.label}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={store.label}
                  className="block h-[41.6px] w-[119px] overflow-hidden transition-opacity hover:opacity-80"
                >
                  {/* One 894x150 plate holds both badges; each link shows its half. */}
                  <span
                    className="block h-full w-[248px]"
                    style={{
                      marginLeft: i === 0 ? 0 : "-129px",
                      backgroundImage: "url(/images/app-badges.webp)",
                      backgroundSize: "248px 41.6px",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
