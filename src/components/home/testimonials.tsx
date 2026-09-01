"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { KalingaMark } from "@/components/ui/kalinga-mark";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TabBar } from "@/components/ui/tab-bar";
import { testimonials } from "@/lib/content";

/**
 * Testimonials — Figma 544:3970 (heading), 544:4001 (audience tabs),
 * Groups 196/197/199 (cards), 551:5497 (closing mark).
 *
 * Card origins: 82 / 432.16 / 780.66 / 1130.54 -> deltas 350.16, 348.5, 349.88.
 * A 321-wide card on a 349.5 pitch (28.5 gutter). The fourth runs to 1451.5 and
 * is clipped by the 1440 frame, which is the tell that this is a rail and not a
 * three-up grid.
 *
 * Caption: a 28 x 1 ruby rule vertically centred on the label, 10px before the
 * text. Figma's per-card rule widths (23.18 vs 28.39) and caption offsets
 * (8162.42 vs 8173.58) are hand-placed; the text tops land within 2.4px of each
 * other, so one uniform value is correct and the variance is noise.
 *
 * This is a real scroll container, so touch already has native panning with
 * momentum — driving scrollLeft from pointermove on top of that would double
 * every swipe. Drag is wired for MOUSE ONLY.
 *
 * THE PLAY MARK IS BAKED INTO THE POSTERS at inconsistent sizes. A uniform,
 * opaque-backed control is drawn over every baked mark so all four cards expose
 * the same 120px desktop / 100px mobile target without editing the portraits.
 *
 * There is a "Scrim" vector (544:3976) at x865 y7214 covering only the top
 * third of the cards. It does not appear in the rendered frame and no plausible
 * edge-fade has that geometry, so it is treated as a stray layer and omitted.
 */
export function Testimonials() {
  const [audience, setAudience] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !rail.current) return;
    drag.current = { x: e.clientX, left: rail.current.scrollLeft };
    setDragging(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !rail.current) return;
    rail.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  }
  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  return (
    <section className="bg-white pt-[127px] pb-[155px]" aria-labelledby="testimonials-heading">
      <SectionHeading title={testimonials.headline} body={testimonials.body} />

      <Reveal delay={160}>
        <TabBar
          className="mt-[41px]"
          label="Audience"
          items={testimonials.audiences}
          active={audience}
          onSelect={setAudience}
          tone="ink"
        />
      </Reveal>

      <div
        id="testimonial-rail"
        ref={rail}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={`mt-[87px] flex gap-[28.5px] overflow-x-auto px-6 pb-2 [scrollbar-width:none] touch-pan-y lg:px-[82px] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {testimonials.cards.map((card, i) => (
          <Reveal key={`${card.role}-${i}`} delay={i * 90} className="shrink-0">
            <figure className="w-[260px] lg:w-[321px]">
              <div className="relative aspect-[321/607.6] w-full overflow-hidden bg-ink">
                <Image
                  src={card.image}
                  alt={`${card.role}, ${card.place}`}
                  fill
                  sizes="(max-width: 1024px) 260px, 321px"
                  draggable={false}
                  className="object-cover"
                />
                <button
                  type="button"
                  disabled={!card.videoHref}
                  aria-label={`Play testimonial — ${card.role}, ${card.place}`}
                  className="absolute top-1/2 left-1/2 z-10 flex size-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-ink/85 text-white shadow-[0_4px_20px_rgba(20,16,14,0.24)] backdrop-blur-[3px] transition-colors duration-300 hover:bg-ink/75 disabled:cursor-default lg:size-[120px]"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 40 48"
                    className="ml-1 h-[42px] w-[36px] lg:h-[48px] lg:w-[40px]"
                  >
                    <path d="M4 3.5L37 24 4 44.5V3.5Z" fill="currentColor" />
                  </svg>
                </button>
              </div>

              <figcaption className="mt-[10px] flex items-center">
                <span aria-hidden className="h-px w-[28px] shrink-0 bg-ruby" />
                <span className="ml-[10px] font-body text-[13px] tracking-[1.5px] text-ruby uppercase">
                  {card.role} · {card.place}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <KalingaMark className="mx-auto mt-[135px] h-[28.577px] w-[28px] text-ruby" />
      </Reveal>
    </section>
  );
}
