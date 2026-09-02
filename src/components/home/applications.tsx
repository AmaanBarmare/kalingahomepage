"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { KsButton } from "@/components/ui/ks-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { TabBar } from "@/components/ui/tab-bar";
import { Reveal } from "@/components/ui/reveal";
import { applications } from "@/lib/content";

type Sector = keyof typeof applications.spacesBySector;

/**
 * Browse by Space, presented inside the homepage's existing Applications
 * section layout.
 *
 * The imagery, order and interaction are ported from the reference repository:
 * cards form a native horizontal rail; mouse users can drag it; touch keeps
 * native momentum; and hover/focus grows one card, lifts its caption and
 * reveals that room's material preview. The progress rule mirrors the actual
 * scrollable proportion instead of acting as a stationary focus marker.
 */
export function Applications() {
  const [sectorIndex, setSectorIndex] = useState(0);
  const activeSector = applications.sectors[sectorIndex] as Sector;
  const spaces = applications.spacesBySector[activeSector];
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const syncProgress = useCallback(() => {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    const travel = Math.max(1, scrollWidth - clientWidth);
    const fill = Math.min(1, clientWidth / scrollWidth);

    bar.style.width = `${fill * 100}%`;
    bar.style.transform = `translate3d(${(scrollLeft / travel) * ((1 - fill) / fill) * 100}%, 0, 0)`;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncProgress();
    track.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("resize", syncProgress);

    return () => {
      track.removeEventListener("scroll", syncProgress);
      window.removeEventListener("resize", syncProgress);
    };
  }, [syncProgress]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollLeft = 0;
    const frame = requestAnimationFrame(syncProgress);
    return () => cancelAnimationFrame(frame);
  }, [activeSector, syncProgress]);

  const startDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || event.button !== 0) return;

    drag.current = {
      down: true,
      startX: event.pageX,
      startScroll: track.scrollLeft,
      moved: false,
    };
    track.classList.add("is-dragging");
  };

  const moveDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.down) return;

    const distance = event.pageX - drag.current.startX;
    if (Math.abs(distance) > 4) drag.current.moved = true;
    track.scrollLeft = drag.current.startScroll - distance;
    syncProgress();
  };

  const endDrag = () => {
    drag.current.down = false;
    trackRef.current?.classList.remove("is-dragging");

    // Keep `moved` true through the click synthesized after mouseup so a drag
    // never navigates, then release it for the user's next intentional click.
    if (drag.current.moved) {
      window.setTimeout(() => {
        if (!drag.current.down) drag.current.moved = false;
      }, 0);
    }
  };

  return (
    <section
      className="overflow-hidden bg-white pt-[76px] pb-[52px] lg:pt-[147px] lg:pb-[67.3px]"
      aria-label="Browse by Space"
    >
      <SectionHeading title={applications.headline} body={applications.body} />

      <Reveal delay={160}>
        <TabBar
          className="mt-[29.3px]"
          label="Project sectors"
          items={applications.sectors}
          active={sectorIndex}
          onSelect={setSectorIndex}
          tone="ruby"
        />
      </Reveal>

      <div
        id="progress-rule"
        className="mx-auto mt-[61px] hidden h-[2px] w-full max-w-[1440px] px-[80px] lg:block"
        aria-hidden
      >
        <div className="h-full w-full overflow-hidden bg-line-soft">
          <span ref={barRef} className="block h-full w-0 bg-ruby will-change-transform" />
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${activeSector} spaces`}
        className="space-track mx-auto mt-[26px] lg:mt-[31.3px] w-full max-w-[1440px] px-6 scroll-px-6 lg:px-[82px] lg:scroll-px-[82px]"
        onMouseDown={startDrag}
        onMouseMove={moveDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {spaces.map((space) => (
          <article
            key={`${activeSector}-${space.name}`}
            className="space-card"
            aria-label={space.name}
          >
            <span aria-hidden className="space-image">
              <Image
                src={space.src}
                alt=""
                fill
                sizes="(max-width: 1023px) 78vw, 498px"
                className="object-cover"
              />
            </span>

            <Link
              href={space.href}
              className="space-cover-link"
              onClick={(event) => {
                if (drag.current.moved) event.preventDefault();
              }}
              draggable={false}
            >
              <span className="sr-only">Explore {space.name}</span>
            </Link>

            <div className="cap">
              <div className="t">{space.name}</div>
            </div>

            <Link
              href="/collections"
              className="space-material-card"
              aria-label={`View ${space.material}`}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                if (drag.current.moved) event.preventDefault();
              }}
            >
              <span aria-hidden className="space-material-image">
                <Image
                  src={space.materialSrc}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 160px, 277px"
                  className="object-cover"
                />
              </span>
              <span className="space-material-link">
                {applications.materialCta} <span aria-hidden>→</span>
              </span>
            </Link>
          </article>
        ))}
      </div>

      {/* 721:29308 — "View All", ruby, centred on 720, y3980: 96px below the
          cards' base. It was missing entirely. */}
      <Reveal delay={160} className="mt-[44px] flex justify-center lg:mt-[68.5px]">
        <KsButton href={applications.cta.href} variant="ruby">
          {applications.cta.label}
        </KsButton>
      </Reveal>
    </section>
  );
}
