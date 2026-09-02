import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * KS/Button — the single CTA on this page, used five times.
 *
 * Figma 544:4029 / 544:3977 / 542:5290 / 544:4023, plus the instance inside the
 * collections carousel. All five share one box:
 *
 *   px 24 · py 14 · 11.272px uppercase · +1.0247 tracking · Haas 55 Roman
 *
 * and differ only in fill. Widths in Figma (188.19 / 184.19 / 192.19 / 127.19)
 * are label-driven, not hand-set, so nothing here hard-codes a width.
 *
 * Figma reports `border-0` on the outline instance while clearly drawing a
 * 1px white stroke — the stroke lives on the component master, not the
 * instance. The rendered frame is the authority, so `outline` carries a border.
 */

type Variant = "outline" | "outline-ink" | "outline-ruby" | "ruby";

const BASE =
  "inline-flex h-[42.7px] items-center justify-center whitespace-nowrap pl-6 " +
  "text-[11.272px] uppercase tracking-[1.0247px] font-body font-normal " +
  "transition-colors duration-300 ease-[var(--ease-out-expo)]";

/**
 * `trailing` is the contact band's chevron (695:2576). Figma draws it as a
 * loose vector ON TOP of the button rather than inside the component, and pays
 * for it out of the right padding: the label ends at x254.3, the chevron runs
 * 267.3 -> 279, and the box closes at 297. So 13px of gap and 18px of right
 * padding, against the plain button's symmetric 24.
 */
const TRAILING = "gap-3.25 pr-4.5";

const VARIANTS: Record<Variant, string> = {
  // On photography — hero, MaxGuard, contact band, carousel slides.
  outline: "border border-white text-white hover:bg-white hover:text-ink",
  // On the cream/white bands.
  "outline-ink": "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  // Karigare's "Explore our expertise" (721:29347) — ruby stroke and ruby text
  // on the white band, no fill. Figma reports border-0 here for the same reason
  // it does on `outline`: the stroke lives on the master, not the instance.
  "outline-ruby": "border border-ruby text-ruby hover:bg-ruby hover:text-white",
  // "Ruby CTA" — Figma's Style=Primary. The visualiser's Visualise Your Space.
  ruby: "bg-ruby text-white hover:bg-ruby-pressed",
};

type Props = {
  variant?: Variant;
  /** Icon rendered after the label — see TRAILING for the spacing it buys. */
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className" | "children">;

/**
 * The same box as `KsButton`, for the cases that cannot be a `<Link>` — the
 * contact band's brochure menu needs a real `<button>` so it can carry
 * `aria-expanded`. Kept here so the two can never drift apart.
 */
export function ksButtonClass({
  variant = "outline",
  trailing = false,
  className = "",
}: { variant?: Variant; trailing?: boolean; className?: string } = {}) {
  return `${BASE} ${trailing ? TRAILING : "pr-6"} ${VARIANTS[variant]} ${className}`;
}

export function KsButton({ variant = "outline", trailing, children, className = "", ...rest }: Props) {
  return (
    <Link className={ksButtonClass({ variant, trailing: Boolean(trailing), className })} {...rest}>
      {children}
      {trailing}
    </Link>
  );
}
