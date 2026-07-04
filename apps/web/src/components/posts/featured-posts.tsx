import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { cn } from "@workspace/ui/lib/utils"
import { DateBadge } from "@/components/posts/date-badge"
import type { DigestSummary } from "@/content"
import { getCategory } from "@/content/categories"

/**
 * Grouped, rounded list of the days' headline news (home "À la une"). Each row
 * surfaces a recap's authored `highlight` — the day's biggest news — and links
 * to that recap. Rows without a highlight are skipped (the home already filters
 * for them; this is the type guard).
 *
 * Hovering a row lifts it out of the group as a fully-rounded card. The gap is
 * produced by translating the *neighbours* (rows before move up, rows after
 * move down) instead of adding margin to the hovered row — transforms don't
 * affect layout flow, so the list keeps a constant height and nothing below it
 * shifts. The enclosing border stays off the container (it would box-in the
 * lifted row); rows define the group via their shared dividers + outer corners.
 */
export function FeaturedPosts({ digests }: { digests: DigestSummary[] }) {
  const rows = digests.filter((d) => d.highlight)
  return (
    <div className="isolate">
      {rows.map((digest, index) => {
        const highlight = digest.highlight
        if (!highlight) return null
        const category = getCategory(highlight.category)
        const isFirst = index === 0
        const isLast = index === rows.length - 1
        return (
          <Link
            key={digest.date}
            to="/posts/$date"
            params={{ date: digest.date }}
            className={cn(
              "group relative flex items-center gap-4 border-border/50 border-b bg-card px-4 py-3.5 transition-all duration-200 last:border-b-0",
              // Rest: outer corners give the group its rounded-card silhouette.
              isFirst && "rounded-t-2xl",
              isLast && "rounded-b-2xl",
              // Hover: the row detaches — rounded, lifted, no divider, on top.
              "hover:z-10 hover:translate-y-0 hover:rounded-2xl hover:border-transparent hover:bg-accent hover:shadow-sm",
              // Neighbours part around the hovered row (transform → no reflow).
              "[&:has(~_a:hover)]:-translate-y-2 [a:hover_~_&]:translate-y-2",
              // Neighbours facing the gap round their inner corners + drop the divider.
              "[&:has(+_a:hover)]:rounded-b-2xl [&:has(+_a:hover)]:border-transparent [a:hover_+_&]:rounded-t-2xl"
            )}
          >
            {highlight.image && (
              <img
                src={highlight.image}
                alt=""
                loading="lazy"
                className="size-16 shrink-0 rounded-xl object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: category.accent }}
                  aria-hidden
                />
                {category.label}
              </span>
              <h3 className="mt-1 line-clamp-2 font-medium text-foreground">
                {highlight.title}
              </h3>
              <DateBadge date={digest.date} className="mt-2" />
            </div>
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={1.8}
              className="absolute top-3 right-3 size-5 shrink-0 text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100"
            />
          </Link>
        )
      })}
    </div>
  )
}
