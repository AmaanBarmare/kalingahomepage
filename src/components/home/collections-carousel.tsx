"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { collections } from "@/lib/content";

const REST_SCALE_DESKTOP = 0.7569;
const REST_SCALE_MOBILE = 0.84;
const SHRINK_END = 0.7;
const REVEAL_SPAN = 0.3;

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

/**
 * One viewport of scroll belongs to each material. It first contracts from a
 * full-bleed plate, then yields to the next full-bleed plate. Because every
 * value is derived from page scroll, the sequence reverses exactly on scroll-up.
 */
function getSlidePose(stage: number, index: number, restScale: number): SlidePose {
  const local = stage - index;

  if (local <= -REVEAL_SPAN) {
    return { opacity: 0, scale: 1.018, y: 0 };
  }

  if (local < 0) {
    const reveal = smoothstep((local + REVEAL_SPAN) / REVEAL_SPAN);
    return {
      opacity: reveal,
      scale: 1.018 - 0.018 * reveal,
      y: 0,
    };
  }

  if (local <= SHRINK_END) {
    const shrink = smoothstep(local / SHRINK_END);
    return {
      opacity: 1,
      scale: 1 - (1 - restScale) * shrink,
      y: 0,
    };
  }

  // Keep the final Porcelain plate visible at its resting size as the sticky
  // scene releases into the next homepage section.
  if (index === collections.length - 1) {
    return { opacity: 1, scale: restScale, y: 0 };
  }

  if (local < 1) {
    const exit = smoothstep((local - SHRINK_END) / (1 - SHRINK_END));
    return {
      opacity: 1 - exit,
      scale: restScale,
      y: -2.4 * exit,
    };
  }

  return { opacity: 0, scale: restScale, y: -2.4 };
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

      // Accessibility follows the dominant visual, not merely the stage edge.
      const nextActive = Math.min(
        collections.length - 1,
        Math.max(0, Math.floor(stage + 0.14)),
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
                transform: index === 0 ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 0, 0) scale(1.018)",
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
