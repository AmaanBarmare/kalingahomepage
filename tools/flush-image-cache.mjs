/**
 * Flush Next's optimized-image cache.
 *
 * WHY THIS EXISTS. Next's image optimizer keys its cache on the REQUEST URL and
 * nothing else — `getCacheKey` in next/dist/server/image-optimizer.js hashes
 * [CACHE_VERSION, href, width, quality, mimeType], with no mtime and no content
 * hash. Replace the bytes behind a path and every one of those stays identical,
 * so the optimizer keeps serving what it encoded the first time. Its own docs
 * say it outright: "There is no mechanism to invalidate the cache at this time".
 *
 * Next 16 made that bite. `images.minimumCacheTTL` went from 60 SECONDS to
 * 4 HOURS (see docs/01-app/02-guides/upgrading/version-16.md), so a stale entry
 * that used to clear itself inside a minute now sits there for half a day. On 15
 * and earlier this was invisible.
 *
 * THE DIRECTORY IS THE TRAP. The docs say to delete `<distDir>/cache/images`,
 * i.e. .next/cache/images. That is the PRODUCTION path. `next dev` writes to
 * .next/dev/cache/images, which is a different directory, is not what anyone
 * reads in the docs, and SURVIVES A DEV SERVER RESTART. Clearing the documented
 * one in development does nothing at all, which is what makes this feel like the
 * change simply did not happen.
 *
 * Both are cleared here so it works whichever mode wrote them. This runs
 * automatically at the end of the asset pipeline; `npm run images:flush` is the
 * manual door for when an image is replaced by hand.
 *
 * The browser is NOT part of this. In dev the optimizer already sends
 * `Cache-Control: public, max-age=0, must-revalidate`, so it re-asks every time
 * — verified. A hard refresh was never what fixed this; it was the delay.
 */
import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DIRS = [
  path.resolve(".next/dev/cache/images"), // next dev  — the one that matters
  path.resolve(".next/cache/images"),     // next build/start
];

export async function flushImageCache({ quiet = false } = {}) {
  const cleared = [];
  for (const dir of DIRS) {
    if (!existsSync(dir)) continue;
    await rm(dir, { recursive: true, force: true });
    cleared.push(path.relative(process.cwd(), dir));
  }
  if (!quiet) {
    console.log(
      cleared.length
        ? `flushed optimized-image cache: ${cleared.join(", ")}`
        : "optimized-image cache already empty",
    );
  }
  return cleared;
}

// `node tools/flush-image-cache.mjs` runs it; importing it does not.
if (import.meta.url === `file://${process.argv[1]}`)
  await flushImageCache({ quiet: process.argv.includes("--quiet") });
