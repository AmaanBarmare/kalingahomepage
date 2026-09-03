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

/**
 * The ruby CTA's hover, built as a ::before so it works from a class string
 * alone — `ksButtonClass` is handed to a raw <button> in the brochure menu,
 * which owns its own children, so there is no wrapper element to animate.
 *
 * The fill is the pseudo-element (inset-0, behind the label on `-z-10`, held
 * inside the button's own stacking context by `isolate`), and hover collapses
 * it bottom-up with scaleY. The border and the box never move, so the label
 * and the contact band's chevron stay exactly where they were — the only thing
 * that leaves is the red.
 *
 * WHY THE LABEL'S COLOUR IS DELAYED. White -> ruby has to happen while the
 * ruby is gone, or the label spends the crossover as ruby on ruby and vanishes.
 * ease-out-expo is heavily front-loaded (about 99% of the travel is spent by
 * two-thirds of the duration), so the fill has effectively cleared the box by
 * 240ms; the colour waits for that, then takes 200ms. Leaving hover carries no
 * delay, which is the order you want on the way back too: the label is white
 * again well before the fill has finished returning underneath it.
 *
 * `before:delay-0` pins the wipe to start immediately. transition-delay does
 * not inherit, so today the 240ms on the button cannot reach the pseudo on its
 * own — this is a guard, and a cheap one: it keeps the two timings independent
 * if the label's delay ever moves to a custom property, which does inherit.
 *
 * Contrast on the way out: the three instances over photography (visualiser,
 * MaxGuard, contact band) sit on light frames — sampled luminance 126, 197 and
 * 141 of 255 — so ruby-on-image holds up. The fourth is on the white
 * applications band. If a darker frame ever lands behind one of these, this
 * variant is the place to fix it, not the call site.
 */
const RUBY_WIPE =
  "relative isolate border border-ruby text-white " +
  "before:absolute before:inset-0 before:-z-10 before:bg-ruby before:origin-bottom " +
  "before:transition-transform before:duration-[420ms] before:delay-0 " +
  "before:ease-[var(--ease-out-expo)] hover:before:scale-y-0 " +
  "hover:text-ruby hover:duration-200 hover:delay-[240ms]";

const VARIANTS: Record<Variant, string> = {
  // On photography — hero, MaxGuard, contact band, carousel slides.
  outline: "border border-white text-white hover:bg-white hover:text-ink",
  // On the cream/white bands.
  "outline-ink": "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  // Karigear's "Explore our expertise" (721:29347) — ruby stroke and ruby text
  // on the white band, no fill. Figma reports border-0 here for the same reason
  // it does on `outline`: the stroke lives on the master, not the instance.
  "outline-ruby": "border border-ruby text-ruby hover:bg-ruby hover:text-white",
  // "Ruby CTA" — Figma's Style=Primary. The visualiser's Visualize Your Space.
  //
  // THE FILL LEAVES ON HOVER; it does not darken. The old state was
  // `hover:bg-ruby-pressed`, which swapped one red for a darker red and read as
  // a dead press state rather than a hover. Now the ruby wipes upward off the
  // box and what is left is the outline and the label — see RUBY_WIPE.
  ruby: RUBY_WIPE,
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
