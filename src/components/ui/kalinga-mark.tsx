/**
 * The Kalinga mark — four quadrants of arrow/chevron forms.
 *
 * Inlined as JSX rather than shipped through next/image on purpose: it is used
 * as a ruby divider, so it has to inherit its colour. An SVG rendered through
 * next/image is an isolated document and never picks up `currentColor` — that
 * exact bug made a previous project's footer icons invisible.
 *
 * Geometry is verbatim from Figma 551:5480 (28 x 28.5774).
 */

const PATHS = [
  "M0 4.08249H2.1655L6 0H0V4.08249Z",
  "M2.12083 8.16497H0V13.2681H6L2.12083 8.16497Z",
  "M5 6.95079L11 13.2681V0L5 6.95079Z",
  "M28 4.08249H25.8315L22 0H28V4.08249Z",
  "M25.1698 8.16497H28V13.2681H20L25.1698 8.16497Z",
  "M22 6.95079L15 13.2681V0L22 6.95079Z",
  "M0 20.4124H2.1655L6 17.3506H0V20.4124Z",
  "M2.12083 24.4949H0V28.5774H6L2.12083 24.4949Z",
  "M5 23.232L11 28.5774V17.3506L5 23.232Z",
  "M28 20.4124H25.8315L22 17.3506H28V20.4124Z",
  "M25.1698 24.4949H28V28.5774H20L25.1698 24.4949Z",
  "M22 23.232L15 28.5774V17.3506L22 23.232Z",
];

export function KalingaMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 28.5774"
      fill="currentColor"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
