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

type Variant = "outline" | "outline-ink" | "ruby";

const BASE =
  "inline-flex h-[42.7px] items-center justify-center whitespace-nowrap px-[24px] " +
  "text-[11.272px] uppercase tracking-[1.0247px] font-body font-normal " +
  "transition-colors duration-300 ease-[var(--ease-out-expo)]";

const VARIANTS: Record<Variant, string> = {
  // On photography — hero, MaxGuard, contact band, carousel slides.
  outline: "border border-white text-white hover:bg-white hover:text-ink",
  // On the cream/white bands.
  "outline-ink": "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  // "Ruby CTA" — Figma's Style=Primary. The visualiser's Visualise Your Space.
  ruby: "bg-ruby text-white hover:bg-ruby-pressed",
};

type Props = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function KsButton({ variant = "outline", children, className = "", ...rest }: Props) {
  return (
    <Link className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
