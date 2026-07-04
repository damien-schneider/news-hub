import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"

import { DateBadge } from "@/components/posts/date-badge"
import type { DigestSummary } from "@/content"

/** A compact row used in the "Derniers articles" / all-posts lists. */
export function PostRow({ digest }: { digest: DigestSummary }) {
  return (
    <Link
      to="/posts/$date"
      params={{ date: digest.date }}
      className="group relative -mx-3 grid grid-cols-[1fr_auto] items-start gap-4 rounded-lg px-3 py-4 transition-colors duration-200 hover:bg-muted/50"
    >
      <div className="min-w-0">
        <h3 className="relative font-medium text-foreground transition-transform duration-200 group-hover:translate-x-6">
          <span
            className="absolute -start-6 top-1/2 -translate-x-1 -translate-y-1/2 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
          {digest.title}
        </h3>
        <p className="mt-0.5 truncate text-muted-foreground text-sm">
          {digest.lede}
        </p>
      </div>

      <DateBadge date={digest.date} className="mt-0.5" />
    </Link>
  )
}
