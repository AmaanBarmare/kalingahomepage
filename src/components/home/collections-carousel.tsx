"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { collections } from "@/lib/content";

/**
 * Collections — Component 102 (544:4012), a VERTICAL carousel.
 *
 * Figma draws one slide and parks the other three below the clip boundary, so
 * the frame reads as a single static plate. It is not. Three things only
 * reconcile under the carousel reading:
 *
 *  1. The instance is 1124 tall but its first slide is 1022.636 — leaving a
 *     73px band at the bottom.
 *  2. Slide 2 sits at top 1050.85, left 177.06, width 1102.886. Projected into
 *     page space that is x168.6 y2765.9 w1102.9 — which is exactly the beige
 *     sliver visible under the Quartz slide in the rendered frame. It is the
 *     next slide peeking, not a decorative band.
 *  3. 1102.886 / 1457 = 0.7569, and every type size on the parked slides is the
 *     active slide's size times that same 0.7569 (45.603 -> 34.519,
 *     18.241 -> 13.808). They are one slide at two scales, not four designs.
 *
 * So the whole slide scales as a unit. Everything below is sized in `cqw`
 * against the frame, which makes the scale a single transform rather than a
 * table of per-breakpoint numbers, and keeps the peek proportional at any width.
 *
 * Type + box, from the full-size slide (260:2474):
 *   title    Halogen Regular 45.603 / 1.58 / +6.8404 uppercase
 *   body     Haas 45 Light   18.241 / 1.5  / +1.1401, block 588.272 wide
 *   surfaces Haas 55 Roman   15.961 / 1.5  / +1.1401 uppercase
 *   block    left 44.46, top 693.16, column gap 25.081
 *   button   232.57 below the block top, px 28.038 py 16.355, text 15.01
 *   scrim    top 645.28 h 377.361, 195.8deg, clear -> rgba(7,6,5,.5) -> #14100e
 */

const SCALE = 0.7569; // 1102.886 / 1457
const PEEK_Y = 102.76; // 1050.85 / 1022.636, as a % of the slide's own height
const PEEK_X = 12.15; // 177.06 / 1457
const ADVANCE_MS = 6000;

function slideTransform(offset: number) {
  if (offset === 0) return { transform: "translate3d(0,0,0) scale(1)", opacity: 1, zIndex: 2 };
  if (offset === 1)
    return {
      transform: `translate3d(${PEEK_X}%, ${PEEK_Y}%, 0) scale(${SCALE})`,
      opacity: 1,
      zIndex: 1,
    };
  // Outgoing slide leaves the way the incoming one arrived, mirrored.
  return {
    transform: `translate3d(${PEEK_X}%, -${PEEK_Y}%, 0) scale(${SCALE})`,
    opacity: 0,
    zIndex: 0,
  };
}

export function CollectionsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const advance = useCallback(() => setActive((i) => (i + 1) % collections.length), []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = window.setInterval(advance, ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [paused, advance]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Collections"
      className="relative w-full overflow-hidden bg-white [container-type:inline-size]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* The instance is 1457 x 1124 at x-8.5 — a hair wider than the frame, so
          it bleeds both edges. */}
      <div className="relative aspect-[1440/1124] w-full">
        {collections.map((c, i) => {
          const n = collections.length;
          // Nearest-wrap offset so the reel never rewinds through the middle.
          let offset = (i - active + n) % n;
          if (offset > 1) offset = -1;
          const s = slideTransform(offset);
          const isActive = offset === 0;

          return (
            <article
              key={c.title}
              aria-hidden={!isActive}
              aria-label={`${i + 1} of ${n}: ${c.title}`}
              className="absolute inset-x-0 top-0 h-[90.98%] origin-top-left overflow-hidden bg-white"
              style={{
                ...s,
                transition: "transform 1100ms var(--ease-glide), opacity 700ms linear",
              }}
            >
              <Image
                src={c.image}
                alt={`${c.title} surfaces`}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />

              {/* 260:2476 — 195.8deg, clear to #14100e. Figma's own stops. */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[36.9%]"
                style={{
                  backgroundImage:
                    "linear-gradient(195.8deg, rgba(0,0,0,0) 50.817%, rgba(7,6,5,0.5) 67.361%, rgb(20,16,14) 97.235%)",
                }}
              />

              <div
                className="absolute flex flex-col text-white"
                style={{
                  left: "3.051cqw",
                  top: "47.58cqw",
                  width: "40.376cqw",
                  gap: "1.7214cqw",
                }}
              >
                <h3
                  className="font-display font-normal uppercase"
                  style={{
                    fontSize: "max(20px, 3.13cqw)",
                    lineHeight: 1.58,
                    letterSpacing: "0.4695cqw",
                  }}
                >
                  {c.title}
                </h3>
                <p
                  className="font-body font-light"
                  style={{
                    fontSize: "max(12px, 1.252cqw)",
                    lineHeight: 1.5,
                    letterSpacing: "0.0782cqw",
                  }}
                >
                  {c.body}
                </p>
                <p
                  className="font-body font-normal uppercase"
                  style={{
                    fontSize: "max(11px, 1.0954cqw)",
                    lineHeight: 1.5,
                    letterSpacing: "0.0782cqw",
                  }}
                >
                  {c.surfaces}
                </p>
                <Link
                  href={c.href}
                  tabIndex={isActive ? undefined : -1}
                  className="mt-[0.6cqw] inline-flex w-fit items-center justify-center border border-white uppercase whitespace-nowrap text-white transition-colors duration-300 hover:bg-white hover:text-ink"
                  style={{
                    paddingInline: "1.924cqw",
                    paddingBlock: "1.1225cqw",
                    fontSize: "max(9px, 1.0302cqw)",
                    letterSpacing: "0.0802cqw",
                  }}
                >
                  Discover
                </Link>
              </div>
            </article>
          );
        })}

        {/* The peeking slide IS the affordance in this design — there are no
            arrows or dots in the frame. Making it the control keeps that true
            while still giving keyboard and screen-reader users a way through. */}
        <button
          type="button"
          onClick={advance}
          className="absolute inset-x-[12.15%] bottom-0 z-10 h-[6.5%] cursor-pointer focus-visible:outline-2"
        >
          <span className="sr-only">
            Next collection — {collections[(active + 1) % collections.length].title}
          </span>
        </button>
      </div>
    </section>
  );
}
