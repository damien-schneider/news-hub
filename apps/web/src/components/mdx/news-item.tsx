import type { ReactNode } from "react"
import { motion } from "motion/react"

import { getCategory } from "@/content/categories"
import { EASE } from "@/components/motion/reveal"
import { isVisible, useFilter } from "./filter-context"
import { Source } from "./source"

export interface SourceRef {
  label: string
  url?: string
}

/**
 * A single news item rendered as a feed card (timeline-feed style).
 *
 * Two layers of motion: the outer element collapses (height + opacity) when the
 * reader filters to another category — siblings slide up smoothly; the inner
 * card fades and rises into view on first scroll.
 */
export function NewsItem({
  title,
  category,
  tags = [],
  sources = [],
  children,
}: {
  title: string
  category: string
  tags?: string[]
  sources?: SourceRef[]
  children?: ReactNode
}) {
  const { active } = useFilter()
  const meta = getCategory(category)
  const visible = isVisible(active, category)

  return (
    <motion.article
      data-category={category}
      aria-hidden={!visible}
      initial={false}
      animate={{ height: visible ? "auto" : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="relative overflow-hidden"
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -6% 0px" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="pb-3"
      >
        <div className="rounded-[20px] border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start gap-2.5">
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full"
              style={{ backgroundColor: meta.accent }}
              aria-hidden
            />
            <h3 className="text-[1.0625rem] leading-snug font-medium text-foreground">
              {title}
            </h3>
          </div>

          {children ? (
            <div className="mt-2 ps-4.5 text-sm leading-relaxed text-muted-foreground">
              {children}
            </div>
          ) : null}

          {(tags.length > 0 || sources.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 ps-4.5">
              {tags.length > 0 && (
                <span className="text-sm text-muted-foreground/80">
                  {tags.map((tag) => `#${tag}`).join(", ")}
                </span>
              )}
              {tags.length > 0 && sources.length > 0 && (
                <span className="h-3 w-px bg-border" aria-hidden />
              )}
              {sources.map((source) => (
                <Source
                  key={source.label}
                  label={source.label}
                  href={source.url}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.article>
  )
}
