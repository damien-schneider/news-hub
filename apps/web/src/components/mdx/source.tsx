import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

/**
 * A source attribution inside a news item. Renders a link when a URL is given,
 * otherwise a plain label (the digest often cites newsletters by name only).
 */
export function Source({ label, href }: { label: string; href?: string }) {
  if (!href) {
    return (
      <span className="font-medium text-muted-foreground text-xs">{label}</span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-0.5 rounded-md font-medium text-muted-foreground text-xs underline-offset-2 transition-colors hover:text-foreground hover:underline"
    >
      {label}
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        strokeWidth={2}
        className="size-3"
      />
    </a>
  )
}
