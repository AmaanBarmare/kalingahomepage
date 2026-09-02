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

/** One entry under a menu section. Legal links carry no card, hence optional. */
export type NavChild = { label: string; href: string; image?: string; alt?: string; position?: string };
/** A menu section: a heading that opens into a strip of its children's cards. */
export type NavSection = { label: string; href: string; children: NavChild[] };

/**
 * Site navigation — 1040:49584 "Component 107", two states of one 1440 x 911
 * overlay. Frame 675 is everything collapsed; Frame 674 has ENGINEERED SURFACES
 * open.
 *
 * This REPLACED the 521-wide ruby drawer (709:6387) that shipped first. The
 * white 90px bar above it is untouched — the same 686:3786 component, same
 * lockup, same hamburger — so only the overlay is new: it now takes 1153 of the
 * 1440 and each section opens into a strip of image cards rather than a text
 * list. `children` therefore carries a plate per entry.
 *
 * ONLY ENGINEERED SURFACES IS DRAWN OPEN, so its five plates are the board's
 * (1076:49128, exported to public/images/menu-*.webp). The other three sections
 * have no open state on the board and no plates with it; they reuse the page's
 * own art for the same destinations — karigear.columns for Base/Form, the
 * applications strip's sector scenes for Projects — so the pattern is
 * consistent. World of Kalinga has no page art for About/Blogs/Media at all and
 * is standing on borrowed plates; those three are the ones to replace when the
 * board grows an open state for it.
 *
 * Two Figma spellings are preserved deliberately, same rule as the footer's
 * MAXGAURD: "TERAZZO" (1076:49146) and "TERAM AND CONDITIONS" (1040:42115).
 * Both are wrong and both stay until the client corrects the board, so the
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
        { label: "Elixir", href: "/collections/elixir", image: "/images/menu-elixir.webp",
          alt: "A polished malachite slice with concentric green banding, mirrored on black" },
        { label: "Quartz", href: "/collections/quartz", image: "/images/menu-quartz.webp",
          alt: "A figure reading on a lounger beside a dark-tiled pool, seen from above" },
        { label: "Marble", href: "/collections/marble", image: "/images/menu-marble.webp",
          alt: "A curved stone staircase rising through a sunlit plaster hall" },
        { label: "Terazzo", href: "/collections/terrazzo", image: "/images/menu-terazzo.webp", position: "50% 100%",
          alt: "Stacked terrazzo-clad terraces of a coastal building above the sea" },
        { label: "Porcelain Tiles", href: "/collections/porcelain", image: "/images/menu-porcelain.webp", position: "50% 100%",
          alt: "A porcelain-lined lobby with a figure crossing the floor" },
      ],
    },
    {
      label: "Karigear",
      href: "/karigear",
      children: [
        { label: "Base", href: "/karigear/base", image: "/images/karigear-base-1.webp",
          alt: "Carved stone wall panel with a flowing wave relief, lit within a bronze frame" },
        { label: "Form", href: "/karigear/form", image: "/images/karigear-form-1.webp",
          alt: "Oval terrazzo table on a cylindrical base" },
      ],
    },
    {
      label: "Projects",
      href: "/projects",
      children: [
        { label: "Residential", href: "/projects/residential", image: "/images/residential-living-room-canva.webp",
          alt: "A double-height living room with city views and polished pale stone flooring" },
        { label: "Commercial", href: "/projects/commercial", image: "/images/commercial-lobby-common-area-canva.webp",
          alt: "A commercial lobby with stone-clad columns and a long seating run" },
        { label: "Hospitality", href: "/projects/hospitality", image: "/images/hospitality-lobby-canva.webp",
          alt: "A hotel lobby with a book-matched stone feature wall" },
        { label: "Healthcare", href: "/projects/healthcare", image: "/images/healthcare-reception-waiting-canva.webp",
          alt: "A healthcare reception with a pale stone counter and a waiting area beyond" },
      ],
    },
    {
      label: "World of Kalinga",
      href: "/about",
      children: [
        { label: "About", href: "/about", image: "/images/contact-lounge.webp",
          alt: "A stone-lined lounge with low seating and warm daylight" },
        { label: "Blogs", href: "/blogs", image: "/images/testimonial-work-drawing-desk.webp",
          alt: "A drawing desk with plans and material samples laid out" },
        { label: "Media", href: "/media", image: "/images/testimonial-work-sample-wall.webp",
          alt: "A wall of stone samples arranged in a studio" },
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
        material: "Warm Taupe Stone",       materialSrc: "/images/material-scene-residential-hallway.webp", materialAlt: "Warm taupe-grey stone with cloudy mineral movement and a fine pale vein network" },
      { index: "02", name: "Living Room", href: "/spaces/living-room", src: "/images/residential-living-room-canva.webp", alt: "A double-height living room with city views and polished pale stone flooring",
        material: "Calacatta Imperiale",    materialSrc: "/images/material-surface-calacatta-imperiale.webp", materialAlt: "Calacatta Imperiale quartz surface with fine warm-gold veining on white" },
      { index: "03", name: "Kitchen",     href: "/spaces/kitchen",     src: "/images/residential-kitchen-canva.webp",     alt: "A warm minimalist kitchen with a monolithic pale stone island",
        material: "Plazzo White",           materialSrc: "/images/material-surface-plazzo-white.webp",   materialAlt: "Plazzo White terrazzo surface with a fine warm-white aggregate" },
      { index: "04", name: "Bedroom",     href: "/spaces/bedroom",     src: "/images/residential-bedroom-canva.webp",     alt: "A calm neutral bedroom with a softly lit stone feature wall and matching floor",
        material: "Warm Greige Marble",     materialSrc: "/images/material-scene-residential-bedroom.webp", materialAlt: "Warm greige marble with low-contrast cloudy movement and delicate ivory veins" },
      { index: "05", name: "Workspace",   href: "/spaces/workspace",   src: "/images/residential-workspace-canva.webp",   alt: "A warm home workspace with a floating stone desk and pale stone flooring",
        material: "Crema Nova",             materialSrc: "/images/material-v2-crema-nova.webp",          materialAlt: "Crema Nova surface with warm cream mineral texture and a fine organic vein network" },
      { index: "06", name: "Bathroom",    href: "/spaces/bathroom",    src: "/images/residential-bathroom-canva.webp",    alt: "A sculptural bathroom with bookmatched stone vanity walls and warm beige surfaces",
        material: "Ivory Breccia",          materialSrc: "/images/material-scene-residential-bathroom.webp", materialAlt: "Ivory brecciated stone with black-charcoal mineral clusters and small amber accents" },
      { index: "07", name: "Dining",      href: "/spaces/dining",      src: "/images/residential-dining-canva.webp",      alt: "A minimal dining room with a monolithic stone table and softly lit textured walls",
        material: "Charcoal Marble",        materialSrc: "/images/material-scene-residential-dining.webp", materialAlt: "Deep warm-charcoal marble with subtle mottling and sparse hairline mineral veins" },
    ],
    Commercial: [
      { index: "01", name: "Entrance & Arrivals",      href: "/spaces/entrance-arrivals",    src: "/images/commercial-entrance-arrivals-canva.webp",    alt: "A double-height commercial entrance with a dramatic black stone feature wall and polished floor",
        material: "Grand Antique",           materialSrc: "/images/material-scene-commercial-entrance.webp", materialAlt: "Grand Antique black stone with organic white crystalline clusters and branching veins" },
      { index: "02", name: "Lobby & Common Area",      href: "/spaces/lobby-common-area",    src: "/images/commercial-lobby-common-area-canva.webp",    alt: "A refined commercial lobby with a terrazzo reception desk and dark aggregate floor",
        material: "Navona",                 materialSrc: "/images/material-surface-navona.webp",    materialAlt: "Navona terrazzo surface in charcoal black with fine pale aggregate" },
      { index: "03", name: "Office Interiors",         href: "/spaces/office-interiors",     src: "/images/commercial-office-interiors-canva.webp",     alt: "A commercial interior finished with large-format terrazzo flooring and mirrored partitions",
        material: "Savvanna",               materialSrc: "/images/material-surface-savvanna.webp",     materialAlt: "Savvanna terrazzo surface with bold charcoal and beige aggregate on white" },
      { index: "04", name: "Retail & Showroom Space",  href: "/spaces/retail-showroom",      src: "/images/commercial-retail-showroom-canva.webp",      alt: "A softly lit retail showroom with pale terrazzo floors and a timber service counter",
        material: "Plazzo White",           materialSrc: "/images/material-surface-plazzo-white.webp",      materialAlt: "Plazzo White terrazzo surface with a fine soft-grey aggregate" },
      { index: "05", name: "Meeting & Event Area",     href: "/spaces/meeting-event-area",   src: "/images/commercial-meeting-event-area-canva.webp",   alt: "A boardroom with a monolithic stone conference table overlooking a city skyline",
        material: "Bianco Oro",              materialSrc: "/images/material-surface-bianco-oro.webp",       materialAlt: "Bianco Oro quartz surface in a clean soft-white finish" },
    ],
    Hospitality: [
      { index: "01", name: "Entrance Facade",         href: "/spaces/hospitality/entrance-facade",     src: "/images/hospitality-entrance-facade-canva.webp",      alt: "A warmly lit hotel entrance framed by deep brown terrazzo and landscaped planting",
        material: "Rosso Valcano",           materialSrc: "/images/material-scene-hospitality-entrance.webp", materialAlt: "Rosso Valcano terrazzo with a dark brown-black base and dense burgundy mineral aggregate" },
      { index: "02", name: "Lobby",                   href: "/spaces/hospitality/lobby",               src: "/images/hospitality-lobby-canva.webp",                alt: "An elegant hotel lift lobby with polished pale stone flooring and warm grey wall cladding",
        material: "Silver Grey Marble",      materialSrc: "/images/material-scene-hospitality-lobby.webp", materialAlt: "Silver-grey marble with soft smoky crystalline movement and fine pale veins" },
      { index: "03", name: "Reception",               href: "/spaces/hospitality/reception",           src: "/images/hospitality-reception-canva.webp",            alt: "A spacious hotel reception with warm brown stone walls and pale terrazzo flooring",
        material: "Warm Brown Marble",       materialSrc: "/images/material-scene-hospitality-reception.webp", materialAlt: "Warm taupe-brown marble with layered cream and caramel mineral movement" },
      { index: "04", name: "Guest Rooms",             href: "/spaces/hospitality/guest-rooms",         src: "/images/hospitality-guest-rooms-canva.webp",          alt: "A warmly lit hotel guest room with dark aggregate stone panels and polished flooring",
        material: "Warm Charcoal Terrazzo",  materialSrc: "/images/material-scene-hospitality-guest-rooms.webp", materialAlt: "Warm charcoal-brown terrazzo with dense black, taupe, cream and grey aggregate" },
      { index: "05", name: "Bathroom",                href: "/spaces/hospitality/bathroom",            src: "/images/hospitality-bathroom-canva.webp",             alt: "A luxury hotel bathroom wrapped in softly veined white stone with brushed brass fixtures",
        material: "Statuario Classic",       materialSrc: "/images/material-v2-statuario-classic.webp",  materialAlt: "Statuario Classic white marble with expressive feathery grey veining" },
      { index: "06", name: "Restaurant",              href: "/spaces/hospitality/restaurant",          src: "/images/hospitality-restaurant-canva.webp",           alt: "A warm hotel restaurant bar with arched niches, cream stone walls and polished flooring",
        material: "Crema Nova",              materialSrc: "/images/material-surface-crema-nova.webp",    materialAlt: "Crema Nova marble surface in a warm cream tone with subtle natural movement" },
      { index: "07", name: "Wellness & Recreation",   href: "/spaces/hospitality/wellness-recreation", src: "/images/hospitality-wellness-recreation-canva.webp",  alt: "A serene hotel wellness area with sculpted arches and softly textured warm stone surfaces",
        material: "Ivory Crystal Stone",     materialSrc: "/images/material-scene-hospitality-wellness.webp", materialAlt: "Pale ivory crystalline stone with soft pearly depth and diffuse mineral movement" },
      { index: "08", name: "Outdoor & Landscape",     href: "/spaces/hospitality/outdoor-landscape",   src: "/images/hospitality-outdoor-landscape-canva.webp",   alt: "A landscaped hotel arrival court with illuminated terrazzo steps, benches and paving",
        material: "Imperial Grey Terrazzo",  materialSrc: "/images/material-v2-imperial-grey-terrazzo.webp", materialAlt: "Imperial Grey terrazzo with a dense mix of grey, charcoal and pale aggregate" },
    ],
    Healthcare: [
      { index: "01", name: "Entrance & Arrivals",       href: "/spaces/healthcare/entrance-arrivals",      src: "/images/healthcare-entrance-arrivals-canva.webp",       alt: "A contemporary healthcare entrance clad in pale aggregate stone with a dark sheltered arrival canopy",
        material: "Warm White Terrazzo",        materialSrc: "/images/material-scene-healthcare-entrance.webp",      materialAlt: "Warm-white terrazzo with dense charcoal, grey, beige and muted ochre aggregate" },
      { index: "02", name: "Reception & Waiting",       href: "/spaces/healthcare/reception-waiting",      src: "/images/healthcare-reception-waiting-canva.webp",       alt: "A softly lit healthcare reception with a curved grey stone desk and pale polished flooring",
        material: "Silver Blue Stone",          materialSrc: "/images/material-scene-healthcare-reception.webp",     materialAlt: "Pale silver-blue brecciated stone with fine mineral fragments and branching grey veins" },
      { index: "03", name: "Lobby & Corridors",         href: "/spaces/healthcare/lobby-corridors",        src: "/images/healthcare-lobby-corridors-canva.webp",         alt: "A bright healthcare lobby with a sweeping staircase and expressive blue-grey stone flooring",
        material: "Blue Crystal Agathe",       materialSrc: "/images/material-surface-blue-crystal-agathe.webp",   materialAlt: "Blue Crystal Agathe quartz surface with broad flowing blue and white crystalline bands" },
      { index: "04", name: "Consultation & Admin Area", href: "/spaces/healthcare/consultation-admin-area", src: "/images/healthcare-consultation-admin-area-canva.webp", alt: "A calm healthcare consultation room with a pale stone feature wall, desk and floor",
        material: "Calacatta Imperiale",       materialSrc: "/images/material-surface-calacatta-imperiale.webp",   materialAlt: "Calacatta Imperiale quartz surface with fine warm-gold veining on white" },
      { index: "05", name: "Patient Rooms & Suites",    href: "/spaces/healthcare/patient-rooms-suites",    src: "/images/healthcare-patient-rooms-suites-canva.webp",    alt: "A private patient suite with warm neutral finishes, city views and softly veined pale flooring",
        material: "Crema Nova",                materialSrc: "/images/material-v3-crema-nova-patient-rooms.webp",     materialAlt: "Crema Nova surface in a warm cream tone with restrained natural movement" },
    ],
  },
  materialCta: "View Material",
} as const;

/** MaxGuard band — 906:32016 and siblings. */
export const maxguard = {
  // The board's ghost headline ("lorem" / "ipsum" / "cal", set behind a cutout
  // of the couple) is gone — 721:30948 and 721:30949 are a real headline and
  // body in its place.
  headline: "Lorem ipsum",
  body: LOREM_BRIEF,
  cta: { label: "Discover MaxGuard", href: "/maxguard" },
  // 998:37554. The app row — a "Download the App" label with Google Play and
  // App Store marks at the bottom right — is gone. The board now pairs a
  // second, outline KS/Button with the ruby one at the bottom left, so this is
  // a CTA rather than a label plus two store links.
  //
  // The board gives it no destination; `/maxguard/app` follows the same
  // placeholder convention as every other href in this file.
  appCta: { label: "Download the App", href: "/maxguard/app" },
} as const;

/** Surface visualiser — 544:3967 / 544:4015. */
export const visualiser = {
  headline: "Lorem IPSUM",
  body: LOREM_DUMMY,
  cta: { label: "Visualize Your Space", href: "/visualiser" },
} as const;

/** Karigear collage — Component 101 (544:4013). */
/**
 * Karigear — Figma 721:29303 (heading), 764:9494 (BASE), 721:29349 (FORM),
 * 721:29347 (CTA).
 *
 * The eight frames are curated out of the client's CMC Value Added Services
 * deck; see DESIGN.md for why these eight and not others. `position` is the
 * object-position each one needs in the near-square 640 x 660 frame — the deck
 * is shot for full-bleed slides, so several of them do not want centring.
 */
export const karigear = {
  headline: "Karigear",
  body: LOREM_SHORT,
  cta: { label: "Explore our expertise", href: "/karigear" },
  // THREE frames per column, not four. Both columns must stay the same length —
  // the two tracks travel in opposite directions across the same distance, and
  // `COUNT` is read off this first column for both.
  columns: [
    {
      label: "Base",
      href: "/karigear/base",
      frames: [
        { src: "/images/karigear-base-1.webp", position: "50% 50%",
          alt: "Carved stone wall panel with a flowing wave relief, lit within a bronze frame" },
        { src: "/images/karigear-base-2.webp", position: "50% 50%",
          alt: "Textured stone feature wall above a linear fireplace in a living room" },
        { src: "/images/karigear-base-3.webp", position: "50% 50%",
          alt: "Circular stone inlay floor medallion seen from above, ringed by a curved sofa" },
      ],
    },
    {
      label: "Form",
      href: "/karigear/form",
      frames: [
        { src: "/images/karigear-form-1.webp", position: "50% 50%",
          alt: "Oval terrazzo table on a cylindrical base" },
        { src: "/images/karigear-form-2.webp", position: "50% 50%",
          alt: "Travertine bench with a solid slab seat" },
        { src: "/images/karigear-form-3.webp", position: "50% 50%",
          alt: "Book-matched marble dining table on a solid slab base" },
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
  // TWO OF THE FOUR ARE VIDEOS, NOT ALL FOUR. The board draws the ring-and-
  // triangle on 721:29315 and 721:29310 only; 721:29312 and 721:29321 are still
  // lifes of the work itself — a hand against a sample wall, and a desk of
  // drawings and swatches — and carry no control. `isVideo` is what the play
  // button keys off; `videoHref` stays for the destination, which the board
  // still does not give.
  //
  // `alt` is per-card now rather than built from role and place: that reads as
  // a portrait ("Architect, Dubai") and two of these are no longer portraits.
  cards: [
    { image: "/images/testimonial-clean-1.webp", role: "Homeowner", place: "Mumbai",
      isVideo: true, videoHref: null,
      alt: "A homeowner speaking to camera in a marble kitchen" },
    { image: "/images/testimonial-work-sample-wall.webp", role: "Architect", place: "Dubai",
      isVideo: false, videoHref: null,
      alt: "A hand selecting a stone sample from a wall of textured tiles" },
    { image: "/images/testimonial-clean-3.webp", role: "Designer", place: "Singapore",
      isVideo: true, videoHref: null,
      alt: "A designer speaking to camera beside a stone counter" },
    { image: "/images/testimonial-work-drawing-desk.webp", role: "Homeowner", place: "Mumbai",
      isVideo: false, videoHref: null,
      alt: "Hands working over architectural drawings, stone swatches and samples" },
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
   * The band carries TWO buttons now, and the brochure one changed fill: it was
   * the white outline every CTA on photography uses, and is the ruby Primary
   * here. The second is the visualiser's own CTA, repeated — same label, same
   * destination, so the two are kept identical deliberately.
   *
   * SPELLING: "Visualize", with a z, in both places. The board spells it that
   * way on this button (1000:56840) and the client has confirmed it as the
   * house spelling, so the visualiser section's own CTA was moved to match
   * rather than leaving one page offering the same button two ways. The
   * `/visualiser` route and the component and asset names are untouched — they
   * are the section's identifier, not the label.
   */
  secondaryCta: { label: "Visualize Your Space", href: "/visualiser" },
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

/**
 * Footer — 880:27210, rebuilt.
 *
 * WHAT WENT: the FOLLOW US block (heading, newsletter line, and the 159 x 25
 * three-mark socials strip) and the centred legal row. Both are gone from the
 * board entirely, and the two-column-of-two-groups arrangement went with them.
 *
 * WHAT ARRIVED: four flat link columns instead of two stacked pairs, and two
 * new rows under a rule apiece — offices and contact details, then named social
 * links with a copyright line. The socials are now text with an icon rather
 * than bare marks, which is why each one needs its own file in public/icons
 * instead of the single flattened strip.
 *
 * Column headings are Haas Grot Disp R 55 Roman 16 / +1.5 on #f3f3f3; links are
 * 45 Light 16 / +2 on white/70, stacked on a 14px gap — the same 33px pitch the
 * old columns ran on, reached a different way.
 */
export const footer: {
  findAStore: { title: string; body: string; placeholder: string };
  columns: { title: string; links: { label: string; href: string }[] }[];
  offices: string[];
  contacts: { icon: string; label: string }[];
  socials: { name: string; icon: string; href: string }[];
  copyright: string[];
} = {
  findAStore: {
    title: "Find a store",
    body: "Enter a location to find the closest Kalinga Stone stores",
    placeholder: "City or zip code",
  },
  columns: [
    {
      title: "Engineered Surfaces",
      links: [
        { label: "Elixir - Premium Edition", href: "/collections/elixir" },
        { label: "Quartz", href: "/collections/quartz" },
        { label: "Marble", href: "/collections/marble" },
        { label: "Terrazzo", href: "/collections/terrazzo" },
        { label: "Porcelain", href: "/collections/porcelain" },
      ],
    },
    {
      title: "Karigear",
      links: [
        { label: "Base", href: "/karigear/base" },
        { label: "Form", href: "/karigear/form" },
      ],
    },
    {
      title: "Spaces",
      links: [
        { label: "Residential", href: "/spaces/residential" },
        { label: "Commercial", href: "/spaces/commercial" },
        { label: "Hospitality", href: "/spaces/hospitality" },
        { label: "Healthcare", href: "/spaces/healthcare" },
      ],
    },
    {
      title: "World of Kalinga",
      links: [
        { label: "About", href: "/about" },
        { label: "Blogs", href: "/blogs" },
        { label: "Media", href: "/media" },
      ],
    },
  ],
  offices: [
    "Head Office : Lorem ipsum dolor sit amet consectetur.",
    "Manufacturing Factory : Lorem ipsum dolor sit amet consectetur.",
  ],
  // Plain text, not links: the board gives placeholder copy, and there is no
  // number or address to put behind a tel: or mailto: yet.
  contacts: [
    { icon: "/icons/phone.svg", label: "Adipiscing" },
    { icon: "/icons/mail.svg", label: "Lorem ipsum curabitur" },
  ],
  socials: [
    { name: "Instagram", icon: "/icons/instagram.svg", href: "https://instagram.com" },
    { name: "Facebook", icon: "/icons/facebook.svg", href: "https://facebook.com" },
    // The board spells this "Linkdin". Corrected here — a misspelt brand name in
    // a live footer is a defect, not a design decision.
    { name: "LinkedIn", icon: "/icons/linkedin.svg", href: "https://linkedin.com" },
    { name: "YouTube", icon: "/icons/youtube.svg", href: "https://youtube.com" },
  ],
  copyright: ["2026 Kalinga Stone.", "All rights reserved."],
};
