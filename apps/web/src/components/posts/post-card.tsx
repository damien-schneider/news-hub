import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"
import { EASE } from "@/components/motion/reveal"
import type { DigestSummary } from "@/content"
import { getCategory } from "@/content/categories"
import { formatDate } from "@/lib/format"

/** A featured recap card (home "À la une" block). */
export function PostCard({ digest }: { digest: DigestSummary }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <Link
        to="/posts/$date"
        params={{ date: digest.date }}
        className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card px-4 py-3.5 shadow-sm transition-colors hover:border-border hover:bg-muted/30"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{digest.title}</h3>
            <span className="text-muted-foreground text-xs">
              · {formatDate(digest.date)}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-muted-foreground text-sm">
            {digest.lede}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {digest.categories.slice(0, 8).map((slug) => {
              const meta = getCategory(slug)
              return (
                <span
                  key={slug}
                  className="size-2 rounded-full"
                  style={{ backgroundColor: meta.accent }}
                  title={meta.label}
                  aria-hidden
                />
              )
            })}
            <span className="ms-1 text-muted-foreground text-xs">
              {digest.sourceCount} brèves
            </span>
          </div>
        </div>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </Link>
    </motion.div>
  )
}
