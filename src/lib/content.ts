/**
 * Every string on the homepage, in one place.
 *
 * The Figma frame (544:3926) is laid out with lorem ipsum in all but the
 * contact block, and that is reproduced verbatim here — including the
 * placeholder headline "Lorem ipsum hakdinaik ahdk" — so the build matches the
 * design exactly. Real copy drops in here without touching a single component.
 *
 * The contact paragraph and the footer navigation ARE real and are transcribed
 * as-is. Note `MAXGAURD` in the footer: that is Figma's spelling (544:4401),
 * kept deliberately so the discrepancy stays visible rather than being
 * silently "fixed" — see DESIGN.md § Known Figma-side issues.
 */

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const LOREM_DUMMY =
  "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since.";

export const hero = {
  headline: "is simply dummy text",
  body: LOREM_SHORT,
  cta: { label: "Explore Collection", href: "/collections" },
} as const;

export const intro = {
  headline: "Lorem ipsum hakdinaik ahdk",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
} as const;

/**
 * Collections carousel — Component 102 (544:4012).
 *
 * Figma renders one slide and parks the other three below the clip boundary at
 * 0.757 scale. Surface counts and titles are read off those parked copies
 * (333:2490 Natural Marble / 40, 333:2500 terrazzo / 30, 333:2510 Porcelain / 70).
 */
export const collections = [
  { title: "Quartz", body: LOREM_SHORT, surfaces: "30 surfaces", image: "/images/collection-quartz.webp", href: "/collections/quartz" },
  { title: "Natural Marble", body: LOREM_SHORT, surfaces: "40 surfaces", image: "/images/collection-marble.webp", href: "/collections/marble" },
  { title: "Terrazzo", body: LOREM_SHORT, surfaces: "30 surfaces", image: "/images/collection-terrazzo.webp", href: "/collections/terrazzo" },
  { title: "Porcelain", body: LOREM_SHORT, surfaces: "70 surfaces", image: "/images/collection-porcelain.webp", href: "/collections/porcelain" },
] as const;

/**
 * Applications strip — 544:3950.
 *
 * Figma draws three cards clipped by a 1250px frame; the strip's own rawImages
 * carry four scenes plus the material swatch that sits on the active card.
 * Sectors come from the filter bar at 544:3931.
 */
export const applications = {
  headline: "Lorem IPSUM",
  body: LOREM_DUMMY,
  sectors: ["Residential", "Commercial", "Hospitality", "Healthcare"],
  cards: [
    { index: "01", title: "Kitchen", image: "/images/application-kitchen.webp" },
    { index: "02", title: "Bathroom", image: "/images/application-bathroom.webp" },
    { index: "03", title: "Living Room", image: "/images/application-living.webp" },
    { index: "04", title: "Lounge", image: "/images/application-lounge.webp" },
  ],
  swatch: { image: "/images/application-swatch.webp", label: "View material" },
} as const;

/** MaxGuard band — 542:5281 and siblings. */
export const maxguard = {
  ghost: ["lorem", "ipsum", "cal"],
  cta: { label: "Discover MaxGuard", href: "/maxguard" },
  appPrompt: "Download the App",
  stores: [
    { label: "Get it on Google Play", href: "https://play.google.com/store" },
    { label: "Download on the App Store", href: "https://www.apple.com/app-store/" },
  ],
} as const;

/** Surface visualiser — 544:3967 / 544:4015. */
export const visualiser = {
  headline: "Lorem IPSUM",
  body: LOREM_DUMMY,
  cta: { label: "Visualise Your Space", href: "/visualiser" },
} as const;

/** Karigare collage — Component 101 (544:4013). */
export const karigare = {
  headline: "Karigare",
  body: LOREM_SHORT,
} as const;

/**
 * Testimonials — 544:3970 heading, 544:4001 filter bar, cards at y7555.
 *
 * The four poster frames are video stills; Figma draws a play control on each.
 * `videoHref` is intentionally null until the client supplies the files —
 * the card renders as a poster with a disabled control rather than a dead link.
 */
export const testimonials = {
  headline: "Lorem IPSUM",
  body: LOREM_DUMMY,
  audiences: ["Architects", "Partners", "Consumers"],
  cards: [
    { image: "/images/testimonial-1.webp", role: "Homeowner", place: "Mumbai", videoHref: null },
    { image: "/images/testimonial-2.webp", role: "Architect", place: "Dubai", videoHref: null },
    { image: "/images/testimonial-3.webp", role: "Designer", place: "Singapore", videoHref: null },
    { image: "/images/testimonial-4.webp", role: "Homeowner", place: "Mumbai", videoHref: null },
  ],
} as const;

/** One run of the contact paragraph: plain, emphasised, or a link. */
export type ContactRun = { text: string; strong?: boolean; href?: string };

/** Contact band — 544:4021/4022/4023. This copy is real, not placeholder. */
export const contact: {
  headline: string;
  body: ContactRun[];
  cta: { label: string; href: string };
} = {
  headline: "Lorem ipsum",
  body: [
    { text: "Please contact Kalinga Stone Client Care Department on " },
    { text: "Monday - Sunday, 10 a.m. - 8 p.m.", strong: true },
    { text: " (except National Holidays) via email at " },
    { text: "info@kalingastone.com", strong: true, href: "mailto:info@kalingastone.com" },
    { text: " or by calling " },
    { text: "+91 8879070029", strong: true, href: "tel:+918879070029" },
  ],
  cta: { label: "Contact Us", href: "/contact" },
};

export type FooterGroup = { title: string | null; links: string[]; headingStyle?: boolean };

/** Footer — 555:2863. */
export const footer: {
  findAStore: { title: string; body: string; placeholder: string };
  follow: {
    title: string;
    body: string;
    linkText: string;
    socials: { name: string; href: string }[];
  };
  columns: { groups: FooterGroup[] }[];
  legal: string[];
} = {
  findAStore: {
    title: "Find a store",
    body: "Enter a location to find the closest Kalinga Stone stores",
    placeholder: "City or zip code",
  },
  follow: {
    title: "Follow us",
    body: "Subscribe to our newsletter to receive latest updates from Kalinga Stone.",
    linkText: "Subscribe to our newsletter",
    socials: [
      { name: "Instagram", href: "https://instagram.com" },
      { name: "LinkedIn", href: "https://linkedin.com" },
      { name: "YouTube", href: "https://youtube.com" },
    ],
  },
  columns: [
    {
      groups: [
        { title: "Collections", links: ["Quartz", "Marble", "Terrazzo", "Porcelain"] },
        { title: "Karigare", links: ["Base", "Form"] },
      ],
    },
    {
      groups: [
        { title: "Projects", links: ["Residential", "Hospitality", "Commercial", "Healthcare"] },
        // 544:4401 is a single text node holding four uppercase lines with no
        // child links — rendered here as headings, matching the design.
        { title: null, links: ["About", "Maxgaurd", "Media", "Contact"], headingStyle: true },
      ],
    },
  ],
  legal: ["Conditions of service", "Terms of use", "Privacy policy"],
};
