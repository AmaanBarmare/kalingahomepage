import Image from "next/image";
import Link from "next/link";

/**
 * The KalingaStone lockup — Figma I544:4025;404:2658.
 *
 * Two vectors on one row: the mark (35.553 x 36.513, nudged 0.35 down) and the
 * wordmark (279.637 x 37.041) at ml 49.36 — a 329 x 37 lockup overall.
 *
 * Both SVGs carry a literal #70000E fill rather than currentColor, because they
 * are served through next/image, which renders an SVG as an isolated document
 * that never inherits colour from the JSX around it. The footer needs the
 * lockup in white, so that variant inverts with a filter instead of relying on
 * inheritance that cannot happen.
 */
export function KalingaLogo({
  variant = "ruby",
  className = "",
  href = "/",
}: {
  variant?: "ruby" | "white";
  className?: string;
  href?: string | null;
}) {
  const inner = (
    <span className={`flex items-center gap-[13.8px] ${variant === "white" ? "brightness-0 invert" : ""}`}>
      <Image
        src="/icons/kalinga-mark.svg"
        alt=""
        width={36}
        height={37}
        className="mt-[0.35px] h-[36.513px] w-[35.553px] shrink-0"
        priority
      />
      <Image
        src="/icons/kalinga-wordmark.svg"
        alt="KalingaStone — Engineered Surfaces"
        width={280}
        height={37}
        className="h-[37.041px] w-[279.637px] shrink-0"
        priority
      />
    </span>
  );

  if (!href) return <span className={className}>{inner}</span>;

  return (
    <Link href={href} className={`inline-flex ${className}`} aria-label="KalingaStone — home">
      {inner}
    </Link>
  );
}
