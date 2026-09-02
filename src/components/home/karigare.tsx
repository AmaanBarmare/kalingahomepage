"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { KsButton } from "@/components/ui/ks-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { karigare } from "@/lib/content";

/**
 * Karigare — Figma 721:29303 (heading), 764:9494 (BASE column), 721:29349
 * (FORM column), 721:29347 (CTA).
 *
 * REBUILT. The board replaced the six-plate collage (Component 101, now deleted
 * from the file) with two columns — BASE and FORM — each a clipped window with
 * a label beneath it. Geometry, all of it Figma's:
 *
 *   heading  Group 266   x421   y6023   599 x 121.5
 *   BASE     Frame 507   x0     y6250   722 x 666
 *   FORM     Frame 621   x722   y6250   726 x 666
 *   BASE lbl Frame 518   x300   y6965   122 x 39
 *   FORM lbl Frame 554   x1024  y6965   122 x 39
 *   CTA      721:29347   x618.5 y7053   205.19 x 42.7
 *
 * FULL-BLEED. The board reworked this from a 1280-wide pair inset at x81 to two
 * columns running 0..722 and 722..1448 — edge to edge, no gutter, no content
 * container. The 1448 overruns the 1440 frame by 8px, which is Figma looseness
 * on a pair plainly meant to halve the frame, so it is 50/50 here.
 *
 * Both labels now CENTRE on their column rather than sitting at its left edge:
 * the label boxes centre on 361 and 1085, which are exactly the two column
 * centres. Gaps went 40/26 -> 49/49.
 *
 * THE TRACKS RUN VERTICALLY, WHICH THE BOARD DOES NOT SHOW. In Figma each
 * column is a horizontal strip of three slides (BASE's inner frame is 1923 =
 * 3 x 641 wide) — that is how a static comp draws a carousel, not a direction.
 * The behaviour is the client's existing split-scroll, ported from the hero of
 * github.com/AmaanBarmare/kalinga-two: the section is pinned and the two
 * columns travel in OPPOSITE directions as you scroll, left up and right down.
 *
 *   progress = -rect.top / (section.offsetHeight - innerHeight)   clamped 0..1
 *   distance = (frames - 1) * frameHeight
 *   left     translateY(-progress * distance)          0    -> -distance
 *   right    translateY((-1 + progress) * distance)    -distance ->  0
 *
 * Because the right track starts at -distance and ends at 0, the columns are
 * counter-indexed: at rest BASE shows frame 1 against FORM's frame 4. The two
 * sets are ordered so every pair that meets is deliberate — lobby/table,
 * carved wall/carved table, flat carving/fluted basin, relief/curved bath.
 *
 * The frame is fixed px rather than the reference's 100vh because Figma's is
 * 660 and near-square; `--frame-h` also takes a viewport ceiling so the whole
 * pinned composition (frames + labels + CTA) cannot outgrow a short window.
 * `distance` is measured off the live element, so it stays correct after any
 * resize without duplicating that arithmetic here.
 */

const COUNT = karigare.columns[0].frames.length;

export function Karigare() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      const win = windowRef.current;
      if (!section || !win) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const distance = (COUNT - 1) * win.offsetHeight;

      trackRefs.current.forEach((track, i) => {
        if (!track) return;
        // Column 0 runs up from 0; column 1 runs down from -distance. Any
        // further column would alternate with it.
        const y = i % 2 === 0 ? -progress * distance : (-1 + progress) * distance;
        track.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="bg-white pt-[171px]" aria-labelledby="karigare-heading">
      <SectionHeading title={karigare.headline} body={karigare.body} />

      <div ref={sectionRef} className="karigare-scroll">
        <div className="karigare-sticky">
          <div className="karigare-stage">
            <div id="karigare-columns" className="karigare-columns">
              {karigare.columns.map((column, ci) => (
                <div key={column.label} className="karigare-column">
                  <div
                    ref={ci === 0 ? windowRef : undefined}
                    className="karigare-window"
                    aria-label={`${column.label} — ${COUNT} images`}
                  >
                    <div
                      ref={(node) => {
                        trackRefs.current[ci] = node;
                      }}
                      className="karigare-track"
                      // The down-running column starts one full travel up, so
                      // its last frame is the one on screen at rest. Inline so
                      // the very first paint is already correct.
                      style={{
                        transform:
                          ci % 2 === 0
                            ? "translate3d(0, 0, 0)"
                            : `translate3d(0, calc(${-(COUNT - 1)} * var(--frame-h)), 0)`,
                      }}
                    >
                      {column.frames.map((frame) => (
                        <div key={frame.src} className="karigare-frame">
                          <Image
                            src={frame.src}
                            alt={frame.alt}
                            fill
                            sizes="50vw"
                            className="object-cover"
                            style={{ objectPosition: frame.position }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={column.href} className="karigare-label">
                    {column.label}
                  </Link>
                </div>
              ))}
            </div>

            <div className="karigare-cta">
              <KsButton href={karigare.cta.href} variant="outline-ruby">
                {karigare.cta.label}
              </KsButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
