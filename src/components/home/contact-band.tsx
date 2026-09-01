import Image from "next/image";
import Link from "next/link";
import { KsButton } from "@/components/ui/ks-button";
import { Reveal } from "@/components/ui/reveal";
import { contact } from "@/lib/content";

/**
 * Contact band — Figma 544:4017 (plate), 544:4016 / 544:4020 (scrims),
 * 544:4021 / 544:4022 / 544:4023 (content).
 *
 * The plate is 1672 x 640 at x-114 y8519, so it bleeds 114px past both edges
 * and runs to 9159 — 84px *under* the footer, which starts at 9075 and is
 * opaque. The visible band is therefore 8519 -> 9075, i.e. 556 tall, and the
 * overhang is clipped rather than reproduced.
 *
 * Two stacked scrims (1430 x 495 at y8594 and 1443 x 411 at y8751) darken the
 * lower half; sampling the rendered frame down the right edge gives
 * rgb(114,96,80) at 8760 falling to rgb(0,0,0) by 9150, so they compose to a
 * plain vertical wash to black. Neutral black, not ink — a tinted scrim over
 * photography casts a visible colour cast.
 *
 * Content: headline x84 y8903, body x87 y8975 (698 wide), CTA x85 y9042. This
 * copy is real, not placeholder.
 */
export function ContactBand() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink" aria-labelledby="contact-heading">
      <div className="relative aspect-[1440/556] min-h-[420px] w-full">
        <Image
          src="/images/contact.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_42%]"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[86%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 46%, rgba(0,0,0,0.82) 78%, #000 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-[6%] px-6 lg:px-[84px]">
          <Reveal>
            <h2 id="contact-heading" className="heading text-white">
              {contact.headline}
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="body-copy mt-[9px] max-w-[698px] text-white">
              {contact.body.map((part) =>
                part.href ? (
                  <Link key={part.text} href={part.href} className="font-medium underline-offset-4 hover:underline">
                    {part.text}
                  </Link>
                ) : part.strong ? (
                  <strong key={part.text} className="font-medium">
                    {part.text}
                  </strong>
                ) : (
                  <span key={part.text}>{part.text}</span>
                ),
              )}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <KsButton href={contact.cta.href} variant="outline" className="mt-[19px]">
              {contact.cta.label}
            </KsButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
