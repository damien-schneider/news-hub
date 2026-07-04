import {
  ArrowUpRight01Icon,
  Copy01Icon,
  RssIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useState } from "react"

const FEED_PATH = "/rss"

/** Build an absolute feed URL on the client (needed for reader deep-links). */
function feedUrl(): string {
  if (typeof window === "undefined") return FEED_PATH
  return `${window.location.origin}${FEED_PATH}`
}

/** Clipboard fallback for browsers that deny the async Clipboard API. */
function legacyCopy(text: string): boolean {
  try {
    const el = document.createElement("textarea")
    el.value = text
    el.style.position = "fixed"
    el.style.opacity = "0"
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

/**
 * "S'abonner" affordance. RSS itself is how readers get *notified* of new
 * recaps: the user adds this feed to their reader (Feedly, Inoreader, NetNewsWire…)
 * which polls it and pushes a notification on each new post. We surface the feed
 * URL (copy), a raw-feed link, and one-click adds to the two big web readers.
 *
 * `full` is the labelled sidebar button; `icon` is the compact mobile-header one.
 */
export function RssSubscribe({
  variant = "full",
}: {
  variant?: "full" | "icon"
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const url = feedUrl()
    let ok = false
    try {
      await navigator.clipboard.writeText(url)
      ok = true
    } catch {
      // Async Clipboard API denied (permission/focus) — fall back to the legacy
      // execCommand path before giving up.
      ok = legacyCopy(url)
    }
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="S'abonner au flux RSS"
        className={
          variant === "icon"
            ? "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground"
            : "flex w-full items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-1.5 text-muted-foreground text-sm shadow-sm transition-colors hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground"
        }
      >
        <HugeiconsIcon
          icon={RssIcon}
          strokeWidth={2}
          className={variant === "icon" ? "size-4.5" : "size-4"}
        />
        {variant === "full" && (
          <span className="flex-1 text-left">S'abonner</span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <p className="px-2 py-1.5 text-muted-foreground text-xs leading-relaxed">
          Ajoutez le flux à votre lecteur RSS pour être notifié de chaque
          nouveau récap.
        </p>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          closeOnClick={false}
          onClick={(e) => {
            e.preventDefault()
            copy()
          }}
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} />
          {copied ? "Lien copié" : "Copier l'URL du flux"}
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <a href={FEED_PATH} target="_blank" rel="noreferrer noopener" />
          }
        >
          <HugeiconsIcon icon={RssIcon} />
          Ouvrir le flux
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ajouter à un lecteur</DropdownMenuLabel>

          <DropdownMenuItem
            render={
              <a
                href={`https://feedly.com/i/subscription/feed/${encodeURIComponent(feedUrl())}`}
                target="_blank"
                rel="noreferrer noopener"
              />
            }
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} />
            Feedly
          </DropdownMenuItem>

          <DropdownMenuItem
            render={
              <a
                href={`https://www.inoreader.com/feed/${encodeURIComponent(feedUrl())}`}
                target="_blank"
                rel="noreferrer noopener"
              />
            }
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} />
            Inoreader
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
