import Image from "next/image";
import Link from "next/link";
import { KalingaLogo } from "@/components/ui/kalinga-logo";
import { footer } from "@/lib/content";

/**
 * Footer — Figma 555:2863, 1440 x 774 at y9075.
 *
 * THE 84px OVERLAP. The contact band above runs to 9159 and is drawn over this
 * frame's first 84px, so the footer element can only start at 9159 and pays the
 * overlap out of its own top padding: 168 - 84 = 84 (87 to land the lockup's
 * ink, which sits 3px inside its box). Height goes 774 -> 690 with it. Nothing
 * is lost — the only thing in 9075..9159 is background. Every anchor below is
 * therefore given in FIGMA FOOTER coordinates; subtract 84 for this element.
 *
 *   lockup        x79   y168, ink 171..208
 *   Frame 497     x79   y245   left column block
 *     Find a store      y251 ink · sub-line y277 · search row y321 · rule y353
 *     FOLLOW US         y407 · newsletter y434 + y455 · socials y486 (159 x 25)
 *   Frame 492     x1027 y160   link columns, second column at x1252
 *     COLLECTIONS / PROJECTS y169 ink, links on a 33px pitch
 *     KARIGEAR / ABOUT       y411, and the ABOUT block runs on 38 not 33
 *   legal row     x477.5 y664, three items on a 56px gap
 *   bottom rule   x82.5  y724, 1275 wide
 *
 * TWO TYPE FAMILIES, and the split is real. The left column is Haas Grot Disp
 * **Trial** with Halogen headings; the right columns and the legal row are Haas
 * Grot Disp **R** (Round) Trial. --font-nav carries the Round — see globals.css
 * for why it currently falls back to the Display cut. Peaks sampled off the
 * board confirm the fills: headings land on 243 = #f3f3f3 exactly, links on
 * ~167 = white/70, everything in the left column on white.
 *
 * "55 Roman" is Haas's REGULAR, not medium — 45 Light / 55 Roman / 65 Medium /
 * 75 Bold. Setting the headings to 500 put 30% more ink on the glyphs than the
 * board has; they are 400.
 *
 * THE BACKGROUND is the Kalinga mark tiled on a 97 x 49 period — TWO mirrored
 * marks per period, which is why a single-mark tile reads as the wrong motif.
 * It is a raster because the board draws it as 1487 loose vectors with no
 * recoverable arrangement; this tile was folded out of 12 clean periods of the
 * board's own render and correlates back against it at r = 0.98. It also fades:
 * sampling the peak per row shows nothing until y200 and a decelerating ramp to
 * 21/255 by the base, which is the mask below. A flat tile is visibly wrong at
 * the top of the frame.
 *
 * There is NO centre watermark. An earlier pass put one at x678 y341; the board
 * has only background there.
 */

/** 21/255 — the pattern's peak against black, sampled off the board. */
const PATTERN_PEAK = 0.082;

/**
 * The fade, in this element's own 690px (Figma footer y minus 84). Measured,
 * not eased by eye: the ramp decelerates, so it takes stops rather than two.
 */
const PATTERN_FADE =
  "linear-gradient(to bottom, transparent 16.8%, rgba(0,0,0,0.14) 24.1%, rgba(0,0,0,0.29) 31.3%, " +
  "rgba(0,0,0,0.48) 45.8%, rgba(0,0,0,0.67) 60.3%, rgba(0,0,0,0.86) 74.8%, rgba(0,0,0,0.95) 89.3%, #000 100%)";

/** Halogen Regular, 12px — 555:4315 and 555:4329. */
const SECTION_LABEL = "font-display text-[12px] font-normal text-white uppercase";
/** Haas Grot Disp Trial 45 Light, 14px — 555:4316 and 555:4330. */
const LEFT_BODY = "font-body text-[14px] leading-normal font-light tracking-[1px] text-white";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(/images/footer-pattern.png)",
          backgroundSize: "97px 49px",
          // The tile's origin sits at Figma footer x45 y40; y40 is one period
          // above this element's top, which leaves 5.
          backgroundPosition: "45px 5px",
          opacity: PATTERN_PEAK,
          maskImage: PATTERN_FADE,
          WebkitMaskImage: PATTERN_FADE,
        }}
      />

      <div className="relative mx-auto grid w-full max-w-360 grid-cols-1 items-start gap-14 px-6 pt-16 pb-24.5 lg:grid-cols-[415px_1fr] lg:gap-0 lg:px-19.75 lg:pt-21.75">
        {/* ------------------------------------------------ left column */}
        <div className="lg:w-103.75">
          <KalingaLogo variant="white" />

          {/* Figma's auto-layout gaps are 52 / 27 / 9 / 13 / 15, but those are
              between text BOXES and this is between rendered ink, so each is
              carried 1-6px short. The values here land every ink row in this
              column on the board's, measured. */}
          <div className="mt-8.25 flex flex-col gap-12.25">
            <div className="flex w-full max-w-103.9 flex-col gap-6.5">
              <div className="flex flex-col gap-1.75">
                <h2 className={`${SECTION_LABEL} tracking-[2px]`}>{footer.findAStore.title}</h2>
                <p className={LEFT_BODY}>{footer.findAStore.body}</p>
              </div>

              <form className="flex flex-col gap-3.25" action="/stores" role="search" aria-label="Find a store">
                <div className="flex items-end justify-between">
                  <input
                    type="search"
                    name="q"
                    placeholder={footer.findAStore.placeholder}
                    aria-label={footer.findAStore.placeholder}
                    className={`${LEFT_BODY} min-w-0 flex-1 bg-transparent text-[13px] placeholder:text-white/85 focus:outline-none`}
                  />
                  <div className="flex shrink-0 items-start gap-2.25">
                    <button type="submit" aria-label="Search stores" className="opacity-90 hover:opacity-100">
                      <Image src="/icons/search.svg" alt="" width={20} height={20} className="size-[20.3px]" />
                    </button>
                    <span aria-hidden className="text-[13.5px] leading-normal text-white/60">
                      |
                    </span>
                    <button type="button" aria-label="Use my location" className="opacity-90 hover:opacity-100">
                      <Image src="/icons/gps.svg" alt="" width={20} height={20} className="size-[20.3px]" />
                    </button>
                  </div>
                </div>
                <div className="h-px w-full bg-white/35" />
              </form>
            </div>

            <div className="flex flex-col">
              <h2 className={`${SECTION_LABEL} tracking-[1.0247px]`}>{footer.follow.title}</h2>
              <p className={`${LEFT_BODY} mt-2.25 max-w-103.75`}>
                <Link href="/newsletter" className="underline underline-offset-2 hover:text-white/80">
                  {footer.follow.linkText}
                </Link>{" "}
                to receive latest updates from Kalinga Stone.
              </p>

              {/* One 159 x 25 plate holds all three marks; each link takes a third. */}
              <div className="relative mt-3.5 h-6.25 w-39.75">
                <Image src="/icons/socials.svg" alt="" width={159} height={25} className="h-6.25 w-39.75" />
                <div className="absolute inset-0 flex">
                  {footer.follow.socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="flex-1"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ link columns
            Frame 492 starts at y160, 11px above the lockup's own box. */}
        <div className="grid grid-cols-2 gap-x-15 gap-y-10 lg:-mt-3.25 lg:ml-auto lg:w-83.5 lg:grid-cols-[225px_1fr] lg:gap-x-0">
          {footer.columns.map((col, ci) => (
            <div key={ci} className="flex flex-col">
              {col.groups.map((group, gi) => (
                <div key={group.title} className={gi > 0 ? "mt-21.5" : ""}>
                  <h2 className="font-nav text-[16px] font-normal tracking-[1.5px] text-[#f3f3f3] uppercase">
                    {group.title}
                  </h2>
                  {/* All four groups now run on the same 33px pitch. The fourth
                      used to be a headless block of uppercase lines on 38 —
                      the board turned it into DISCOVER + three links. */}
                  <ul className="mt-2.25">
                    {group.links.map((link) => (
                      <li key={link} className="h-8.25">
                        <Link
                          href={`/${link.toLowerCase()}`}
                          className="font-nav text-[16px] font-light tracking-[2px] text-white/70 transition-colors hover:text-white"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ legal + rule */}
      <div className="relative mx-auto w-full max-w-360 px-6 lg:px-[82.5px]">
        <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-3">
          {footer.legal.map((item) => (
            <li key={item}>
              <Link
                href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-nav text-[13px] font-light tracking-[1px] text-white uppercase transition-colors hover:text-white/70"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 h-px w-full bg-white/25" />
        <div className="h-12.5" />
      </div>
    </footer>
  );
}
