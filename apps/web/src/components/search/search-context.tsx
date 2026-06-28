import type { ReactNode } from "react"
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { SearchDialog } from "./search-dialog"

interface SearchContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

/** True when the keystroke lands in a text field — don't hijack typing there. */
function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable
}

/**
 * Holds the global command-palette state and mounts the dialog once. Wraps the
 * app so any trigger (sidebar, header) shares one instance, and binds the
 * ⌘K / Ctrl+K (and bare "/") shortcuts.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !isEditableTarget(e.target)
      ) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle])

  return (
    <SearchContext value={value}>
      {children}
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </SearchContext>
  )
}

export function useSearch(): SearchContextValue {
  const ctx = use(SearchContext)
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>")
  return ctx
}
