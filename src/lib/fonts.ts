import localFont from "next/font/local";

/**
 * The two brand faces, self-hosted.
 *
 * Figma names them "Halogen" (style Medium) and "Haas Grot Disp Trial"
 * (style 45 Light). The second one matters: it is Neue Haas Grotesk
 * **Display** — NOT the Text cut and NOT any of the Round variants, all of
 * which ship under near-identical filenames and look subtly wrong.
 *
 * Sources are .otf; these are converted to .woff2 at ~40% the size with
 * identical outlines (628KB -> 259KB across the eight files).
 */

export const halogen = localFont({
  variable: "--font-halogen",
  display: "swap",
  preload: true,
  fallback: ["Futura", "Century Gothic", "sans-serif"],
  src: [
    { path: "../../public/fonts/Halogen-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Halogen-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Halogen-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Halogen-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const neueHaas = localFont({
  variable: "--font-neue-haas",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  src: [
    { path: "../../public/fonts/NeueHaasGrotDisp-45Light-Trial.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/NeueHaasGrotDisp-55Roman-Trial.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/NeueHaasGrotDisp-65Medium-Trial.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/NeueHaasGrotDisp-75Bold-Trial.woff2", weight: "700", style: "normal" },
  ],
});

/**
 * Neue Haas Grot Display **Round**, 25 XThin — one weight, one node.
 *
 * The MaxGuard ghost headline (Figma 551:5465) is the only place on the page
 * that uses the Round cut, and the only thing anywhere below weight 300. It is
 * loaded separately rather than folded into `neueHaas` because it is a
 * different typeface, not a lighter weight of the same one: mixing them into
 * one family would let the browser substitute Round for Display body copy.
 */
export const neueHaasRound = localFont({
  variable: "--font-neue-haas-round",
  display: "swap",
  preload: false, // one decorative headline, below the fold
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  src: [
    {
      path: "../../public/fonts/NeueHaasGrotDispRound-25XThin-Trial.woff2",
      weight: "200",
      style: "normal",
    },
  ],
});
