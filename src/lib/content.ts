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
  spacesBySector: {
    Residential: [
      { index: "01", name: "Bathroom",    href: "/spaces/bathroom",    src: "/images/residential-bathroom.webp",    alt: "A contemporary bathroom with a warm white engineered quartz shower wall and mitred vanity",
        material: "Bianco Chianti",         materialSrc: "/images/material-v2-bianco-chianti.webp",    materialAlt: "Close detail of warm white engineered quartz with delicate grey veining" },
      { index: "02", name: "Living Room", href: "/spaces/living-room", src: "/images/residential-living-room.webp", alt: "A living room with a floor-to-ceiling black engineered quartz fireplace wall crossed by bold white veins",
        material: "Grand Antique",          materialSrc: "/images/material-v2-grand-antique.webp", materialAlt: "Close detail of black engineered quartz with dramatic white veining" },
      { index: "03", name: "Kitchen",     href: "/spaces/kitchen",     src: "/images/residential-kitchen.webp",     alt: "A walnut kitchen centred on a warm Calacatta engineered quartz waterfall island and backsplash",
        material: "Calacatta Oro",          materialSrc: "/images/material-v2-calacatta-oro.webp",     materialAlt: "Close detail of warm ivory engineered quartz with grey and muted gold veins" },
      { index: "04", name: "Workspace",   href: "/spaces/workspace",   src: "/images/residential-workspace.webp",   alt: "A home workspace with a deep green engineered quartz desk and statement wall",
        material: "Verde Botanic Classico", materialSrc: "/images/material-v2-verde-botanic-classico.webp",   materialAlt: "Close detail of deep botanical green engineered quartz with pale mineral veins" },
      { index: "05", name: "Dining",      href: "/spaces/dining",      src: "/images/residential-dining.webp",      alt: "A warm dining room centred on a sculptural engineered terrazzo table",
        material: "Murano Terrazzo",        materialSrc: "/images/material-v2-murano-terrazzo.webp",      materialAlt: "Close detail of creamy engineered terrazzo with terracotta, olive and charcoal aggregate" },
      { index: "06", name: "Hallway",     href: "/spaces/hallway",     src: "/images/residential-hallway.webp",     alt: "A residential hallway finished with large-format warm cream engineered marble flooring and wall cladding",
        material: "Crema Nova",             materialSrc: "/images/material-v2-crema-nova.webp",     materialAlt: "Close detail of warm cream engineered marble with soft beige and grey movement" },
      { index: "07", name: "Bedroom",     href: "/spaces/bedroom",     src: "/images/residential-bedroom.webp",     alt: "A calm bedroom with a taupe engineered marble headboard wall and matching bedside ledge",
        material: "Emperador Chiara",       materialSrc: "/images/material-v2-emperador-chiara.webp",     materialAlt: "Close detail of taupe engineered marble with fine cream veining" },
    ],
    Commercial: [
      { index: "01", name: "Entrance & Arrivals",      href: "/spaces/entrance-arrivals",    src: "/images/commercial-entrance-arrivals.webp",    alt: "A corporate entrance framed by monumental white engineered marble wall cladding, deep jambs and flooring",
        material: "Statuario Classic",       materialSrc: "/images/material-v2-statuario-classic.webp",    materialAlt: "Close detail of warm white engineered marble with disciplined charcoal-grey veining" },
      { index: "02", name: "Lobby & Common Area",      href: "/spaces/lobby-common-area",    src: "/images/commercial-lobby-common-area.webp",    alt: "A large commercial lobby with engineered terrazzo flooring, curved reception desk and communal bench",
        material: "Imperial Grey Terrazzo", materialSrc: "/images/material-v2-imperial-grey-terrazzo.webp",    materialAlt: "Close detail of warm grey engineered terrazzo with cream, charcoal, rust and green aggregate" },
      { index: "03", name: "Office Interiors",         href: "/spaces/office-interiors",     src: "/images/commercial-office-interiors.webp",     alt: "A contemporary office with warm grey engineered quartz workstations and full-height wall cladding",
        material: "Michelangelo Quartz",    materialSrc: "/images/material-v2-michelangelo-quartz.webp",     materialAlt: "Close detail of warm grey engineered quartz with subtle pale mineral movement" },
      { index: "04", name: "Retail & Showroom Space",  href: "/spaces/retail-showroom",      src: "/images/commercial-retail-showroom.webp",      alt: "A luxury showroom with black engineered quartz display walls, illuminated niches and monolithic plinths",
        material: "Grand Antique",          materialSrc: "/images/material-v2-grand-antique.webp",      materialAlt: "Close detail of jet-black engineered quartz with bold organic white veining" },
      { index: "05", name: "Meeting & Event Area",     href: "/spaces/meeting-event-area",   src: "/images/commercial-meeting-event-area.webp",   alt: "An executive meeting and event suite centred on a blue-grey engineered quartz table and matching wall",
        material: "Blue Crystal Agathe",    materialSrc: "/images/material-v2-blue-crystal-agathe.webp",   materialAlt: "Close detail of blue-grey engineered quartz with luminous crystalline blue, white and amber movement" },
    ],
    Hospitality: [
      { index: "01", name: "Entrance Facade",          href: "/spaces/hospitality/entrance-facade",    src: "/images/hospitality-entrance-facade.webp",          alt: "A luxury hotel entrance framed by monumental bookmatched white engineered marble slabs",
        material: "Statuario Classic",       materialSrc: "/images/material-v3-statuario-classic-entrance-facade.webp", materialAlt: "Close detail of warm ivory engineered marble with dense branching charcoal-grey veining matching the entrance facade" },
      { index: "02", name: "Lobby",                  href: "/spaces/hospitality/lobby",              src: "/images/hospitality-lobby.webp",                    alt: "A double-height hotel lobby with warm grey terrazzo flooring and curved sculptural plinths",
        material: "Bianco Terrazzo",         materialSrc: "/images/material-v2-bianco-terrazzo.webp",                    materialAlt: "Close detail of warm grey engineered terrazzo with cream, charcoal and muted earth aggregate" },
      { index: "03", name: "Reception",              href: "/spaces/hospitality/reception",          src: "/images/hospitality-reception.webp",                alt: "A hotel reception desk and full-height feature wall clad in deep forest-green engineered quartz",
        material: "Verde Botanic Classico", materialSrc: "/images/material-v2-verde-botanic-classico.webp",                materialAlt: "Close detail of deep green engineered quartz with fine ivory mineral veining" },
      { index: "04", name: "Guest Rooms",            href: "/spaces/hospitality/guest-rooms",        src: "/images/hospitality-guest-rooms.webp",              alt: "A hotel guest room with a taupe engineered marble headboard wall and floating bedside ledge",
        material: "Emperador Chiara",       materialSrc: "/images/material-v2-emperador-chiara.webp",              materialAlt: "Close detail of honed taupe engineered marble with fine cream veining" },
      { index: "05", name: "Bathroom",               href: "/spaces/hospitality/bathroom",           src: "/images/hospitality-bathroom.webp",                 alt: "A luxury hotel bathroom with bookmatched Calacatta-style engineered marble shower walls and vanity",
        material: "Calacatta Oro",          materialSrc: "/images/material-v2-calacatta-oro.webp",                 materialAlt: "Close detail of ivory engineered marble with disciplined grey and muted gold veins" },
      { index: "06", name: "Restaurant",             href: "/spaces/hospitality/restaurant",         src: "/images/hospitality-restaurant.webp",               alt: "A hotel restaurant centred on a curved burgundy engineered terrazzo bar and matching dining tables",
        material: "Rosso Levanto Terrazzo", materialSrc: "/images/material-v2-rosso-levanto-terrazzo.webp",               materialAlt: "Close detail of burgundy engineered terrazzo with cream, rose and charcoal aggregate" },
      { index: "07", name: "Wellness & Recreation",  href: "/spaces/hospitality/wellness-recreation", src: "/images/hospitality-wellness-recreation.webp",       alt: "A resort spa with a curved sage engineered-stone relaxation bench, wall cladding and pool coping",
        material: "Verde Aurora",            materialSrc: "/images/material-v2-verde-aurora.webp",       materialAlt: "Close detail of pale sage engineered stone with soft white crystalline movement" },
      { index: "08", name: "Outdoor & Landscape",    href: "/spaces/hospitality/outdoor-landscape",  src: "/images/hospitality-outdoor-landscape.webp",        alt: "A landscaped resort courtyard finished with large-format sand-coloured porcelain pavers and stepped planters",
        material: "Sandstone Porcelain",     materialSrc: "/images/material-v2-sandstone-porcelain.webp",        materialAlt: "Close detail of matte sand-coloured exterior porcelain with subtle limestone texture" },
      { index: "09", name: "Banquet & Events Space", href: "/spaces/hospitality/banquet-events-space", src: "/images/hospitality-banquet-events-space.webp",     alt: "A hotel banquet hall with black-veined engineered marble columns, buffet console and warm grey stone flooring",
        material: "Nero Marquina",           materialSrc: "/images/material-v2-nero-marquina.webp",     materialAlt: "Close detail of black engineered marble crossed by crisp organic white veins" },
    ],
    Healthcare: [
      { index: "01", name: "Entrance & Arrivals",            href: "/spaces/healthcare/entrance-arrivals",          src: "/images/healthcare-entrance-arrivals.webp",          alt: "An accessible healthcare entrance finished with large-format warm ivory porcelain facade panels and slip-resistant paving",
        material: "Ivory Limestone Porcelain", materialSrc: "/images/material-v2-ivory-limestone-porcelain.webp",          materialAlt: "Close detail of warm ivory porcelain with subtle blue-grey limestone movement" },
      { index: "02", name: "Reception & Waiting",            href: "/spaces/healthcare/reception-waiting",          src: "/images/healthcare-reception-waiting.webp",          alt: "A healthcare reception and waiting area centred on a curved pale mineral-blue engineered quartz desk and wall",
        material: "Aqua Mineral Quartz",       materialSrc: "/images/material-v2-aqua-mineral-quartz.webp",          materialAlt: "Close detail of pale mineral-blue engineered quartz with fine white and grey aggregate" },
      { index: "03", name: "Lobby & Corridors",              href: "/spaces/healthcare/lobby-corridors",            src: "/images/healthcare-lobby-corridors.webp",            alt: "A naturally lit healthcare corridor with warm-white engineered terrazzo flooring, coved skirting and wall protection",
        material: "Bianco Terrazzo",           materialSrc: "/images/material-v2-bianco-terrazzo.webp",            materialAlt: "Close detail of warm-white engineered terrazzo with small sage, charcoal and grey aggregate" },
      { index: "04", name: "Consultation & Admin Area",      href: "/spaces/healthcare/consultation-admin-area",     src: "/images/healthcare-consultation-admin-area.webp",     alt: "A healthcare consultation and administration area with dove-grey engineered quartz worktops, counter faces and backsplash",
        material: "Michelangelo Quartz",       materialSrc: "/images/material-v2-michelangelo-quartz.webp",     materialAlt: "Close detail of warm dove-grey engineered quartz with restrained cream mineral veining" },
      { index: "05", name: "Patient Rooms & Suites",         href: "/spaces/healthcare/patient-rooms-suites",        src: "/images/healthcare-patient-rooms-suites.webp",        alt: "A private patient suite with a warm ivory engineered marble headwall and matching bedside surfaces",
        material: "Crema Nova",                materialSrc: "/images/material-v3-crema-nova-patient-rooms.webp", materialAlt: "Close detail of smooth warm ivory engineered marble with sparse hairline beige veining matching the patient-room headwall" },
      { index: "06", name: "Wellness & Rehabilitation",      href: "/spaces/healthcare/wellness-rehabilitation",     src: "/images/healthcare-wellness-rehabilitation.webp",     alt: "A rehabilitation studio with pale sage porcelain wall cladding, non-slip terrazzo flooring and a sculpted therapy bench",
        material: "Verde Aurora Porcelain",    materialSrc: "/images/material-v2-verde-aurora-porcelain.webp",     materialAlt: "Close detail of pale sage healthcare porcelain with soft cloudy mineral texture" },
    ],
  },
  materialCta: "View Material",
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
