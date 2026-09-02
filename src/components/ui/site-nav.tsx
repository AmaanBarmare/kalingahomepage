"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { KalingaLogo } from "@/components/ui/kalinga-logo";
import { KalingaMark } from "@/components/ui/kalinga-mark";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "@/components/ui/nav-icons";
import { nav } from "@/lib/content";

/**
 * Site navigation — 1040:49584 "Component 107", two states of one 1440 x 911
 * overlay: Frame 675 collapsed, Frame 674 with ENGINEERED SURFACES open.
 *
 * BAR (686:3786) — UNCHANGED by this redesign.
 *   1440 x 90, solid white. Inner row x80 y27, 1280 wide, space-between.
 *   lockup    308 x 35.93 at x80  y27
 *   hamburger  36 x 32    at x1324 y29   (1324 + 36 = 1360 = 1440 - 80)
 *
 * The hamburger is RUBY, not ink — the same #70000E the lockup's two SVGs carry
 * literally, reached here through --color-ruby so the two can never drift. The
 * icon takes it via `currentColor`, which the lockup cannot do: it is served
 * through next/image, and an SVG rendered as its own document inherits nothing.
 *
 * OVERLAY — this is what changed. The 521-wide drawer at #70020f is gone; the
 * panel now takes 1153 of the 1440 (80.07%) at the real brand ruby #70000E,
 * with the page showing through a 287-wide ink scrim at 89% on its left.
 *   close      46 x 41 at x1364 y30, white plate, X 32 centred
 *   column    950 wide at x357 — 70 in from the panel edge, 133 from the right
 *   labels    30/1.58/+5 Halogen Medium uppercase, one every 113px collapsed
 *   rules     1px #9F9F9F, 950 wide, 80px below each label's top
 *   inquiry   y789 · rule y834 · legal y853, i.e. 122 up from the panel base
 *
 * A ROW OPENS INTO A STRIP OF CARDS, not a text list. Open, the row also grows
 * a 33px Kalinga mark to the left of its label (which is why the label shifts
 * from x357 to x418) and a 40 x 40 white plate carrying a ruby arrow at the
 * column's right edge — that arrow is a LINK to the section index, while the
 * label itself only toggles. Cards are 168 x 88 on a 11.5px gap, inset 61 to
 * line up under the label rather than under the mark.
 *
 * OPENING IS ON HOVER, and only one row is ever open. Crossing from Engineered
 * Surfaces to Karigear swaps the strip; leaving the list closes it. Three
 * inputs drive the same one piece of state so no one is locked out:
 *   pointerenter  mouse only — see the guard on the row
 *   focus         the keyboard's hover, so tabbing walks the strips
 *   click         the toggle, which is all a touch device has
 * Hovering a CARD then reveals that card's own copy of the arrow plate. It is
 * `aria-hidden` and `pointer-events-none` in there: the card is already a
 * link, so the arrow is the affordance for it, not a second target.
 *
 * Label colour is state, and the board is explicit about all three values:
 * nothing open, every label is #f2f2f2 (Frame 675); one open, that one goes to
 * pure white and the rest drop to rgba(242,242,242,0.52) (1040:42104). Karigear
 * is drawn at 0.56 rather than 0.52 — a board inconsistency, not a third state,
 * so one value is used for every inactive row.
 *
 * READING THE CLASSES AGAINST THE NUMBERS ABOVE. Spacing here is on Tailwind's
 * scale rather than in arbitrary px, so the utilities are QUARTERS of the
 * board's pixels: `lg:pt-33.75` is Figma's 135, `w-11.5` its 46, `lg:pl-15.25`
 * its 61. Multiply by 4 to get back to the frame. Anything off that grid stays
 * arbitrary and still reads in px — the mark's 26.54/30.62/33.68 heights, the
 * 11.5px card gap, every `text-` and `tracking-` value. One consequence worth
 * knowing: the scale is 0.25REM a step, so the spacing now follows the root
 * font size while the type, still literal px, does not. At the default 16px
 * root the two agree exactly, which is what the measurements were taken at.
 */

/**
 * MOBILE. The overlay is authored below `lg`: Figma has no phone artboard for
 * it, and the desktop geometry does not survive the trip — a 950px column at
 * 70/133 gutters, 30/+5 labels and a 5-wide card strip all assume 1440. Below
 * `lg` the panel takes the full width (the scrim has nowhere to go), the
 * gutters step down to the page's own 24/40, the labels scale to 20/+3, and the
 * strip wraps instead of overflowing.
 */

export function SiteNav({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape, and hold focus inside the overlay while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Returning focus to the hamburger belongs to the close action, not to a
  // render, so it lives here rather than in the effect above. Collapsing the
  // accordion belongs here too: the overlay reopens in Frame 675, never
  // half-open on whatever was last looked at.
  const close = () => {
    setOpen(false);
    setExpanded(null);
    triggerRef.current?.focus();
  };

  return (
    <>
      <header className={`h-22.5 w-full bg-white ${className}`}>
        <div className="mx-auto flex h-full max-w-360 items-center justify-between px-4 sm:px-6 lg:px-20">
          {/* The bar lockup is 308 wide against the component's natural 329.
              `scale` is a TRANSFORM, so it changes what the lockup looks like
              and not one pixel of what it reserves: the row went on booking the
              full 329 at every width, and at 320 that pushed the hamburger 61px
              past the edge — where the hero's `overflow-hidden` clipped it, so
              the only way into the menu was simply gone on a small phone. The
              explicit width is the scaled width, so the box now measures what
              the eye sees. */}
          <span className="block w-54.5 origin-left scale-[0.66] min-[360px]:w-64.25 min-[360px]:scale-[0.78] sm:w-74.25 sm:scale-90 lg:w-77 lg:scale-[0.936]">
            <KalingaLogo />
          </span>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Open menu"
            className="grid h-8 w-9 shrink-0 place-items-center text-ruby transition-opacity hover:opacity-70"
          >
            <MenuIcon className="h-5 w-7" />
          </button>
        </div>
      </header>

      {/* Scrim — 1040:42106, ink at 89% over the 287 the panel leaves showing.
          It is a real part of the design here, unlike the old drawer's, and it
          doubles as the click target that dismisses the overlay. It stays a
          `div`: Escape and the close plate already give keyboard users a way
          out, and a second focusable "Close menu" would only be noise. */}
      <div
        onClick={close}
        aria-hidden
        className={`bg-ink/89 fixed inset-0 z-40 transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="site-menu"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`bg-ruby fixed top-0 right-0 z-50 h-dvh w-full transition-transform duration-600 ease-out-expo lg:w-[80.07%] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* close — 46 x 41 at x1364 y30 (1040:42096). The panel is flush right,
            so 1440 - 1364 - 46 puts it 30 in from the panel's own edge. */}
        <button
          type="button"
          onClick={close}
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          className="absolute top-5 right-5 z-10 grid h-10.25 w-11.5 place-items-center bg-white text-ink transition-opacity hover:opacity-80 lg:top-7.5 lg:right-7.5"
        >
          <CloseIcon className="h-8 w-8" />
        </button>

        <div className="flex h-full flex-col overflow-y-auto px-6 pt-27.5 pb-7.5 sm:px-10 lg:pt-33.75 lg:pr-33.25 lg:pl-17.5">
          {/* Leaving the whole list closes it — "open on hover" has to mean
              closed again when the pointer is elsewhere, or the panel keeps
              whichever row was touched last. Moving BETWEEN rows never passes
              through here, so the strip swaps rather than blinking shut. */}
          <nav aria-label="Main" onMouseLeave={() => setExpanded(null)}>
            {nav.sections.map((section, i) => {
              const isOpen = expanded === i;
              return (
                <div
                  key={section.label}
                  // The whole row opens it, cards included, so travelling down
                  // from the label into the strip cannot close what you are
                  // reaching for. Mouse only: a tap fires pointerenter and THEN
                  // click, so an unguarded handler would open the row and the
                  // toggle would immediately shut it again on touch.
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setExpanded(i);
                  }}
                  className={`border-b border-[#9F9F9F] ${i > 0 ? "pt-6.5 lg:pt-8" : ""}`}
                >
                  <div
                    className={`flex items-center gap-4 transition-[padding] duration-500 ease-out-expo sm:gap-5.5 lg:gap-7 ${
                      isOpen
                        ? "pb-5.5 lg:pb-6.75"
                        : "pb-6.5 lg:pb-8.25"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      // Focus is the keyboard's hover: tabbing the four rows
                      // opens each in turn, so a strip is never unreachable
                      // without a pointer. The click toggle stays for touch.
                      onFocus={() => setExpanded(i)}
                      aria-expanded={isOpen}
                      aria-controls={`site-menu-panel-${i}`}
                      tabIndex={open ? 0 : -1}
                      className="flex min-w-0 flex-1 items-center text-left"
                    >
                      {/* The mark only exists on the open row (1096:57676), and
                          it is what pushes the label from x357 to x418. Its
                          width is animated with the same 0fr -> 1fr grid the
                          card strip uses, so nothing has to be measured; the
                          gap rides INSIDE the clipped track as a margin, or a
                          flex `gap` would keep reserving 28px of nothing while
                          the mark is collapsed. */}
                      <span
                        aria-hidden
                        className="grid shrink-0 transition-[grid-template-columns] duration-500 ease-out-expo"
                        style={{ gridTemplateColumns: isOpen ? "1fr" : "0fr" }}
                      >
                        <span className="overflow-hidden">
                          <KalingaMark className="mr-4 block h-[26.54px] w-6.5 text-white sm:mr-5.5 sm:h-[30.62px] sm:w-7.5 lg:mr-7 lg:h-[33.68px] lg:w-8.25" />
                        </span>
                      </span>
                      <span
                        className={`font-display text-[20px] font-medium tracking-[3px] uppercase transition-colors duration-500 sm:text-[24px] sm:tracking-[4px] lg:text-[30px] lg:tracking-[5px] ${
                          expanded === null
                            ? "text-gray-6"
                            : isOpen
                              ? "text-white"
                              : "text-[rgba(242,242,242,0.52)]"
                        }`}
                        style={{ lineHeight: 1.58 }}
                      >
                        {section.label}
                      </span>
                    </button>

                    {/* 1096:57603 — a LINK, not part of the toggle: it goes to
                        the section index while the label opens the strip. */}
                    <Link
                      href={section.href}
                      onClick={close}
                      tabIndex={open && isOpen ? 0 : -1}
                      aria-hidden={!isOpen}
                      aria-label={`Go to ${section.label}`}
                      className={`text-ruby grid h-10 w-10 shrink-0 place-items-center bg-white transition-opacity duration-500 hover:opacity-80 ${
                        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <ArrowRightIcon className="h-10 w-10" />
                    </Link>
                  </div>

                  {/* grid-rows 0fr -> 1fr animates height without measuring it */}
                  <div
                    id={`site-menu-panel-${i}`}
                    className="grid transition-[grid-template-rows] duration-500 ease-out-expo"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    {/* The clipped box carries NO padding of its own. `0fr`
                        sizes the grid TRACK to zero, but the item is
                        border-box, so a padding-bottom on it survives the
                        collapse as 43px of empty row — which is exactly what it
                        did, pushing every rule 44px down the panel. The
                        padding belongs one level in, where the clip eats it. */}
                    <div className="overflow-hidden">
                      {/* Indented by exactly the mark + its gap, so the strip
                          starts under the label (x418), not under the mark. */}
                      <ul className="flex flex-wrap gap-[11.5px] pb-9 pl-10.5 sm:pl-13 lg:pb-10.75 lg:pl-15.25">
                        {section.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={close}
                              tabIndex={isOpen && open ? undefined : -1}
                              className="group relative block h-18.5 w-35.5 overflow-hidden bg-[#040707] sm:h-22 sm:w-42"
                            >
                              {child.image ? (
                                <Image
                                  src={child.image}
                                  alt={child.alt ?? ""}
                                  fill
                                  sizes="168px"
                                  style={{
                                    objectPosition: child.position ?? "50% 50%",
                                  }}
                                  className="object-cover transition-transform duration-600 ease-out-expo group-hover:scale-[1.06]"
                                />
                              ) : null}
                              {/* Hover scrim. It exists FOR the arrow: the
                                  plate is white, and Marble and Porcelain are
                                  pale enough that its edges would dissolve
                                  into the photo. Dimming the plate's ground is
                                  what makes it read as a card sitting on the
                                  image. */}
                              <span
                                aria-hidden
                                className="absolute inset-0 bg-ink/0 transition-colors duration-300 ease-out-expo group-hover:bg-ink/35 group-focus-visible:bg-ink/35"
                              />
                              {/* 1076:49133 — #14100e up to 9.459%, out by the
                                card's 41%. Invisible over the Elixir plate,
                                which is already black, so it stays uniform. */}
                              <span
                                aria-hidden
                                className="absolute inset-x-0 bottom-0 h-[41%] bg-linear-to-t from-ink to-transparent"
                              />
                              {/* The section row's own arrow (1096:57603),
                                  repeated per card and revealed on hover. It is
                                  RIGHT-aligned rather than centred because the
                                  label owns the bottom-left and a centred 40px
                                  plate would span y24-64 of an 88px card,
                                  straight through the label's line. Right of it
                                  also echoes the section row, where the same
                                  plate sits at the column's right edge.
                                  Decoration, not a control — the whole card is
                                  already the link. */}
                              <span
                                aria-hidden
                                className="text-ruby pointer-events-none absolute top-1/2 right-2.25 grid h-10 w-10 -translate-y-1/2 place-items-center bg-white opacity-0 transition-opacity duration-300 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100"
                              >
                                <ArrowRightIcon className="h-10 w-10" />
                              </span>
                              <span
                                className="font-display absolute right-2.25 bottom-2.5 left-2.25 text-[12px] font-bold tracking-[1.4634px] text-white uppercase sm:bottom-3 sm:text-[14px]"
                                style={{
                                  lineHeight: 1.25,
                                  textShadow:
                                    "-2.195px 2.927px 4.024px rgba(0,0,0,0.35)",
                                }}
                              >
                                {child.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* inquiry / rule / legal sit 122, 77 and 58 up from the panel's base */}
          <div className="mt-auto pt-15">
            {/* Sentence case, lowercase email — 1040:42111 renders "Any inquiry
                info@kalingastone.com". Figma's export shows a `capitalize` class
                on the paragraph with `lowercase` on the spans inside; the spans
                win, and title-casing this gives "Info@Kalingastone.Com". */}
            <p
              className="font-nav text-[15px] font-light tracking-[1px] text-white"
              style={{ lineHeight: 1.58 }}
            >
              {nav.inquiry.lead}{" "}
              <a
                href={`mailto:${nav.inquiry.email}`}
                tabIndex={open ? 0 : -1}
                className="font-bold underline"
              >
                {nav.inquiry.email}
              </a>
            </p>
            <hr className="mt-5.25 h-px w-full border-0 bg-[#9F9F9F]" />
            <ul className="mt-4.75 flex flex-wrap items-center gap-x-5.25 gap-y-2">
              {nav.legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={close}
                    tabIndex={open ? undefined : -1}
                    className="font-nav -my-1.5 block py-1.5 text-[15px] font-light tracking-[1px] text-white uppercase transition-opacity hover:opacity-70"
                    style={{ lineHeight: 1.58 }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
