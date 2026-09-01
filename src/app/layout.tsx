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
    <html lang="en" className={`${halogen.variable} ${neueHaas.variable} ${neueHaasRound.variable}`}>
      <head>
        {/* Without JS the IntersectionObserver never fires, so the reveal's
            resting state has to be undone in the stylesheet. */}
        <noscript>
          <style>{`.ks-reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
