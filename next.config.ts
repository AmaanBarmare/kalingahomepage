import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    // The page is almost entirely full-bleed photography, so the encode format
    // is the single biggest lever on its weight. Measured on the porcelain
    // slide (2157 x 1437, the heaviest plate): 476KB as WebP q90 against 224KB
    // as AVIF — 53% off, at a quality the two are hard to tell apart.
    //
    // Order matters: Next picks the first entry the browser's Accept header
    // allows, so AVIF goes to anything modern and WebP stays as the fallback.
    // Nothing is lost on an older browser, and no source asset changes.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
