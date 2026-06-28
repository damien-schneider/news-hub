import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useSearch } from "./search-context"

/**
 * Opens the global command palette. `full` is the sidebar pill (label + ⌘K
 * hint); `icon` is the compact button for the mobile header.
 */
export function SearchTrigger({
  variant = "full",
}: {
  variant?: "full" | "icon"
}) {
  const { setOpen } = useSearch()

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher"
        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="size-4.5"
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex w-full items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-muted-foreground text-sm transition-colors hover:border-border hover:text-foreground"
    >
      <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
      <span className="flex-1 text-left">Rechercher</span>
      <kbd className="rounded border border-border/60 px-1.5 py-0.5 text-[0.6875rem]">
        ⌘K
      </kbd>
    </button>
  )
}
