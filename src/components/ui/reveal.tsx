"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered entrance.
 *
 * Figma carries no motion data for this file (get_motion_context returns an
 * empty node list), so this is authored rather than transcribed. Deliberately
 * restrained: an 18px rise over 900ms on an expo-out curve, fired once and
 * never replayed on scroll-back.
 *
 * The hidden state lives in CSS (`.ks-reveal`), not in React state, for three
 * reasons:
 *   - no setState inside an effect, which is both a lint error and a real
 *     double-render;
 *   - `prefers-reduced-motion` un-hides it in the stylesheet, so a reader who
 *     asked for stillness never depends on JS running to see the page;
 *   - a <noscript> rule does the same when JS never arrives, so there is no
 *     way for content to be stranded invisible.
 * The observer then only ever adds a class — a DOM write, not a state change.
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`ks-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
