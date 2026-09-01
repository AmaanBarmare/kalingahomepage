import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { karigare } from "@/lib/content";

/**
 * Karigare — Figma 544:3973 (heading) and Component 101 (544:4013).
 *
 * Six plates absolutely placed on a 1420 x 860 frame at x60, every one of them
 * ~430 x 242 (16:9). Positions and z-order are Figma's own child order, which
 * is why they are listed back-to-front here: `inlay` sits underneath everything
 * and only shows as a sliver on the left, and `form1` (the travertine bench)
 * sits on top. Sorting these by position would break the overlaps.
 *
 * Heading block ends 6257.5; the collage starts 6286, so the gap is 28.5.
 */

const PLATES = [
  { src: "/images/karigare-1.webp", left: 212, top: 359, w: 430, h: 242, drift: 26 },
  { src: "/images/karigare-2.webp", left: 88, top: 431, w: 431.77, h: 243, drift: 14 },
  { src: "/images/karigare-3.webp", left: 699, top: 164, w: 431, h: 243, drift: 30 },
  { src: "/images/karigare-4.webp", left: 567, top: 454, w: 430, h: 242, drift: 10 },
  { src: "/images/karigare-5.webp", left: 414, top: 333, w: 430, h: 242, drift: 20 },
  { src: "/images/karigare-6.webp", left: 247, top: 164, w: 431, h: 242, drift: 34 },
];

const FRAME_W = 1420;
const FRAME_H = 860;
const pct = (n: number, of: number) => `${(n / of) * 100}%`;

export function Karigare() {
  return (
    <section className="bg-white pt-[166px] pb-[0px]" aria-labelledby="karigare-heading">
      <SectionHeading title={karigare.headline} body={karigare.body} />

      <div className="mx-auto mt-[30px] w-full max-w-[1440px] overflow-hidden px-6 lg:px-0">
        <div
          id="karigare-collage"
          className="relative aspect-[1420/860] w-full lg:ml-[60px] lg:w-[1420px]"
        >
          {PLATES.map((p, i) => (
            <div
              key={p.src}
              className="absolute"
              style={{
                left: pct(p.left, FRAME_W),
                top: pct(p.top, FRAME_H),
                width: pct(p.w, FRAME_W),
                height: pct(p.h, FRAME_H),
                zIndex: i + 1,
              }}
            >
              <Reveal delay={i * 90} className="h-full w-full">
                <div
                  className="ks-parallax h-full w-full"
                  style={{ "--drift": `${p.drift}px` } as React.CSSProperties}
                >
                  <div className="relative h-full w-full overflow-hidden bg-placeholder">
                    <Image
                      src={p.src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 40vw, 431px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
