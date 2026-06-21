import { LayoutGroup, motion } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

import { getCategory, sortCategories } from "@/content/categories"

interface Chip {
  slug: string | null
  label: string
  accent: string | null
}

/** Single-select category chips with a sliding active indicator. */
export function CategoryFilter({
  categories,
  active,
  onChange,
  orientation = "horizontal",
}: {
  categories: string[]
  active: string | null
  onChange: (slug: string | null) => void
  orientation?: "horizontal" | "vertical"
}) {
  const chips: Chip[] = [
    { slug: null, label: "Tous", accent: null },
    ...sortCategories(categories).map((slug) => {
      const meta = getCategory(slug)
      return { slug, label: meta.label, accent: meta.accent }
    }),
  ]

  return (
    // Distinct id per orientation: both variants stay mounted (one hidden via
    // CSS), so a shared layoutId would make the sliding indicator fight itself.
    <LayoutGroup id={`category-filter-${orientation}`}>
      <div
        className={cn(
          orientation === "vertical"
            ? "flex flex-col items-start gap-1.5"
            : "flex flex-wrap gap-2"
        )}
      >
        {chips.map((chip) => {
          const selected = active === chip.slug
          return (
            <button
              key={chip.slug ?? "all"}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(chip.slug)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
                selected
                  ? "border-transparent text-foreground"
                  : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`category-filter-active-${orientation}`}
                  transition={{ type: "spring", stiffness: 480, damping: 40 }}
                  className="absolute inset-0 -z-10 rounded-full border"
                  style={
                    chip.accent
                      ? {
                          backgroundColor: `${chip.accent}1f`,
                          borderColor: chip.accent,
                        }
                      : {
                          backgroundColor: "var(--muted)",
                          borderColor: "var(--border)",
                        }
                  }
                />
              )}
              {chip.accent && (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: chip.accent }}
                  aria-hidden
                />
              )}
              {chip.label}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
