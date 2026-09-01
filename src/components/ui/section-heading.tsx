import { Reveal } from "./reveal";

/**
 * The centred heading block that opens four sections (Figma 544:3945, 544:3967,
 * 544:3973, 544:3970 — all identical 599 x 121.5 groups).
 *
 * Measured from 544:3945:
 *   h2   40 / 1.58 / +5 uppercase, box 443 wide, centred on x720
 *   body 16 / 1.5  / +1,          box 599 wide, centred on x720
 *   gap  3057.5 - (2986 + 63) = 8.5px
 *
 * The 8.5 is a real number, not a rounding of 8 or 10 — the h2's box bottom is
 * 3049 and the paragraph's box starts at 3057.5.
 */
export function SectionHeading({
  title,
  body,
  className = "",
}: {
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[599px] px-6 text-center ${className}`}>
      <Reveal as="h2" className="heading text-ink">
        {title}
      </Reveal>
      {body ? (
        <Reveal delay={120}>
          <p className="body-copy mt-[8.5px] text-ink">{body}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
