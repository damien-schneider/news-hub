import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@workspace/ui/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/format"

/** "2026-06-27" → local-midnight Date (timezone-stable, matches format.ts). */
function parseISODate(iso: string): Date | null {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/**
 * Clean date pill: absolute date ("27 juin 2026") plus a relative suffix
 * ("· il y a 2 jours"). The relative part is computed after mount so SSR and
 * the first client render agree — only the absolute date ships in the HTML,
 * avoiding a hydration mismatch on `new Date()`.
 */
export function DateBadge({
  date,
  className,
}: {
  date: string
  className?: string
}) {
  const [relative, setRelative] = useState<string | null>(null)

  useEffect(() => {
    const d = parseISODate(date)
    if (!d) return
    setRelative(formatDistanceToNow(d, { addSuffix: true, locale: fr }))
  }, [date])

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 font-medium text-muted-foreground text-xs tabular-nums",
        className
      )}
    >
      <HugeiconsIcon
        icon={Calendar03Icon}
        strokeWidth={1.8}
        className="size-3.5 shrink-0"
      />
      <time dateTime={date} className="text-foreground/80">
        {formatDate(date)}
      </time>
      {relative && (
        <span className="text-muted-foreground/70">· {relative}</span>
      )}
    </span>
  )
}
