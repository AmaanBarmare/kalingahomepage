"use client";

import { useEffect, useRef } from "react";

/**
 * A full-bleed background clip.
 *
 * Source order is WebM first: VP9 beat H.264 on both size and SSIM in the sweep
 * (see tools/optimize-video.mjs), so every browser that can take it should.
 *
 * Playback is driven from JS rather than the `autoplay` attribute, which buys
 * three things:
 *   - `prefers-reduced-motion` is honoured by simply never starting. A reader
 *     who asked for stillness gets the poster frame and no motion at all.
 *   - the clip pauses off-screen, so a 10s loop is not burning decode all the
 *     way down a 9800px page.
 *   - with no JS the poster stands in, which is the designed still frame
 *     anyway — the page is never broken, just static.
 *
 * `muted` + `playsInline` are both load-bearing: without them iOS Safari
 * refuses to autoplay and shows its own play control over the plate.
 */
export function BackgroundVideo({
  src,
  poster,
  alt,
  loop = false,
  preload = "metadata",
  className = "",
}: {
  /** basename in /public/videos, without extension */
  src: string;
  poster: string;
  alt: string;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // A one-shot clip that has already finished stays on its last frame
          // instead of restarting every time it scrolls back into view.
          if (!loop && el.ended) return;
          void el.play().catch(() => {
            /* autoplay can still be refused; the poster remains */
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loop]);

  return (
    <video
      ref={ref}
      poster={poster}
      loop={loop}
      muted
      playsInline
      preload={preload}
      aria-label={alt}
      className={className}
    >
      <source src={`/videos/${src}.webm`} type="video/webm" />
      <source src={`/videos/${src}.mp4`} type="video/mp4" />
    </video>
  );
}
