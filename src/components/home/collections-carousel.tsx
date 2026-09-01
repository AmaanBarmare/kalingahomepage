"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { collections } from "@/lib/content";

const REST_SCALE_DESKTOP = 0.7569;
const REST_SCALE_MOBILE = 0.84;

/**
 * How much of a material's stage goes to contracting its own plate. The
 * remaining 0.55 is the next plate climbing the rest of the screen — 87.8% of
 * travel over 55svh of scroll, i.e. 1.6x the finger, which reads as a reveal
 * without outrunning it.
 */
const SHRINK_END = 0.45;

/**
 * Where the incoming plate passes the half-way line, solved from the curve
 * below: it crosses y = 50% at prev = 0.692, i.e. at its own local = -0.308.
 * That is the moment it becomes the dominant visual, so it is also the moment
 * the live region and the focusable Discover link hand over.
 */
const ACTIVE_LEAD = 0.31;

type SlidePose = {
  opacity: number;
  scale: number;
  y: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

/** Where a plate's bottom edge sits, as a percentage of the viewport. */
const bottomEdgeOf = (scale: number) => 50 + scale * 50;

/**
 * One viewport of scroll belongs to each material: its plate contracts from
 * full-bleed to its resting size, and the next plate rises from below the fold
 * to take the screen. Every value comes from page scroll, so the whole sequence
 * reverses exactly on the way back up.
 *
 * THE INCOMING PLATE IS WHAT THE SHRINK REVEALS. While the current plate is
 * contracting, the next one's top edge is pinned to the current one's BOTTOM
 * edge — so the white gap the shrink opens is never white, it is always filled
 * by the material coming next. That is the whole point: you can see it arriving
 * as the picture gets smaller, rather than having it appear afterwards.
 *
 *   prev 0 -> 0.45   current 1 -> 0.7569, incoming y 100% -> 87.845%
 *   prev 0.45 -> 1   incoming y 87.845% -> 0, covering as it goes
 *
 * The first pass cross-faded the incoming plate in at full size, so nothing
 * moved at all; the second ran the rise strictly AFTER the shrink, so the gap
 * stayed empty for the whole contraction.
 *
 * A plate more than a stage away sits at y = 100%, exactly one viewport down.
 * The sticky box clips it, so opacity is only there to keep it out of the
 * paint, and it flips while the plate is still fully below the fold.
 *
 * Outgoing plates hold their resting pose at opacity 1. They do not need to
 * fade: at rest, consecutive plates are the same size in the same place, so the
 * one on top occludes the one below exactly.
 */
function getSlidePose(stage: number, index: number, restScale: number): SlidePose {
  const local = stage - index;

  if (local <= -1) {
    return { opacity: 0, scale: 1, y: 100 };
  }

  if (local < 0) {
    // Driven by the plate in front of this one, across its stage.
    const prev = local + 1;

    if (prev <= SHRINK_END) {
      const shrink = smoothstep(prev / SHRINK_END);
      return { opacity: 1, scale: 1, y: bottomEdgeOf(1 - (1 - restScale) * shrink) };
    }

    const rise = smoothstep((prev - SHRINK_END) / (1 - SHRINK_END));
    return { opacity: 1, scale: 1, y: bottomEdgeOf(restScale) * (1 - rise) };
  }

  if (local <= SHRINK_END) {
    const shrink = smoothstep(local / SHRINK_END);
    return { opacity: 1, scale: 1 - (1 - restScale) * shrink, y: 0 };
  }

  return { opacity: 1, scale: restScale, y: 0 };
}

export function CollectionsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);

    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const render = () => {
      frameRef.current = null;
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      if (!section || !sticky) return;

      const scrollDistance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      const progress = clamp(-section.getBoundingClientRect().top / scrollDistance);
      const stage = progress * collections.length;
      const restScale = window.innerWidth < 640 ? REST_SCALE_MOBILE : REST_SCALE_DESKTOP;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const pose = getSlidePose(stage, index, restScale);
        slide.style.opacity = pose.opacity.toFixed(4);
        slide.style.transform = `translate3d(0, ${pose.y.toFixed(3)}%, 0) scale(${pose.scale.toFixed(5)})`;
      });

      // Accessibility follows the dominant visual, not the stage edge.
      const nextActive = Math.min(
        collections.length - 1,
        Math.max(0, Math.floor(stage + ACTIVE_LEAD)),
      );
      setActive((current) => (current === nextActive ? current : nextActive));
    };

    const requestRender = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Collections"
      className="collection-scroll-section"
      style={{ height: `${(collections.length + 1) * 100}svh` }}
    >
      <div ref={stickyRef} className="collection-scroll-sticky">
        {collections.map((collection, index) => {
          const isActive = index === active;

          return (
            <article
              key={collection.title}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              aria-hidden={reducedMotion ? false : !isActive}
              aria-label={`${index + 1} of ${collections.length}: ${collection.title}`}
              className="collection-scroll-slide"
              style={{
                opacity: index === 0 ? 1 : 0,
                transform: index === 0 ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 100%, 0) scale(1)",
                zIndex: index + 1,
              }}
            >
              <Image
                src={collection.image}
                alt={`${collection.title} surface installation`}
                fill
                sizes="100vw"
                quality={90}
                className="object-cover"
              />

              <div className="collection-scroll-scrim" />

              <div className="collection-scroll-content">
                <h2 className="collection-scroll-title">{collection.title}</h2>
                <p className="collection-scroll-copy">{collection.body}</p>
                <p className="collection-scroll-surfaces">{collection.surfaces}</p>
                <Link
                  href={collection.href}
                  tabIndex={reducedMotion || isActive ? undefined : -1}
                  className="collection-scroll-link"
                >
                  Discover
                </Link>
              </div>
            </article>
          );
        })}

        <p className="sr-only" aria-live="polite">
          Showing {collections[active].title}
        </p>
      </div>
    </section>
  );
}
