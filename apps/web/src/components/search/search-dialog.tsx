import {
  Cancel01Icon,
  CornerDownLeftIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useNavigate } from "@tanstack/react-router"
import { AnimatePresence, motion } from "motion/react"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { EASE } from "@/components/motion/reveal"
import type { SearchHit } from "@/content"
import { recentHits, searchAll } from "@/content"
import { getCategory } from "@/content/categories"
import { formatDate } from "@/lib/format"

/** Bold the matched query phrase inside a result title (case-insensitive). */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig")
  const parts = text.split(re)
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="rounded-sm bg-foreground/15 px-0.5 text-foreground"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

function ResultRow({
  hit,
  query,
  active,
  index,
  onHover,
  onSelect,
}: {
  hit: SearchHit
  query: string
  active: boolean
  index: number
  onHover: (index: number) => void
  onSelect: (hit: SearchHit) => void
}) {
  const accent =
    hit.kind === "item" && hit.category
      ? getCategory(hit.category).accent
      : null

  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      data-index={index}
      onMouseMove={() => onHover(index)}
      onClick={() => onSelect(hit)}
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
        active ? "bg-muted/70" : "hover:bg-muted/40"
      }`}
    >
      <span
        className="mt-1.5 size-2 shrink-0 rounded-full"
        style={{ backgroundColor: accent ?? "var(--muted-foreground)" }}
        aria-hidden
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground text-sm">
          <Highlight text={hit.title} query={query} />
        </span>
        {hit.excerpt ? (
          <span className="mt-0.5 block truncate text-muted-foreground text-xs">
            {hit.excerpt}
          </span>
        ) : null}
        <span className="mt-1 block text-[0.6875rem] text-muted-foreground/70">
          {hit.kind === "item" ? `${hit.digestTitle} · ` : ""}
          {formatDate(hit.date)}
        </span>
      </span>
      {active ? (
        <HugeiconsIcon
          icon={CornerDownLeftIcon}
          strokeWidth={2}
          className="mt-1 size-3.5 shrink-0 text-muted-foreground"
        />
      ) : null}
    </button>
  )
}

function Panel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)

  const trimmed = query.trim()
  const hits = useMemo<SearchHit[]>(
    () => (trimmed ? searchAll(trimmed) : recentHits()),
    [trimmed]
  )

  // Reset the cursor whenever the result set changes.
  useEffect(() => setActiveIndex(0), [hits])

  // Lock the page scroll while the palette is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  function go(hit: SearchHit) {
    onClose()
    navigate({
      to: "/posts/$date",
      params: { date: hit.date },
      hash: hit.anchor,
    })
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, hits.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (hits.length > 0) go(hits[activeIndex])
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.22, ease: EASE }}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl"
      >
        {/* Search field */}
        <div className="flex items-center gap-3 border-border/60 border-b px-4">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="size-4.5 shrink-0 text-muted-foreground"
          />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une brève, un sujet, une source…"
            aria-label="Rechercher"
            className="h-13 flex-1 bg-transparent text-[0.95rem] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              aria-label="Effacer"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </button>
          ) : (
            <kbd className="hidden rounded border border-border/70 px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground sm:block">
              esc
            </kbd>
          )}
        </div>

        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          aria-label="Résultats"
          className="max-h-[min(420px,52vh)] overflow-y-auto p-2"
        >
          {!trimmed ? (
            <p className="px-3 pt-1 pb-2 font-medium text-[0.6875rem] text-muted-foreground/70 uppercase tracking-wide">
              Articles récents
            </p>
          ) : null}

          {hits.length > 0 ? (
            hits.map((hit, i) => (
              <ResultRow
                key={`${hit.date}-${hit.anchor ?? "digest"}-${i}`}
                hit={hit}
                query={trimmed}
                index={i}
                active={i === activeIndex}
                onHover={setActiveIndex}
                onSelect={go}
              />
            ))
          ) : (
            <p className="px-3 py-8 text-center text-muted-foreground text-sm">
              Aucun résultat pour «&nbsp;{trimmed}&nbsp;».
            </p>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-border/60 border-t px-4 py-2.5 text-[0.6875rem] text-muted-foreground/80">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border/60 px-1 py-0.5">↑</kbd>
            <kbd className="rounded border border-border/60 px-1 py-0.5">↓</kbd>
            naviguer
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border/60 px-1 py-0.5">↵</kbd>
            ouvrir
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Global command palette (⌘K). Rendered through a portal so it escapes the
 * fixed navigation stacking contexts; mounted once by `SearchProvider`.
 */
export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open ? <Panel onClose={onClose} /> : null}
    </AnimatePresence>,
    document.body
  )
}
