import { cn } from "@workspace/ui/lib/utils"
import { motion } from "motion/react"
import type { CSSProperties, ReactNode } from "react"
import { useMemo, useState } from "react"
import { EASE } from "@/components/motion/reveal"
import { getCategory } from "@/content/categories"
import { nodeText } from "@/lib/node-text"
import { queryMatches, slugify } from "@/lib/slug"
import { isVisible, useFilter } from "./filter-context"
import { Source } from "./source"
import { ZoomImage } from "./zoom-image"

export interface SourceRef {
  label: string
  url?: string
}

/**
 * Cover image bleeding to the card edges (typically the primary source's
 * `og:image`). Click opens it full-screen; it removes itself if the hotlink
 * fails so a dead preview never leaves a broken-image icon.
 */
function LeadImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <div className="-mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden bg-muted">
      <ZoomImage
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        triggerClassName="size-full"
        className="size-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      />
    </div>
  )
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
  image,
  imageAlt,
  children,
}: {
  title: string
  category: string
  tags?: string[]
  sources?: SourceRef[]
  image?: string
  imageAlt?: string
  children?: ReactNode
}) {
  const { active, query, highlight } = useFilter()
  const meta = getCategory(category)
  // Title + tags + rendered summary — so an in-post search reaches body text.
  const haystack = useMemo(
    () => [title, tags.join(" "), nodeText(children)].join(" "),
    [title, tags, children]
  )
  const visible = isVisible(active, category) && queryMatches(haystack, query)
  const anchor = `item-${slugify(title)}`
  // Driven by JS (not `:target`) so a deep link still flashes after the page
  // falls back to client rendering, where `:target` never matches.
  const highlighted = highlight === anchor

  return (
    <motion.article
      id={anchor}
      data-category={category}
      aria-hidden={!visible}
      initial={false}
      animate={{ height: visible ? "auto" : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="relative scroll-mt-28 overflow-hidden"
      style={
        {
          pointerEvents: visible ? "auto" : "none",
          "--accent": meta.accent,
        } as CSSProperties
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -6% 0px" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="pb-3"
      >
        <div
          className={cn(
            "overflow-hidden rounded-[20px] border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-500",
            highlighted && "ring-2 ring-[var(--accent)] ring-inset"
          )}
        >
          {image ? <LeadImage src={image} alt={imageAlt ?? title} /> : null}

          <h3 className="font-medium text-[1.0625rem] text-foreground leading-snug">
            {title}
          </h3>

          {children ? (
            <div className="mt-2 text-muted-foreground text-sm leading-relaxed">
              {children}
            </div>
          ) : null}

          {(tags.length > 0 || sources.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {tags.length > 0 && (
                <span className="text-muted-foreground/80 text-sm">
                  {tags.map((tag) => `#${tag}`).join(", ")}
                </span>
              )}
              {sources.length > 0 && (
                <div className="ms-auto flex flex-wrap items-center gap-x-3 gap-y-1.5">
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
          )}
        </div>
      </motion.div>
    </motion.article>
  )
}
