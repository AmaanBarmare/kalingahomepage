"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { KalingaLogo } from "@/components/ui/kalinga-logo";
import { ChevronIcon, CloseIcon, MenuIcon } from "@/components/ui/nav-icons";
import { nav } from "@/lib/content";

/**
 * Site navigation — 709:6387 "Frame 552", six variants of one 1440 x 90 bar.
 *
 * BAR (709:6388)
 *   1440 x 90, solid white. Inner row x80 y27, 1280 wide, space-between.
 *   lockup    308 x 35.93 at x80  y27
 *   hamburger  36 x 32    at x1324 y29   (1324 + 36 = 1360 = 1440 - 80)
 *
 * The hamburger is RUBY, not ink — the same #70000E the lockup's two SVGs carry
 * literally, reached here through --color-ruby so the two can never drift. The
 * icon takes it via `currentColor`, which the lockup cannot do: it is served
 * through next/image, and an SVG rendered as its own document inherits nothing.
 *
 * DRAWER (709:6661 "Frame 443") — 521 x 937 at x919, i.e. flush right, and it
 * starts at the TOP of the page, so it covers the bar's right end including the
 * hamburger. Fill #70020f, which is NOT the brand ruby #70000e; the extra green
 * is real and only shows against the ruby CTA, so it is kept literal.
 *   close      46 x 41 at x460 y15, white plate, X 32 at x7 y4.5
 *   sections  404 wide at x58  y113, one every 136px while collapsed
 *   inquiry   x45 y794 · rule x45 y839 w425 · legal x45 y858
 *
 * Each section is a 40px header (label + 19x9 chevron) with its children
 * clipped away; expanding reveals a list that starts 48px below the header top
 * on a 36px pitch. Collapsed pitch 136 = 40 header + 96 gap, so the gap is what
 * stays fixed and the list simply pushes the sections below it down.
 *
 * Type is Haas Grot Disp **Round** — see --font-nav in globals.css for why it
 * currently resolves to the Display cut.
 */

const SECTION_GAP = 96;

export function SiteNav({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape, and hold focus inside the drawer while it is open.
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
  // render, so it lives here rather than in the effect above.
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <header className={`h-[90px] w-full bg-white ${className}`}>
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-20">
          {/* the bar lockup is 308 wide against the component's natural 329 */}
          <span className="block origin-left scale-[0.78] sm:scale-90 lg:scale-[0.936]">
            <KalingaLogo />
          </span>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Open menu"
            className="grid h-[32px] w-[36px] place-items-center text-ruby transition-opacity hover:opacity-70"
          >
            <MenuIcon className="h-[20px] w-[28px]" />
          </button>
        </div>
      </header>

      {/* Scrim. Figma draws none — the drawer is only 521 of 1440 — but without
          it a click on the page behind reads as "nothing happened". */}
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-500 ${
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
        className={`fixed top-0 right-0 z-50 flex h-dvh w-full max-w-[521px] flex-col overflow-y-auto bg-[#70020f] transition-transform duration-[600ms] ease-[var(--ease-out-expo)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* close — x460 y15 within the 521 drawer, so 15px from the right */}
        <div className="flex justify-end px-[15px] pt-[15px]">
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="grid h-[41px] w-[46px] place-items-center bg-white text-ink transition-opacity hover:opacity-80"
          >
            <CloseIcon className="h-[32px] w-[32px]" />
          </button>
        </div>

        <nav
          className="flex flex-col px-[58px] pt-[57px]"
          style={{ gap: `${SECTION_GAP}px` }}
          aria-label="Main"
        >
          {nav.sections.map((section, i) => {
            const isOpen = expanded === i;
            return (
              <div key={section.label}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex h-[40px] w-full items-center gap-[10px] text-left text-white transition-opacity hover:opacity-80"
                >
                  <span
                    className="font-nav font-medium whitespace-nowrap uppercase"
                    style={{ fontSize: 25, letterSpacing: 5, lineHeight: 1.58 }}
                  >
                    {section.label}
                  </span>
                  <ChevronIcon
                    className={`h-[9px] w-[19px] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* grid-rows 0fr -> 1fr animates height without measuring it */}
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <ul className="overflow-hidden">
                    <li className="h-[8px]" aria-hidden />
                    {section.children.map((child) => (
                      <li key={child.label} className="pb-[12px] last:pb-0">
                        <Link
                          href={child.href}
                          onClick={close}
                          tabIndex={isOpen ? undefined : -1}
                          className="font-nav block h-[24px] font-light text-white uppercase transition-opacity hover:opacity-70"
                          style={{ fontSize: 15, letterSpacing: 5, lineHeight: 1.58 }}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        {/* inquiry / rule / legal sit 143, 98 and 79 up from the drawer's base */}
        <div className="mt-auto px-[45px] pb-[51px]">
          {/* Sentence case, lowercase email — 709:6662 renders "Any inquiry
              info@kalingastone.com". Figma's export shows a `capitalize` class
              on the paragraph with `lowercase` on the spans inside; the spans
              win, and title-casing this gives "Info@Kalingastone.Com". */}
          <p
            className="font-nav font-light text-white"
            style={{ fontSize: 15, letterSpacing: 1, lineHeight: 1.58 }}
          >
            {nav.inquiry.lead}{" "}
            <a href={`mailto:${nav.inquiry.email}`} className="font-bold underline">
              {nav.inquiry.email}
            </a>
          </p>
          <hr className="mt-[21px] h-px w-full max-w-[425px] border-0 bg-white/40" />
          <ul className="mt-[19px] flex flex-wrap items-center gap-x-[21px] gap-y-[8px]">
            {nav.legal.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={close}
                  tabIndex={open ? undefined : -1}
                  className="font-nav font-light text-white uppercase transition-opacity hover:opacity-70"
                  style={{ fontSize: 15, letterSpacing: 1, lineHeight: 1.58 }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
