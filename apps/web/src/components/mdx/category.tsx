import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { EASE } from "@/components/motion/reveal"
import { getCategory } from "@/content/categories"
import { isVisible, useFilter } from "./filter-context"

/**
 * Section header inside a recap. Collapses smoothly (with its top spacing) when
 * the reader filters to another category. The spacing lives *inside* the
 * animated element so it disappears together with the header.
 */
export function Category({ slug }: { slug: string }) {
  const { active, query } = useFilter()
  const meta = getCategory(slug)
  // During a free-text search, items scatter across sections — drop the section
  // dividers so the matches read as one flat list.
  const visible = isVisible(active, slug) && query.trim() === ""

  return (
    <motion.div
      data-category-header={slug}
      aria-hidden={!visible}
      initial={false}
      animate={{ height: visible ? "auto" : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-3 pt-12 pb-5">
        <HugeiconsIcon
          icon={meta.icon}
          strokeWidth={2}
          className="size-5 shrink-0"
          style={{ color: meta.accent }}
          aria-hidden
        />
        <h2 className="font-heading font-medium text-2xl leading-none tracking-tight">
          {meta.label}
        </h2>
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to right, ${meta.accent}55, transparent)`,
          }}
          aria-hidden
        />
      </div>
    </motion.div>
  )
}
