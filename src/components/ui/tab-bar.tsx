"use client";

/**
 * "Sticky Filter Bar" — Figma 544:3931 (applications) and 544:4001 (testimonials).
 *
 * Both are a row of bordered 34px-tall chips on a 10px gap. Widths are
 * label-driven in Figma (101 / 101 / 101 / 101 for sectors; 121 / 101 / 115 for
 * audiences), so nothing is hard-coded here.
 *
 * The two bars use different active fills, sampled from the rendered frame:
 *   applications  -> #70000e  brand/ruby
 *   testimonials  -> #14100e  ink/primary
 * They are genuinely different in the design, not a rendering artefact.
 */
export function TabBar({
  items,
  active,
  onSelect,
  tone = "ruby",
  label,
  className = "",
}: {
  items: readonly string[];
  active: number;
  onSelect: (index: number) => void;
  tone?: "ruby" | "ink";
  label: string;
  className?: string;
}) {
  const activeFill = tone === "ruby" ? "bg-ruby border-ruby" : "bg-ink border-ink";

  return (
    <div role="tablist" aria-label={label} className={`flex flex-wrap justify-center gap-[10px] ${className}`}>
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(i)}
            className={[
              // Halogen Medium — 544:3935 (sectors) and 544:4005 (audiences)
              // both report font-['Halogen:Medium'] with tracking 1px. The body
              // face here was wrong on both bars.
              "h-[34px] min-w-[101px] px-[8px] text-[13px] tracking-[1px]",
              "font-display font-medium transition-colors duration-300 ease-[var(--ease-out-expo)]",
              isActive
                ? `${activeFill} text-white`
                : "border border-line-soft bg-white text-ink hover:border-ink/40",
            ].join(" ")}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
