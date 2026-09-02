import type { SVGProps } from "react";

/**
 * Navbar icons, exported from Figma 709:6387 and inlined so they inherit
 * `currentColor` — the hamburger is ruby on the white bar, the close mark and
 * the chevrons are white on the ruby drawer. Path data is Figma's own, not
 * redrawn — with one exception, the hamburger, for the reason below.
 */

/**
 * Hamburger — 721:30947 / 686:3726. REDRAWN ON A WHOLE-PIXEL GRID, and this is
 * the only icon here that is not Figma's own path.
 *
 * Figma's export is 27.75 x 20.8125 with 2.3125-thick bars. Centred in the
 * 36 x 32 button that puts the icon at a fractional offset (y 34.59375), so
 * each bar lands on a different subpixel phase and the browser antialiases
 * each one differently. Measured at 1x: bar 1 came out two solid rows, bar 2
 * one solid row flanked by 44% and 56% grey (reads fat and blurred), bar 3 one
 * solid row over 56% grey (reads thin and washed out). Three identical bars,
 * three visibly different weights.
 *
 * So the geometry is rounded to integers — 28 x 20, 2-thick bars at y 0/9/18,
 * even 7px gaps, rx 1 for the same stadium caps the export draws with arcs.
 * Centred in 36 x 32 that is a 4/6 inset and the button itself sits at x1324
 * y29, so every edge is on a device pixel and all three bars rasterise
 * identically. The cost is 0.25px of width and 0.81px of height against the
 * board — below the threshold of sight, and the alternative is what it looked
 * like before.
 */
export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 20" fill="none" aria-hidden focusable="false" {...props}>
      <rect width="28" height="2" y="0" rx="1" fill="currentColor" />
      <rect width="28" height="2" y="9" rx="1" fill="currentColor" />
      <rect width="28" height="2" y="18" rx="1" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden focusable="false" {...props}>
      <path d="M25.7081 24.2926C25.801 24.3855 25.8747 24.4958 25.9249 24.6172C25.9752 24.7386 26.0011 24.8687 26.0011 25.0001C26.0011 25.1315 25.9752 25.2616 25.9249 25.383C25.8747 25.5044 25.801 25.6147 25.7081 25.7076C25.6151 25.8005 25.5048 25.8742 25.3835 25.9245C25.2621 25.9747 25.132 26.0006 25.0006 26.0006C24.8692 26.0006 24.7391 25.9747 24.6177 25.9245C24.4963 25.8742 24.386 25.8005 24.2931 25.7076L16.0006 17.4138L7.70806 25.7076C7.52042 25.8952 7.26592 26.0006 7.00056 26.0006C6.73519 26.0006 6.4807 25.8952 6.29306 25.7076C6.10542 25.5199 6 25.2654 6 25.0001C6 24.7347 6.10542 24.4802 6.29306 24.2926L14.5868 16.0001L6.29306 7.70757C6.10542 7.51993 6 7.26543 6 7.00007C6 6.7347 6.10542 6.48021 6.29306 6.29257C6.4807 6.10493 6.73519 5.99951 7.00056 5.99951C7.26592 5.99951 7.52042 6.10493 7.70806 6.29257L16.0006 14.5863L24.2931 6.29257C24.4807 6.10493 24.7352 5.99951 25.0006 5.99951C25.2659 5.99951 25.5204 6.10493 25.7081 6.29257C25.8957 6.48021 26.0011 6.7347 26.0011 7.00007C26.0011 7.26543 25.8957 7.51993 25.7081 7.70757L17.4143 16.0001L25.7081 24.2926Z" fill="currentColor" />
    </svg>
  );
}

export function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 19 9" fill="none" aria-hidden focusable="false" {...props}>
      <path d="M18.7469 1.2809L10.111 8.78006C10.0308 8.84978 9.93554 8.9051 9.8307 8.94284C9.72586 8.98058 9.61349 9 9.5 9C9.38651 9 9.27413 8.98058 9.16929 8.94284C9.06446 8.9051 8.96921 8.84978 8.88901 8.78006L0.253081 1.2809C0.0910359 1.14018 0 0.949334 0 0.750333C0 0.551332 0.0910359 0.360482 0.253081 0.219767C0.415126 0.0790523 0.634906 0 0.864073 0C1.09324 0 1.31302 0.0790523 1.47506 0.219767L9.5 7.1893L17.5249 0.219767C17.6052 0.150092 17.7004 0.0948231 17.8053 0.0571154C17.9101 0.0194076 18.0225 0 18.1359 0C18.2494 0 18.3618 0.0194076 18.4666 0.0571154C18.5714 0.0948231 18.6667 0.150092 18.7469 0.219767C18.8272 0.289442 18.8908 0.372158 18.9342 0.463193C18.9776 0.554227 19 0.651798 19 0.750333C19 0.848868 18.9776 0.946439 18.9342 1.03747C18.8908 1.12851 18.8272 1.21122 18.7469 1.2809Z" fill="currentColor" />
    </svg>
  );
}

/**
 * The 11.67 x 6.06 chevron drawn over the contact band's CTA (695:2576). It is
 * a stroked open chevron, not the filled ChevronIcon above — Figma keeps it as
 * a loose vector on top of the button rather than inside the component.
 */
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 11.6732 6.05665" fill="none" aria-hidden focusable="false" {...props}>
      <path d="M0.324326 0.380543L6.19099 5.38054L11.3243 0.380543" stroke="currentColor" />
    </svg>
  );
}
