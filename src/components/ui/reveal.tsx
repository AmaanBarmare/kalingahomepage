"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered entrance.
 *
 * Figma carries no motion data for this file (get_motion_context returns an
 * empty node list), so this is authored rather than transcribed. It is
 * deliberately restrained: an 18px rise over 900ms on an expo-out curve, fired
 * once, never replayed on scroll-back. A luxury surfaces brand should not have
 * things springing about.
 *
 * Three things that keep it from being annoying:
 *  - it fires ONCE and then unobserves, so scrolling up doesn't re-animate;
 *  - under prefers-reduced-motion nothing is ever hidden, so there is no
 *    "invisible content" failure mode if the observer never fires;
 *  - the initial hidden state is applied on the client only, so content is
 *    present in the server HTML for crawlers and no-JS readers.
 */
export function Reveal({
  as: Tag = "div",
  children,
  delay = 0,
  className = "",
}: {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // Never hide anything for a reader who asked for reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    setArmed(true);

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: armed && !shown ? 0 : 1,
        transform: armed && !shown ? "translate3d(0, 18px, 0)" : "none",
        transition: `opacity 900ms var(--ease-out-expo) ${delay}ms, transform 900ms var(--ease-out-expo) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
