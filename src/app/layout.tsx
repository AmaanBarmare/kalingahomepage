import type { Metadata, Viewport } from "next";
import { halogen, neueHaas, neueHaasRound } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalinga Stone — Engineered Surfaces",
  description:
    "Quartz, natural marble, terrazzo and porcelain surfaces for residential, commercial, hospitality and healthcare spaces.",
  metadataBase: new URL("https://www.kalingastone.com"),
  openGraph: {
    title: "Kalinga Stone — Engineered Surfaces",
    description:
      "Quartz, natural marble, terrazzo and porcelain surfaces for residential, commercial, hospitality and healthcare spaces.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#14100e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning covers exactly one attribute: the pre-paint
    // script below stamps data-intro-seen on this element, so the server HTML
    // and the hydrating client necessarily disagree about it. React only
    // suppresses the warning one level deep, so this does not hide anything
    // else on the page.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${halogen.variable} ${neueHaas.variable} ${neueHaasRound.variable}`}
    >
      <head>
        {/* Runs BEFORE first paint. The intro overlay is server-rendered so a
            first-time visitor sees it in the very first frame; this stamps the
            root for anyone who has already seen it this tab (or asked for
            reduced motion) so the CSS below hides it before it can flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('ks-intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.introSeen='1'}}catch(e){}",
          }}
        />
        {/* Without JS the IntersectionObserver never fires, so the reveal's
            resting state has to be undone in the stylesheet — and nothing would
            ever dismiss the intro, so that has to go too. */}
        <noscript>
          <style>{`.ks-reveal{opacity:1!important;transform:none!important}#ks-intro{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
