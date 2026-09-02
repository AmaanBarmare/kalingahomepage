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
 *
 * THE BODY'S FIGMA BOX IS 2px TALLER THAN ITS TEXT, and every section that
 * follows this block has to pay for it. The node is `textAutoResize: NONE` at
 * 599 x 50 while its own metrics are 16px at 150% over two lines — 48. So the
 * box carries 2px of slack under the last line. Ours is a <p>, which is exactly
 * 48, so a gap copied from Figma as (next.y - body.y - 50) lands 2px high, and
 * the h2 gives back 0.2 the other way (63.2 rendered against a reported 63).
 * The four callers therefore add 1.8 to the first margin below this block:
 * applications 27.5 -> 29.3, visualiser 21.5 -> 23.3, testimonials 39.5 ->
 * 41.3. It is the only systematic offset left on the page, and it is worth
 * naming rather than absorbing into a fudge factor at the bottom.
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
