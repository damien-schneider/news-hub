import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { CircleArrowRight02Icon } from "@hugeicons/core-free-icons"

import type { DigestSummary } from "@/content"

/** Grouped, rounded list of featured recaps (home "À la une"). */
export function FeaturedPosts({ digests }: { digests: DigestSummary[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {digests.map((digest) => (
        <Link
          key={digest.date}
          to="/posts/$date"
          params={{ date: digest.date }}
          className="group flex items-center justify-between gap-4 border-b border-border/50 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/50"
        >
          <div className="min-w-0">
            <h3 className="font-medium text-foreground">{digest.title}</h3>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {digest.lede}
            </p>
          </div>
          <HugeiconsIcon
            icon={CircleArrowRight02Icon}
            strokeWidth={1.8}
            className="size-5 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </Link>
      ))}
    </div>
  )
}
