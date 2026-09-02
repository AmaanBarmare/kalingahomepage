import { KalingaLogo } from "@/components/ui/kalinga-logo";

/**
 * Menu bar — Figma 615:2395, an instance of 601:15975 "Property 1=Variant6".
 *
 * A 95px bar carrying one thing: a translucent plate with the ruby lockup in
 * it, centred. This is the bar that floats over the intro clip; the page's own
 * navbar after the intro is the solid white one in site-nav.tsx.
 *
 *   plate   330 x 70 at y13,  fill rgba(248,246,243,0.14),
 *           1px border rgba(255,255,255,0.67)
 *   lockup  285 x 32.087 at x22.5 y18.96 inside it — 22.5 clear on both sides
 *           and 18.95 top and bottom, so it is simply centred at 285 wide.
 *
 * 285 against the lockup component's natural 329 is a scale of 0.8663, which
 * lands the height on 32.05 against Figma's 32.087. The outer span keeps the
 * 285 x 32.09 layout box so the flex centring is not thrown off by the
 * transform.
 *
 * Figma puts the plate 26px left of centre, but that is an artefact of the
 * component being 1396 wide inside a 1440 frame: 22 + 672 = 694 against a frame
 * centre of 720. On the page it is centred.
 *
 * NOT BUILT: the variant also carries four mega-menu panels (Engineered
 * Surfaces, Karigear, Projects, World of Kalinga) as rows of 226 x 186 image
 * cards 25px below the bar. Variant6's bar has no labels to open them from —
 * see DESIGN.md.
 */
export function MenuBar({ className = "", href = "/" }: { className?: string; href?: string | null }) {
  return (
    <div className={`flex h-[95px] w-full justify-center pt-[13px] ${className}`}>
      <div className="flex h-[70px] w-[330px] origin-top scale-[0.72] items-center justify-center border border-[rgba(255,255,255,0.67)] bg-[rgba(248,246,243,0.14)] sm:scale-[0.86] lg:scale-100">
        <span className="block h-[32.09px] w-[285px]">
          <span className="block origin-top-left scale-[0.8663]">
            <KalingaLogo href={href} />
          </span>
        </span>
      </div>
    </div>
  );
}
