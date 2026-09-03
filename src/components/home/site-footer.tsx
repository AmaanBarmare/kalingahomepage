import Image from "next/image";
import Link from "next/link";
import { KalingaLogo } from "@/components/ui/kalinga-logo";
import { footer } from "@/lib/content";

/**
 * Footer — Figma 880:27210 (Group 323 1), 1440 x 788.
 *
 * REBUILT. The board replaced the two-columns-of-two-groups arrangement with
 * four flat link columns, deleted the FOLLOW US block and the centred legal
 * row, and added two new rows under a rule apiece.
 *
 * THE 84px OVERLAP SURVIVES THE REWRITE, and it is worth restating because it
 * is the one number here that is not local. The footer frame opens at 41.37% of
 * the 1344-tall group, i.e. y556, while the contact band above runs to y640 —
 * so the band is drawn over this frame's first 84px. The element therefore
 * starts where the band ends and pays the overlap out of its own top padding.
 * Nothing is lost: the only thing in 556..640 is background.
 *
 * Geometry, in FOOTER-FRAME coordinates (subtract 84 for this element):
 *
 *   content block  x79  y169, 1294 wide, a flex column on a 68px gap
 *     link columns       y169   ml497 -> x576, gap 73, widths 211 / 97 / auto
 *     lockup             y171   328.68 x 37
 *     find a store       y245   415.6 wide
 *   rule                 · offices + contacts · rule · socials + copyright
 *
 * The four gaps between those rows are a uniform 68. Column links stack on a
 * 14px gap at 16px/normal, which lands the same 33px pitch the old 33px rows
 * ran on — the pitch is unchanged, the way it is reached is not.
 *
 * TWO TYPE FAMILIES, and the split is real. The left column is Haas Grot Disp
 * **Trial** with a Halogen heading; the link columns are Haas Grot Disp **R**
 * (Round) Trial. --font-nav carries the Round — see globals.css for why it
 * currently falls back to the Display cut.
 *
 * "55 Roman" is Haas's REGULAR, not medium — 45 Light / 55 Roman / 65 Medium /
 * 75 Bold. Column headings are 400.
 *
 * THE BACKGROUND is the Kalinga mark tiled on a 97 x 49 period — TWO mirrored
 * marks per period, which is why a single-mark tile reads as the wrong motif.
 * The board now also ships the whole field as one 170KB SVG; this keeps the
 * raster tile, which correlates back against the board's own render at r = 0.98
 * for a fraction of the bytes. It also fades: nothing until y200, then a
 * decelerating ramp to 21/255 by the base, which is the mask below.
 *
 * THE ICONS ARE THE BOARD'S OWN EXPORTS, one file per mark. The socials used to
 * be a single flattened 159 x 25 strip with three invisible links laid over it;
 * they are named links with their own icon now, so the strip is gone and
 * public/icons carries instagram / facebook / linkedin / youtube separately,
 * plus pin / phone / mail / copyright. All are white fills — they come through
 * next/image as isolated documents and cannot inherit colour, so nothing here
 * tries to tint them.
 */

/** 21/255 — the pattern's peak against black, sampled off the board. */
const PATTERN_PEAK = 0.082;

/**
 * The fade. Measured, not eased by eye: the ramp decelerates, so it takes
 * stops rather than two. Expressed in percentages, so it survived the frame
 * growing from 690 to 788.
 */
const PATTERN_FADE =
  "linear-gradient(to bottom, transparent 16.8%, rgba(0,0,0,0.14) 24.1%, rgba(0,0,0,0.29) 31.3%, " +
  "rgba(0,0,0,0.48) 45.8%, rgba(0,0,0,0.67) 60.3%, rgba(0,0,0,0.86) 74.8%, rgba(0,0,0,0.95) 89.3%, #000 100%)";

/** 665:8871 — Halogen Regular 12 / +2, uppercase. */
const SECTION_LABEL = "font-display text-[12px] font-normal tracking-[2px] text-white uppercase";
/** 665:8872 — Haas Grot Disp Trial 45 Light 14 / +1. */
const LEFT_BODY = "font-body text-[14px] leading-normal font-light tracking-[1px] text-white";
/** 1000:95786 / 1000:98497 — Body Copy, 16 / 1.5 / +1, white. */
const ROW_TEXT = "font-body text-[16px] leading-[1.5] font-light tracking-[1px] text-white";

/**
 * The icon rows below the rules stack into one column on a phone, so their
 * marks have to share a left edge AND their text a left edge — the board's own
 * per-row gaps (pin 8, contacts 12, socials 10, copyright 5) are set against
 * DIFFERENT icon widths (17 / 18.125 / 19.5) and only ever sit side by side at
 * lg, where the mismatch is invisible. Below lg every mark gets the same
 * 19.5px slot and every row the same 12px gap, so the text starts at 31.5px on
 * all four. From lg the board's numbers take over unchanged.
 */
const ICON_SLOT = "flex w-[19.5px] shrink-0 justify-center lg:w-auto";

/** The rules at 665:8959 and 1000:98103, full content width. */
function Rule() {
  return <div aria-hidden className="h-px w-full bg-white/25" />;
}

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

      {/* 1000:99354 — x79 y169 minus the 84px overlap = 85, 1294 wide. The
          79/67 gutters are the board's own and are not symmetric; below lg the
          page's own 24px gutter takes over. */}
      <div className="relative mx-auto flex w-full max-w-360 flex-col gap-14 px-6 pt-16 pb-20 lg:gap-[68px] lg:pt-[85px] lg:pr-[67px] lg:pb-[75px] lg:pl-[79px]">
        {/* ---------------------------------------- lockup + store + columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-0">
          {/* 665:8866's left half — lockup on y171, find a store on y245. */}
          <div className="lg:w-[415.6px] lg:shrink-0">
            <KalingaLogo
              variant="white"
              className="w-[270px] origin-left scale-[0.82] min-[360px]:w-[329px] min-[360px]:scale-100"
            />

            <div className="mt-9 flex flex-col gap-[27px] lg:mt-[37px]">
              <div className="flex flex-col gap-[9px]">
                <h2 className={SECTION_LABEL}>{footer.findAStore.title}</h2>
                <p className={`${LEFT_BODY} max-w-[368px]`}>{footer.findAStore.body}</p>
              </div>

              <form
                className="flex flex-col gap-[13px]"
                action="/stores"
                role="search"
                aria-label="Find a store"
              >
                <div className="flex items-end justify-between">
                  <input
                    type="search"
                    name="q"
                    placeholder={footer.findAStore.placeholder}
                    aria-label={footer.findAStore.placeholder}
                    className={`${LEFT_BODY} min-w-0 flex-1 bg-transparent text-[13px] placeholder:text-white/85 focus:outline-none`}
                  />
                  <div className="flex shrink-0 items-start gap-2.25">
                    <button
                      type="submit"
                      aria-label="Search stores"
                      className="-m-3 p-3 opacity-90 hover:opacity-100"
                    >
                      <Image src="/icons/search.svg" alt="" width={20} height={20} className="size-[20.3px]" />
                    </button>
                    <span aria-hidden className="text-[13.5px] leading-normal text-white/60">
                      |
                    </span>
                    <button
                      type="button"
                      aria-label="Use my location"
                      className="-m-3 p-3 opacity-90 hover:opacity-100"
                    >
                      <Image src="/icons/gps.svg" alt="" width={20} height={20} className="size-[20.3px]" />
                    </button>
                  </div>
                </div>
                <div className="h-px w-full bg-white/35" />
              </form>
            </div>
          </div>

          {/* 1000:56907 — four columns from x576 on a 73px gap. Two-up on a
              phone, four-up once there is room for them. */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4 lg:ml-[81px] lg:flex lg:gap-[73px]"
          >
            {footer.columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-[14px]">
                <h2 className="font-nav text-[16px] leading-normal font-normal tracking-[1.5px] text-[#f3f3f3] uppercase">
                  {col.title}
                </h2>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-nav text-[16px] leading-normal font-light tracking-[2px] text-white/70 transition-colors hover:text-white lg:whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <Rule />

        {/* ---------------------------------------- 1000:98128 offices + contact */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-[346px]">
          <div className="flex flex-col gap-[10px] lg:w-[493px] lg:shrink-0">
            {footer.offices.map((office) => (
              <div key={office} className="flex items-center gap-3 lg:gap-2">
                <span className={ICON_SLOT}>
                  <Image
                    src="/icons/pin.svg"
                    alt=""
                    width={17}
                    height={20}
                    className="h-5 w-[17px] shrink-0"
                  />
                </span>
                <p className={`${ROW_TEXT} lg:whitespace-nowrap`}>{office}</p>
              </div>
            ))}
          </div>

          {/* 19.333px here, not 16 — the board sets this pair larger than the
              office lines beside them. */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-[95px]">
            {footer.contacts.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className={ICON_SLOT}>
                  <Image src={c.icon} alt="" width={19} height={19} className="size-[18.125px] shrink-0" />
                </span>
                <p className="font-body text-[19.333px] leading-[1.5] font-light tracking-[1.2083px] text-white">
                  {c.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Rule />

        {/* ---------------------------------------- 1000:98921 socials + copyright */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid grid-cols-2 items-center gap-x-10 gap-y-4 lg:flex lg:gap-[41px]">
            {footer.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-opacity hover:opacity-70 lg:gap-[10px]"
                >
                  <Image src={s.icon} alt="" width={20} height={20} className="size-[19.5px] shrink-0" />
                  <span className={ROW_TEXT}>{s.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 lg:gap-[5px]">
            <Image
              src="/icons/copyright.svg"
              alt=""
              width={20}
              height={20}
              className="size-[19.5px] shrink-0"
            />
            {/* The two legal lines keep the board's own 5px between them; only
                the gap after the mark widens below lg to match the rows above. */}
            <div className="flex flex-wrap items-center gap-x-[5px]">
              {footer.copyright.map((line) => (
                <span key={line} className={ROW_TEXT}>
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
