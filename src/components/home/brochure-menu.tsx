"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/ui/nav-icons";
import { ksButtonClass } from "@/components/ui/ks-button";
import { contact } from "@/lib/content";

/**
 * Brochure menu — the contact band's "Download brochure" CTA (544:4023 + the
 * chevron 695:2576), turned into the four-item collection picker.
 *
 * NOTHING HERE IS A NEW DESIGN. Every value is borrowed from a component that
 * already ships:
 *   - the trigger wears `ksButtonClass` — the exact KS/Button box, so it is
 *     pixel-identical to the link it replaces (11.272px uppercase, +1.0247
 *     tracking, Haas 55 Roman, 42.7 tall, 1px white stroke).
 *   - the items repeat that type and take the outline variant's own hover
 *     (white fill, ink text), so the panel reads as an extension of the button
 *     rather than a second visual language.
 *   - the open/close is the nav drawer's disclosure verbatim (site-nav.tsx):
 *     chevron rotate-180, grid-template-rows 0fr -> 1fr so the height animates
 *     without being measured, --ease-out-expo.
 *
 * IT OPENS UPWARD, and that is forced rather than chosen. The CTA's base sits
 * 70.3px above the band's bottom edge (see contact-band.tsx), and the footer
 * begins immediately below, so a downward panel would be born inside the
 * footer. `bottom-full` puts it over the band's own scrim, which is at or near
 * black by that height, so white-on-dark holds.
 *
 * The panel is `w-max min-w-full`: the trigger reads "Download brochure" but
 * the items are longer, and letting the panel match the longest item keeps the
 * type from wrapping. It is left-aligned to the trigger.
 *
 * Each brochure opens in a new tab — `target="_blank"` with `rel="noopener
 * noreferrer"`, the same pairing the footer's social links use. `download` is
 * deliberately NOT set: the ask is to open the PDF, and setting it would push a
 * file to disk instead.
 */
export function BrochureMenu() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    // pointerdown, not click: closing on click would fire after the link's own
    // navigation and fight it.
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative inline-block">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={ksButtonClass({ variant: "outline", trailing: true })}
      >
        {contact.cta.label}
        <ChevronDownIcon
          className={`h-[6.06px] w-[11.67px] shrink-0 transition-transform duration-300 ease-[var(--ease-out-expo)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 0fr -> 1fr animates the height without anyone having to measure it. */}
      <div
        id={panelId}
        className="absolute bottom-full left-0 z-20 grid w-max min-w-full transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <ul
          role="menu"
          aria-label={contact.cta.label}
          className={`overflow-hidden border-white bg-ink/95 backdrop-blur-sm transition-[opacity,border-width] duration-300 ${
            open ? "border-x border-t opacity-100" : "border-0 opacity-0"
          }`}
        >
          {contact.brochures.map((b) => (
            <li key={b.label} role="none">
              <a
                role="menuitem"
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? undefined : -1}
                onClick={() => setOpen(false)}
                className="flex h-[42.7px] items-center px-6 font-body text-[11.272px] font-normal tracking-[1.0247px] text-white uppercase transition-colors duration-300 ease-[var(--ease-out-expo)] hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink focus-visible:outline-none"
              >
                {b.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
