"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { KalingaLogo } from "@/components/ui/kalinga-logo";

/**
 * Full-bleed intro. The hero clip plays edge to edge under a centred lockup,
 * then hands over to the page.
 *
 * It leaves on whichever comes first: a 7s timer, any scroll/wheel/touch, or
 * any pointer or key press. All of them are wired because a visitor who reaches
 * for the page should never have to sit out the rest of the timer.
 *
 * ONCE PER TAB, via sessionStorage — exactly the semantics asked for. Close the
 * tab and return: storage is gone and the intro plays again. Navigate to another
 * page and back within the same tab: storage survives and it is skipped.
 * localStorage would suppress it forever; no storage at all would replay it on
 * every internal navigation.
 *
 * WHY useSyncExternalStore RATHER THAN AN EFFECT
 * The overlay is rendered on the server (`getServerSnapshot` returns false, i.e.
 * "do not skip") so a first-time visitor has it in the very first paint. Deciding
 * in an effect instead would paint the page first and drop the intro on top of
 * it a moment later — and it is also the `set-state-in-effect` lint error that
 * reveal.tsx already had to be rewritten to avoid.
 *
 * A returning visitor would then get the opposite flash: the overlay in the HTML,
 * removed once hydration reads sessionStorage. The inline script in layout.tsx
 * stamps `data-intro-seen` on <html> BEFORE first paint, and the CSS rule beside
 * it hides this element, so that flash never lands. The same <noscript> rule
 * keeps the page usable with JS off, which matters because without JS nothing
 * here would ever dismiss the overlay.
 */

export const INTRO_KEY = "ks-intro-seen";
const HOLD_MS = 7000;
const FADE_MS = 900;

const subscribe = () => () => {};
const readSkip = () => {
  try {
    if (sessionStorage.getItem(INTRO_KEY) === "1") return true;
  } catch {
    /* private mode — fall through and just play it */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function IntroSplash() {
  const skip = useSyncExternalStore(subscribe, readSkip, () => false);
  const [phase, setPhase] = useState<"showing" | "leaving" | "done">("showing");
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = useCallback(() => {
    setPhase((p) => (p === "showing" ? "leaving" : p));
  }, []);

  useEffect(() => {
    if (skip || phase !== "showing") return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode — it simply plays again next load */
    }

    void videoRef.current?.play().catch(() => {});

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const passive = { passive: true } as const;
    window.addEventListener("wheel", dismiss, passive);
    window.addEventListener("touchmove", dismiss, passive);
    window.addEventListener("scroll", dismiss, passive);
    window.addEventListener("pointerdown", dismiss, passive);
    window.addEventListener("keydown", dismiss);
    const timer = window.setTimeout(dismiss, HOLD_MS);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      document.body.style.overflow = prevOverflow;
    };
  }, [skip, phase, dismiss]);

  // Unmount only once the fade has finished, so the video is not torn out from
  // under its own transition.
  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("done"), FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (skip || phase === "done") return null;

  return (
    <div
      id="ks-intro"
      aria-hidden
      className="fixed inset-0 z-100 bg-ink transition-opacity ease-out-expo"
      style={{
        transitionDuration: `${FADE_MS}ms`,
        opacity: phase === "leaving" ? 0 : 1,
        pointerEvents: phase === "leaving" ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        poster="/images/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* The lockup sits on the bar's own 27px baseline so it does not jump
          when the intro hands over to the navbar. */}
      <div className="absolute inset-x-0 top-6.75 flex justify-center">
        <span className="block origin-top scale-[0.7] sm:scale-[0.85] lg:scale-[0.936]">
          <KalingaLogo href={null} />
        </span>
      </div>
    </div>
  );
}
