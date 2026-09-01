import Image from "next/image";
import Link from "next/link";
import { KalingaLogo } from "@/components/ui/kalinga-logo";
import { KalingaMark, markTileDataUri } from "@/components/ui/kalinga-mark";
import { footer } from "@/lib/content";

/**
 * Footer — Figma 555:2863, 1440 x 774 at y9075.
 *
 * Anchors, rebased to the footer top:
 *   logo lockup       x79  y168   (measured bbox 171..199 on the wordmark's caps)
 *   Find a store      x79  y245
 *   sub-line          x79  y273
 *   search row        x79  y321,  rule at y354.6, 415.6 wide, icons at x428
 *   FOLLOW US         x79  y406.3
 *   newsletter line   x79  y429.3
 *   socials           x79  y486.3, 159 x 25
 *   COLLECTIONS col   x1027 y160, links on a 33px pitch
 *   KARIGARE  block   x1027 y411
 *   PROJECTS   col    x1252 y160
 *   ABOUT block       x1252 y411
 *   legal row         x477.5 y664
 *   bottom rule       x82.5 y724, 1274 wide
 *   centre watermark  x678  y341, ~82 wide
 *
 * The background is the Kalinga mark tiled on a measured 48px period. Sampled
 * across a clean patch the pattern runs 0..21 luminance, so it is a near-black
 * on black — present but barely. Drawn from the mark's own path data rather
 * than shipped as a raster, so it stays crisp at any density and costs nothing.
 */
export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: markTileDataUri("%23141212"), backgroundSize: "48px 49px" }}
      />

      {/* Centre watermark — the mark alone, white, behind the columns. */}
      <KalingaMark
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[44%] hidden h-[84px] w-[82px] -translate-x-1/2 text-white lg:block"
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-14 px-6 pt-[120px] pb-[56px] lg:grid-cols-[415px_1fr] lg:gap-0 lg:px-[79px] lg:pt-[168px]">
        {/* ------------------------------------------------ left column */}
        <div className="lg:w-[415px]">
          <KalingaLogo variant="white" />

          <h2 className="mt-[48px] font-body text-[14px] tracking-[2.4px] text-white uppercase">
            {footer.findAStore.title}
          </h2>
          <p className="mt-[9px] font-body text-[14px] leading-[21px] font-light text-white/70">
            {footer.findAStore.body}
          </p>

          <form
            className="mt-[27px] w-full max-w-[415.6px]"
            action="/stores"
            role="search"
            aria-label="Find a store"
          >
            <div className="flex items-center border-b border-white/35 pb-[13px]">
              <input
                type="search"
                name="q"
                placeholder={footer.findAStore.placeholder}
                aria-label={footer.findAStore.placeholder}
                className="min-w-0 flex-1 bg-transparent font-body text-[14px] text-white placeholder:text-white/55 focus:outline-none"
              />
              <button type="submit" aria-label="Search stores" className="ml-3 shrink-0 opacity-80 hover:opacity-100">
                <Image src="/icons/search.svg" alt="" width={20} height={20} className="size-[20.3px]" />
              </button>
              <span aria-hidden className="mx-[9px] text-white/40">
                |
              </span>
              <button type="button" aria-label="Use my location" className="shrink-0 opacity-80 hover:opacity-100">
                <Image src="/icons/gps.svg" alt="" width={20} height={20} className="size-[20.3px]" />
              </button>
            </div>
          </form>

          <h2 className="mt-[52px] font-body text-[14px] tracking-[2.4px] text-white uppercase">
            {footer.follow.title}
          </h2>
          <p className="mt-[10px] max-w-[415px] font-body text-[14px] leading-[21px] font-light text-white/70">
            <Link href="/newsletter" className="underline underline-offset-4 hover:text-white">
              {footer.follow.linkText}
            </Link>{" "}
            to receive latest updates from Kalinga Stone.
          </p>

          {/* One 159 x 25 plate holds all three marks; each link takes a third. */}
          <div className="relative mt-[33px] h-[25px] w-[159px]">
            <Image src="/icons/socials.svg" alt="" width={159} height={25} className="h-[25px] w-[159px]" />
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

        {/* ------------------------------------------------ link columns */}
        <div className="grid grid-cols-2 gap-x-[60px] gap-y-10 lg:ml-auto lg:w-[334px] lg:grid-cols-[225px_1fr] lg:gap-x-0">
          {footer.columns.map((col, ci) => (
            <div key={ci} className="flex flex-col">
              {col.groups.map((group, gi) => (
                <div key={group.title ?? `g${gi}`} className={gi > 0 ? "mt-[100px]" : ""}>
                  {group.title ? (
                    <h2 className="font-body text-[14px] tracking-[1.6px] text-white uppercase">{group.title}</h2>
                  ) : null}
                  <ul className={group.title ? "mt-[14px]" : ""}>
                    {group.links.map((link) => (
                      <li key={link} className="h-[33px]">
                        <Link
                          href={`/${link.toLowerCase()}`}
                          className={
                            group.headingStyle
                              ? "font-body text-[14px] tracking-[1.6px] text-white uppercase transition-colors hover:text-white/70"
                              : "font-body text-[14px] font-light text-white/65 transition-colors hover:text-white"
                          }
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
      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-[82.5px]">
        <ul className="flex flex-wrap justify-center gap-x-[56px] gap-y-3">
          {footer.legal.map((item) => (
            <li key={item}>
              <Link
                href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-body text-[11px] tracking-[1.4px] text-white/70 uppercase transition-colors hover:text-white"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-[48px] h-px w-full bg-white/25" />
        <div className="h-[50px]" />
      </div>
    </footer>
  );
}
