"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { TabBar } from "@/components/ui/tab-bar";
import { Reveal } from "@/components/ui/reveal";
import { applications } from "@/lib/content";

/**
 * Applications — Figma 544:3945 (heading), 544:3931 (sectors), 544:3948
 * ("progress"), 544:3950 (strip).
 *
 * The strip is a carousel, and the numbers only reconcile that way:
 *
 *   SP/Kitchen      x0    y10   460 x 600
 *   SP/Bathroom     x484  y-15  498 x 650   <- active
 *   SP/Living Room  x1006 y10   460 x 600
 *
 *   gaps: 484-460 = 24 and 1006-(484+498) = 24        -> one 24px gutter
 *   scale: 498/460 = 1.0826, 650/600 = 1.0833         -> one uniform scale
 *   centring: 600*1.0833 = 650, half the 50 growth is 25, and 10-25 = -15
 *                                                     -> exact, to the pixel
 *
 * The active card also moves its label from the bottom (512/534) to the top
 * (30/52) and gains the material swatch at (287,521) 191x107. Content runs to
 * 1466 inside a 1250 frame, so the rail scrolls; the strip's rawImages carry
 * four scenes, not the three the frame draws.
 *
 * ACTIVE CARD PUSHES, IT DOES NOT SCALE. A transform-scale about the centre
 * would put the active card at 465..963; Figma has it at 484..982 with the next
 * card displaced by exactly the 38px of growth. So the width/height are
 * animated and the flex row reflows — which is why the rail is a flex track
 * rather than a transformed strip.
 *
 * The "progress" rule: measured ruby fill runs x560..1058 (499 wide) against a
 * #e4dfd8 track at x80 w1280. The active card's page box is 566..1064 (498
 * wide) — a 1:1 mirror to within 6px. Despite the layer name it marks the focus
 * slot rather than reporting progress, and because the rail recentres the
 * active card into that slot it is stationary. Kept as drawn; see DESIGN.md.
 */

const CARD_W = 460;
const CARD_H = 600;
const ACTIVE_W = 498;
const ACTIVE_H = 650;
const GAP = 24;
const PITCH = CARD_W + GAP; // 484
const RAIL_W = 1250;
const GLIDE = 780;

const CARDS = applications.cards;
const N = CARDS.length;
// Three copies so the reel always has a neighbour on both sides.
const REEL = [...CARDS, ...CARDS, ...CARDS];

export function Applications() {
  const [sector, setSector] = useState(0);
  const [index, setIndex] = useState(N + 1); // middle copy, Figma's resting state
  const [jumping, setJumping] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((delta: number) => setIndex((i) => i + delta), []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = window.setInterval(() => go(1), 5000);
    return () => window.clearInterval(t);
  }, [paused, go]);

  /**
   * Rebase to the middle copy once the glide has finished, with the transition
   * suppressed. This is driven from state rather than by poking
   * `track.style.transition`, because React re-applies the style prop on the
   * next render and clearing it imperatively loses it permanently.
   */
  useEffect(() => {
    if (index >= N && index < N * 2) return;
    const t = window.setTimeout(() => {
      setJumping(true);
      setIndex((i) => (i < N ? i + N : i - N));
    }, GLIDE);
    return () => window.clearTimeout(t);
  }, [index]);

  useEffect(() => {
    if (!jumping) return;
    // Two frames: one to commit the untransitioned transform, one to re-arm.
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setJumping(false)));
    return () => cancelAnimationFrame(r);
  }, [jumping]);

  // Card `index` starts at index*PITCH (every card before the active one is at
  // its base width), and we want it to land on the focus slot at x484.
  const trackX = PITCH - index * PITCH;
  // The suppressed transition has to cover the CARDS too, not just the track:
  // the rebase changes which element is active, so a card keeping its own
  // transition would visibly shrink while its twin grew.
  const glide = jumping ? "none" : `transform ${GLIDE}ms var(--ease-glide)`;
  const cardGlide = jumping ? "none" : `width ${GLIDE}ms var(--ease-glide), height ${GLIDE}ms var(--ease-glide)`;

  return (
    <section className="bg-white pt-[147px] pb-[183px]" aria-labelledby="applications-heading">
      <SectionHeading title={applications.headline} body={applications.body} />

      <Reveal delay={160}>
        <TabBar
          className="mt-[35px]"
          label="Project sectors"
          items={applications.sectors}
          active={sector}
          onSelect={setSector}
          tone="ruby"
        />
      </Reveal>

      {/* 544:3948 — 1280 x 2 at x80, track line/soft with a ruby focus marker. */}
      <div id="progress-rule" className="mx-auto mt-[55px] hidden h-[2px] w-full max-w-[1440px] px-[80px] lg:block">
        <div className="relative h-full w-full bg-line-soft">
          <span
            aria-hidden
            className="absolute inset-y-0 bg-ruby transition-[left,width] duration-500 ease-[var(--ease-glide)]"
            style={{ left: `${(486 / 1280) * 100}%`, width: `${(ACTIVE_W / 1280) * 100}%` }}
          />
        </div>
      </div>

      {/* Horizontal overflow is clipped at 1250; the active card's extra 25px
          above and below is NOT — in Figma it renders outside the strip bounds
          (3256..3904 against a 3274..3894 frame). Padding the clip box by 25 and
          pulling it back reproduces that without an impossible overflow-x-only. */}
      <div
        className="mx-auto mt-[27px] w-full max-w-[1440px] overflow-hidden px-6 lg:px-[82px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="-my-[25px] overflow-x-hidden py-[25px]"
          style={{ maxWidth: RAIL_W }}
          aria-roledescription="carousel"
          aria-label="Applications"
        >
          <div
            className="flex items-center will-change-transform"
            style={{ gap: GAP, transform: `translate3d(${trackX}px,0,0)`, transition: glide }}
          >
            {REEL.map((card, i) => {
              const isActive = i === index;
              return (
                <article
                  key={`${card.title}-${i}`}
                  aria-hidden={!isActive}
                  className="relative shrink-0 overflow-hidden bg-placeholder"
                  style={{
                    width: isActive ? ACTIVE_W : CARD_W,
                    height: isActive ? ACTIVE_H : CARD_H,
                    transition: cardGlide,
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 1024px) 80vw, 498px"
                    className="object-cover"
                  />

                  {/* 551:5476 — 198.185deg, clear -> rgba(7,6,5,.5) -> #14100e.
                      Sits 449 down a 600 card, i.e. the bottom quarter. */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[25.2%]"
                    style={{
                      backgroundImage:
                        "linear-gradient(198.185deg, rgba(0,0,0,0) 50.817%, rgba(7,6,5,0.5) 67.361%, rgb(20,16,14) 97.235%)",
                    }}
                  />
                  {/* The active card's label moves to the top, where there is no
                      scrim, so it needs its own. */}
                  {isActive ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
                      style={{ backgroundImage: "linear-gradient(to bottom, rgba(7,6,5,0.45), rgba(0,0,0,0))" }}
                    />
                  ) : null}

                  <div
                    className="absolute left-[28px] text-white transition-[top] duration-500 ease-[var(--ease-glide)]"
                    style={{ top: isActive ? 30 : 512 }}
                  >
                    <p className="font-display text-[12px] font-normal">{card.index}</p>
                    <p className="mt-[10px] font-display text-[20px] leading-[1.58] font-normal tracking-[1px]">
                      {card.title}
                    </p>
                  </div>

                  {/* image 4 (551:5306) — 191 x 107 at (287,521), active card only. */}
                  {isActive ? (
                    <div className="absolute right-[20px] bottom-[22px] h-[107px] w-[191px] overflow-hidden">
                      <Image
                        src={applications.swatch.image}
                        alt=""
                        fill
                        sizes="191px"
                        className="object-cover"
                      />
                      <span className="absolute right-[8px] bottom-[6px] font-body text-[9px] tracking-[0.6px] text-ink/80 uppercase">
                        {applications.swatch.label}
                      </span>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sr-only">
        <button type="button" onClick={() => go(-1)}>
          Previous application
        </button>
        <button type="button" onClick={() => go(1)}>
          Next application
        </button>
      </div>
    </section>
  );
}
