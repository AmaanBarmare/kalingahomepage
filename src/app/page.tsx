import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { CollectionsCarousel } from "@/components/home/collections-carousel";
import { Applications } from "@/components/home/applications";
import { MaxGuard } from "@/components/home/maxguard";
import { Visualiser } from "@/components/home/visualiser";
import { Karigare } from "@/components/home/karigare";
import { Testimonials } from "@/components/home/testimonials";
import { ContactBand } from "@/components/home/contact-band";
import { SiteFooter } from "@/components/home/site-footer";

/**
 * Kalinga Stone homepage — Figma 544:3926, 1440 x 9849.
 *
 * Section order and the y each one starts at in the frame:
 *      0  Hero
 *   1071  Intro
 *   1715  Collections carousel   (Component 102)
 *   2986  Applications           (heading -> tabs -> progress rule -> card rail)
 *   4092  MaxGuard
 *   4894  Surface visualiser
 *   6136  Karigare               (Component 101)
 *   7273  Testimonials
 *   8519  Contact band
 *   9075  Footer
 *
 * The whole page sits on white. Figma's off-white token is used nowhere on this
 * frame — sampling the rendered bands returns #ffffff every time.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <CollectionsCarousel />
      <Applications />
      <MaxGuard />
      <Visualiser />
      <Karigare />
      <Testimonials />
      <ContactBand />
      <SiteFooter />
    </main>
  );
}
