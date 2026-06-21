import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import type { DigestSummary } from "@/content"
import { formatDateShort } from "@/lib/format"

/** A compact row used in the "Derniers articles" / all-posts lists. */
export function PostRow({ digest }: { digest: DigestSummary }) {
  return (
    <Link
      to="/posts/$date"
      params={{ date: digest.date }}
      className="group relative flex items-center justify-between gap-4 border-b border-dashed border-border py-4 last:border-b-0"
    >
      <span
        className="absolute start-0 top-1/2 -translate-x-1 -translate-y-1/2 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
        aria-hidden
      >
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
      </span>

      <div className="min-w-0 transition-transform duration-200 group-hover:translate-x-6">
        <h3 className="font-medium text-foreground">{digest.title}</h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {digest.lede}
        </p>
      </div>

      <time
        dateTime={digest.date}
        className="shrink-0 text-sm text-muted-foreground tabular-nums"
      >
        {formatDateShort(digest.date)}
      </time>
    </Link>
  )
}
