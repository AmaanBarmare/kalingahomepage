/**
 * Every string on the homepage, in one place.
 *
 * The Figma frame (544:3926) is laid out with lorem ipsum in all but the
 * contact block, and that is reproduced verbatim here — including the
 * placeholder headline "Lorem ipsum hakdinaik ahdk" — so the build matches the
 * design exactly. Real copy drops in here without touching a single component.
 *
 * The contact paragraph and the footer navigation ARE real and are transcribed
 * as-is. The footer's `MAXGAURD` misspelling is gone with the node that carried
 * it (544:4401) — the board's footer now runs DISCOVER / About / Blogs / Media.
 * The drawer's own misspellings are still live and still preserved; see below.
 */

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/** 665:15192 stops one clause earlier than LOREM_SHORT. Figma's, verbatim. */
const LOREM_BRIEF =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.";

const LOREM_DUMMY =
  "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since.";

/** One entry under a drawer section. */
export type NavChild = { label: string; href: string };
/** A drawer section: a heading with a chevron and a collapsible child list. */
export type NavSection = { label: string; href: string; children: NavChild[] };

/**
 * Site navigation — 709:6387 "Frame 552", six variants of one 1440 x 90 bar.
 * Variant1 is the closed bar; Variant2 is the open drawer with everything
 * collapsed; Variants 3-6 each expand one section.
 *
 * Two Figma spellings are preserved deliberately, same rule as the footer's
 * MAXGAURD: "TERAZZO" (709:6683) and "TERAM AND CONDITIONS" (709:6666). Both
 * are wrong and both stay until the client corrects the board, so the
 * discrepancy is visible rather than silently patched.
 */
export const nav: {
  sections: NavSection[];
  inquiry: { lead: string; email: string };
  legal: NavChild[];
} = {
  sections: [
    {
      label: "Engineered Surfaces",
      href: "/collections",
      children: [
        { label: "Elixir - Premium Edition", href: "/collections/elixir" },
        { label: "Quartz", href: "/collections/quartz" },
        { label: "Marble", href: "/collections/marble" },
        { label: "Terazzo", href: "/collections/terrazzo" },
        { label: "Porcelain", href: "/collections/porcelain" },
      ],
    },
    {
      label: "Karigare",
      href: "/karigare",
      children: [
        { label: "Base", href: "/karigare/base" },
        { label: "Form", href: "/karigare/form" },
      ],
    },
    {
      label: "Projects",
      href: "/projects",
      children: [
        { label: "Residential", href: "/projects/residential" },
        { label: "Commercial", href: "/projects/commercial" },
        { label: "Hospitality", href: "/projects/hospitality" },
        { label: "Healthcare", href: "/projects/healthcare" },
      ],
    },
    {
      label: "World of Kalinga",
      href: "/about",
      children: [
        { label: "About", href: "/about" },
        { label: "Blogs", href: "/blogs" },
        { label: "Media", href: "/media" },
      ],
    },
  ],
  inquiry: { lead: "Any inquiry", email: "info@kalingastone.com" },
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Teram and Conditions", href: "/terms" },
    { label: "Policy", href: "/policy" },
  ],
};

export const hero = {
  headline: "is simply dummy text",
  body: LOREM_SHORT,
  cta: { label: "Explore Collection", href: "/collections" },
} as const;

export const intro = {
  headline: "Lorem ipsum hakdinaik ahdk",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
} as const;

/** Homepage collection story, in the order each plate enters on scroll. */
export const collections = [
  { title: "Quartz", body: LOREM_SHORT, surfaces: "30 surfaces", image: "/images/collection-scroll-quartz.webp", href: "/collections/quartz" },
  { title: "Marble", body: LOREM_SHORT, surfaces: "40 surfaces", image: "/images/collection-scroll-marble.webp", href: "/collections/marble" },
  { title: "Terrazzo", body: LOREM_SHORT, surfaces: "30 surfaces", image: "/images/collection-scroll-terrazzo.webp", href: "/collections/terrazzo" },
  { title: "Porcelain", body: LOREM_SHORT, surfaces: "70 surfaces", image: "/images/collection-scroll-porcelain.webp", href: "/collections/porcelain" },
] as const;

/**
 * Applications / Browse by Space strip — 544:3950.
 *
 * The local heading and filter labels stay aligned with this page's Figma
 * frame. Card order, destinations, scene plates, and hover-detail materials
 * mirror the reference site's Browse by Space section sector by sector.
 */
export const applications = {
  headline: "Lorem IPSUM",
  body: LOREM_DUMMY,
  sectors: ["Residential", "Commercial", "Hospitality", "Healthcare"],
  /** 721:29308 — the ruby "View All" under the strip. */
  cta: { label: "View All", href: "/spaces" },
  spacesBySector: {
    Residential: [
      { index: "01", name: "Hallway",     href: "/spaces/hallway",     src: "/images/residential-hallway-canva.webp",     alt: "A sunlit residential hallway with pale stone floors and warm plaster walls",
        material: "Crema Nova",             materialSrc: "/images/material-surface-crema-nova.webp",        materialAlt: "Crema Nova marble surface in a warm cream tone with subtle natural movement" },
      { index: "02", name: "Living Room", href: "/spaces/living-room", src: "/images/residential-living-room-canva.webp", alt: "A double-height living room with city views and polished pale stone flooring",
        material: "Calacatta Imperiale",    materialSrc: "/images/material-surface-calacatta-imperiale.webp", materialAlt: "Calacatta Imperiale quartz surface with fine warm-gold veining on white" },
      { index: "03", name: "Kitchen",     href: "/spaces/kitchen",     src: "/images/residential-kitchen-canva.webp",     alt: "A warm minimalist kitchen with a monolithic pale stone island",
        material: "Bianco Oro",             materialSrc: "/images/material-surface-bianco-oro.webp",     materialAlt: "Bianco Oro quartz surface in a clean soft-white finish" },
      { index: "04", name: "Bedroom",     href: "/spaces/bedroom",     src: "/images/residential-bedroom-canva.webp",     alt: "A calm neutral bedroom with a softly lit stone feature wall and matching floor",
        material: "Emperador Chiara",       materialSrc: "/images/material-surface-emperador-chiara.webp",     materialAlt: "Emperador Chiara marble surface with warm taupe mineral movement" },
      { index: "05", name: "Workspace",   href: "/spaces/workspace",   src: "/images/residential-workspace-canva.webp",   alt: "A warm home workspace with a floating stone desk and pale stone flooring",
        material: "Sleek Concrete",         materialSrc: "/images/material-surface-sleek-concrete.webp",   materialAlt: "Sleek Concrete marble surface in a smooth warm-grey finish" },
      { index: "06", name: "Bathroom",    href: "/spaces/bathroom",    src: "/images/residential-bathroom-canva.webp",    alt: "A sculptural bathroom with bookmatched stone vanity walls and warm beige surfaces",
        material: "Calacatta Duo",          materialSrc: "/images/material-surface-calacatta-duo.webp",    materialAlt: "Calacatta Duo quartz surface with restrained grey veining on white" },
      { index: "07", name: "Dining",      href: "/spaces/dining",      src: "/images/residential-dining-canva.webp",      alt: "A minimal dining room with a monolithic stone table and softly lit textured walls",
        material: "Dune Wave",              materialSrc: "/images/material-surface-dune-wave.webp",      materialAlt: "Dune Wave quartz surface with layered warm-beige movement" },
    ],
    Commercial: [
      { index: "01", name: "Entrance & Arrivals",      href: "/spaces/entrance-arrivals",    src: "/images/commercial-entrance-arrivals-canva.webp",    alt: "A double-height commercial entrance with a dramatic black stone feature wall and polished floor",
        material: "Grand Antique",           materialSrc: "/images/material-surface-grand-antique.webp",    materialAlt: "Grand Antique quartz surface in deep black with dramatic white veining" },
      { index: "02", name: "Lobby & Common Area",      href: "/spaces/lobby-common-area",    src: "/images/commercial-lobby-common-area-canva.webp",    alt: "A refined commercial lobby with a terrazzo reception desk and dark aggregate floor",
        material: "Navona",                 materialSrc: "/images/material-surface-navona.webp",    materialAlt: "Navona terrazzo surface in charcoal black with fine pale aggregate" },
      { index: "03", name: "Office Interiors",         href: "/spaces/office-interiors",     src: "/images/commercial-office-interiors-canva.webp",     alt: "A commercial interior finished with large-format terrazzo flooring and mirrored partitions",
        material: "Savvanna",               materialSrc: "/images/material-surface-savvanna.webp",     materialAlt: "Savvanna terrazzo surface with bold charcoal and beige aggregate on white" },
      { index: "04", name: "Retail & Showroom Space",  href: "/spaces/retail-showroom",      src: "/images/commercial-retail-showroom-canva.webp",      alt: "A softly lit retail showroom with pale terrazzo floors and a timber service counter",
        material: "Plazzo White",           materialSrc: "/images/material-surface-plazzo-white.webp",      materialAlt: "Plazzo White terrazzo surface with a fine soft-grey aggregate" },
      { index: "05", name: "Meeting & Event Area",     href: "/spaces/meeting-event-area",   src: "/images/commercial-meeting-event-area-canva.webp",   alt: "A boardroom with a monolithic stone conference table overlooking a city skyline",
        material: "Michael Angelo",         materialSrc: "/images/material-surface-michael-angelo.webp",   materialAlt: "Michael Angelo quartz surface with soft clouded grey movement on white" },
    ],
    Hospitality: [
      { index: "01", name: "Entrance Facade",         href: "/spaces/hospitality/entrance-facade",     src: "/images/hospitality-entrance-facade-canva.webp",      alt: "A warmly lit hotel entrance framed by deep brown terrazzo and landscaped planting",
        material: "Rosso Valcano",           materialSrc: "/images/material-surface-rosso-valcano.webp", materialAlt: "Rosso Valcano terrazzo surface with rust, charcoal and pale mineral aggregate" },
      { index: "02", name: "Lobby",                   href: "/spaces/hospitality/lobby",               src: "/images/hospitality-lobby-canva.webp",                alt: "An elegant hotel lift lobby with polished pale stone flooring and warm grey wall cladding",
        material: "Sleek Concrete",          materialSrc: "/images/material-surface-sleek-concrete.webp", materialAlt: "Sleek Concrete marble surface in a smooth warm-grey finish" },
      { index: "03", name: "Reception",               href: "/spaces/hospitality/reception",           src: "/images/hospitality-reception-canva.webp",            alt: "A spacious hotel reception with warm brown stone walls and pale terrazzo flooring",
        material: "Terra Cream",             materialSrc: "/images/material-surface-terra-cream.webp",   materialAlt: "Terra Cream terrazzo surface with warm beige and ivory aggregate" },
      { index: "04", name: "Guest Rooms",             href: "/spaces/hospitality/guest-rooms",         src: "/images/hospitality-guest-rooms-canva.webp",          alt: "A warmly lit hotel guest room with dark aggregate stone panels and polished flooring",
        material: "Ceppo",                   materialSrc: "/images/material-surface-ceppo.webp",         materialAlt: "Ceppo terrazzo surface with grey, taupe and pale mineral aggregate" },
      { index: "05", name: "Bathroom",                href: "/spaces/hospitality/bathroom",            src: "/images/hospitality-bathroom-canva.webp",             alt: "A luxury hotel bathroom wrapped in softly veined white stone with brushed brass fixtures",
        material: "Calacatta Duo",           materialSrc: "/images/material-surface-calacatta-duo.webp", materialAlt: "Calacatta Duo quartz surface with restrained grey veining on white" },
      { index: "06", name: "Restaurant",              href: "/spaces/hospitality/restaurant",          src: "/images/hospitality-restaurant-canva.webp",           alt: "A warm hotel restaurant bar with arched niches, cream stone walls and polished flooring",
        material: "Crema Nova",              materialSrc: "/images/material-surface-crema-nova.webp",    materialAlt: "Crema Nova marble surface in a warm cream tone with subtle natural movement" },
      { index: "07", name: "Wellness & Recreation",   href: "/spaces/hospitality/wellness-recreation", src: "/images/hospitality-wellness-recreation-canva.webp",  alt: "A serene hotel wellness area with sculpted arches and softly textured warm stone surfaces",
        material: "Dune Wave",               materialSrc: "/images/material-surface-dune-wave.webp",      materialAlt: "Dune Wave quartz surface with layered warm-beige movement" },
      { index: "08", name: "Outdoor & Landscape",     href: "/spaces/hospitality/outdoor-landscape",   src: "/images/hospitality-outdoor-landscape-canva.webp",   alt: "A landscaped hotel arrival court with illuminated terrazzo steps, benches and paving",
        material: "Savvanna",                materialSrc: "/images/material-surface-savvanna.webp",       materialAlt: "Savvanna terrazzo surface with bold charcoal and beige aggregate on white" },
    ],
    Healthcare: [
      { index: "01", name: "Entrance & Arrivals",       href: "/spaces/healthcare/entrance-arrivals",      src: "/images/healthcare-entrance-arrivals-canva.webp",       alt: "A contemporary healthcare entrance clad in pale aggregate stone with a dark sheltered arrival canopy",
        material: "Savvanna",                  materialSrc: "/images/material-surface-savvanna.webp",               materialAlt: "Savvanna terrazzo surface with bold charcoal and beige aggregate on white" },
      { index: "02", name: "Reception & Waiting",       href: "/spaces/healthcare/reception-waiting",      src: "/images/healthcare-reception-waiting-canva.webp",       alt: "A softly lit healthcare reception with a curved grey stone desk and pale polished flooring",
        material: "Palladio Grey",             materialSrc: "/images/material-surface-palladio-grey.webp",          materialAlt: "Palladio Grey marble surface with fine organic movement through a warm grey field" },
      { index: "03", name: "Lobby & Corridors",         href: "/spaces/healthcare/lobby-corridors",        src: "/images/healthcare-lobby-corridors-canva.webp",         alt: "A bright healthcare lobby with a sweeping staircase and expressive blue-grey stone flooring",
        material: "Blue Crystal Agathe",       materialSrc: "/images/material-surface-blue-crystal-agathe.webp",   materialAlt: "Blue Crystal Agathe quartz surface with broad flowing blue and white crystalline bands" },
      { index: "04", name: "Consultation & Admin Area", href: "/spaces/healthcare/consultation-admin-area", src: "/images/healthcare-consultation-admin-area-canva.webp", alt: "A calm healthcare consultation room with a pale stone feature wall, desk and floor",
        material: "Calacatta Imperiale",       materialSrc: "/images/material-surface-calacatta-imperiale.webp",   materialAlt: "Calacatta Imperiale quartz surface with fine warm-gold veining on white" },
      { index: "05", name: "Patient Rooms & Suites",    href: "/spaces/healthcare/patient-rooms-suites",    src: "/images/healthcare-patient-rooms-suites-canva.webp",    alt: "A private patient suite with warm neutral finishes, city views and softly veined pale flooring",
        material: "Crema Nova",                materialSrc: "/images/material-surface-crema-nova.webp",              materialAlt: "Crema Nova marble surface in a warm cream tone with subtle natural movement" },
    ],
  },
  materialCta: "View Material",
} as const;

/** MaxGuard band — 542:5281 and siblings. */
export const maxguard = {
  // The board's ghost headline ("lorem" / "ipsum" / "cal", set behind a cutout
  // of the couple) is gone — 665:15191 and 665:15192 are a real headline and
  // body in its place.
  headline: "Lorem ipsum",
  body: LOREM_BRIEF,
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
/**
 * Karigare — Figma 721:29303 (heading), 764:9494 (BASE), 721:29349 (FORM),
 * 721:29347 (CTA).
 *
 * The eight frames are curated out of the client's CMC Value Added Services
 * deck; see DESIGN.md for why these eight and not others. `position` is the
 * object-position each one needs in the near-square 640 x 660 frame — the deck
 * is shot for full-bleed slides, so several of them do not want centring.
 */
export const karigare = {
  headline: "Karigare",
  body: LOREM_SHORT,
  cta: { label: "Explore our expertise", href: "/karigare" },
  columns: [
    {
      label: "Base",
      href: "/karigare/base",
      frames: [
        { src: "/images/karigare-base-1.webp", position: "50% 50%",
          alt: "Hotel lobby with a swirling stone inlay floor" },
        { src: "/images/karigare-base-2.webp", position: "50% 50%",
          alt: "Inlay wall of mother-of-pearl and semi-precious stone beside a veined marble counter" },
        { src: "/images/karigare-base-3.webp", position: "50% 50%",
          alt: "Flat-carved stone panel with geometric relief" },
        { src: "/images/karigare-base-4.webp", position: "50% 50%",
          alt: "Three-dimensional carved stone panel with flowing relief" },
      ],
    },
    {
      label: "Form",
      href: "/karigare/form",
      frames: [
        { src: "/images/karigare-form-1.webp", position: "50% 50%",
          alt: "Freestanding stone bath against book-matched marble" },
        { src: "/images/karigare-form-2.webp", position: "50% 50%",
          alt: "Fluted stone vessel basin beneath a backlit mirror" },
        { src: "/images/karigare-form-3.webp", position: "50% 50%",
          alt: "Sculptural carved stone table base supporting a glass top" },
        { src: "/images/karigare-form-4.webp", position: "50% 50%",
          alt: "Glass-topped table on a carved stone base in daylight" },
      ],
    },
  ],
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
    { image: "/images/testimonial-clean-1.webp", role: "Homeowner", place: "Mumbai", videoHref: null },
    { image: "/images/testimonial-clean-2.webp", role: "Architect", place: "Dubai", videoHref: null },
    { image: "/images/testimonial-clean-3.webp", role: "Designer", place: "Singapore", videoHref: null },
    { image: "/images/testimonial-clean-4.webp", role: "Homeowner", place: "Mumbai", videoHref: null },
  ],
} as const;

/**
 * Contact band — 544:4021 / 544:4022 / 544:4023.
 *
 * The body used to be real Client Care copy. The board now carries lorem there
 * (544:4022 is literally named after it), so this follows the board. The
 * paragraph it replaced is kept here verbatim so restoring it is one edit and
 * not a trip through git:
 *
 *   Please contact Kalinga Stone Client Care Department on **Monday - Sunday,
 *   10 a.m. - 8 p.m.** (except National Holidays) via email at
 *   **info@kalingastone.com** or by calling **+91 8879070029**.
 *
 * The CTA changed with it: "Contact Us" -> "Download brochure", and it now
 * carries a chevron (695:2576) drawn over the button.
 */
export const contact = {
  headline: "Lorem ipsum",
  body: LOREM_SHORT,
  cta: { label: "Download brochure" },
  /**
   * The CTA is a menu, not a link — see brochure-menu.tsx. These are the four
   * studio brochures, downsampled from their 300ppi CMYK print masters by
   * tools/optimize-brochures.py; they open in a new tab rather than download.
   * Order is the client's: Elixir first, then the three stone families.
   */
  brochures: [
    { label: "Elixir Collection Brochure", href: "/brochures/kalinga-elixir-collection.pdf" },
    { label: "Marble Collection Brochure", href: "/brochures/kalinga-marble-collection.pdf" },
    { label: "Quartz Collection Brochure", href: "/brochures/kalinga-quartz-collection.pdf" },
    { label: "Terrazzo Collection Brochure", href: "/brochures/kalinga-terrazzo-collection.pdf" },
  ],
} as const;

export type FooterGroup = { title: string; links: string[] };

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
        // Was 544:4401, one text node of four uppercase lines with no heading
        // and no child links. The board replaced it with a normal group — a
        // DISCOVER heading over three links on the same 33px pitch as the rest
        // (I880:27210;665:7419), which also retired the MAXGAURD misspelling.
        { title: "Discover", links: ["About", "Blogs", "Media"] },
      ],
    },
  ],
  legal: ["Conditions of service", "Terms of use", "Privacy policy"],
};
