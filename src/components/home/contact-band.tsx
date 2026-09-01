import Image from "next/image";
import { ChevronDownIcon } from "@/components/ui/nav-icons";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { contact } from "@/lib/content";

/**
 * Contact band — Figma 544:4017 / 544:4018 (plate), 544:4016 + 544:4020
 * (scrims), 544:4021 / 544:4022 / 544:4023 + 695:2576 (content).
 *
 * REBUILT. The plate is no longer the 1672-wide bleed it was: 544:4018 is
 * 1440 x 640 at x0 y8519, exactly the frame width, so nothing hangs off the
 * sides and the band is a plain 9:4 box.
 *
 * It does still hang off the BOTTOM. The band runs to 9159 while the footer
 * frame starts at 9075, and the band is drawn over it — sampling the rendered
 * board down a clean column shows the photograph still present at 9075 and only
 * reaching pure black at 9159. So the band is the full 640 here and the footer
 * gives back the 84px overlap out of its own top padding; the page total is
 * unchanged at 1330 from 8519.
 *
 * THE SCRIM is one wash, solved rather than eyeballed. Figma stacks two rects
 * (1430 x 495 at y8594, 1443 x 411 at y8751); dividing the rendered board by
 * the untouched source gives the alpha per row directly, and the quartiles land
 * within 0.02 of the median so the solve is clean:
 *
 *   y   0 -> 364   a = 0
 *   y 364 -> 410   a = 0    -> 0.68   (steep)
 *   y 410 -> 635   a = 0.68 -> 1      (slope 0.00143/px, dead straight)
 *
 * i.e. 56.9% / 64.1% / 99.2% of 640. Neutral black, not ink — a tinted scrim
 * over photography casts a visible colour wash.
 *
 * Content bottom-aligns on the button's base at y9088.7, which is 70.3px up
 * from 9159 = 10.98%. Headline x84 y8903, body x87 y8975 (698 wide), button
 * x87 y9046 (210 x 42.7). The 84/87 split is Figma being loose; one gutter.
 */
export function ContactBand() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-black" aria-labelledby="contact-heading">
      <div className="relative aspect-9/4 min-h-120 w-full">
        <Image src="/images/contact.webp" alt="" fill sizes="100vw" className="object-cover" />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 56.9%, rgba(0,0,0,0.68) 64.1%, #000 99.2%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-[10.98%] px-6 lg:px-21">
          <Reveal>
            <h2 id="contact-heading" className="heading text-white">
              {contact.headline}
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="body-copy mt-2.25 max-w-174.5 text-white">{contact.body}</p>
          </Reveal>

          <Reveal delay={200}>
            <KsButton
              href={contact.cta.href}
              variant="outline"
              className="mt-5.75"
              trailing={<ChevronDownIcon className="h-[6.06px] w-[11.67px] shrink-0" />}
            >
              {contact.cta.label}
            </KsButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
