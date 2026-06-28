import type { ReactNode } from "react"
import { createContext, use, useMemo, useState } from "react"

interface FilterContextValue {
  /** Active category slug, or null when showing every category. */
  active: string | null
  setActive: (slug: string | null) => void
  /** Free-text in-post query; "" shows everything. */
  query: string
  setQuery: (query: string) => void
  /** Anchor of the item to flash-highlight (deep link), or null. */
  highlight: string | null
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({
  children,
  active: controlled,
  setActive: setControlled,
  query: controlledQuery,
  setQuery: setControlledQuery,
  highlight = null,
}: {
  children: ReactNode
  active?: string | null
  setActive?: (slug: string | null) => void
  query?: string
  setQuery?: (query: string) => void
  highlight?: string | null
}) {
  // Uncontrolled fallback so the provider also works standalone.
  const [internal, setInternal] = useState<string | null>(null)
  const [internalQuery, setInternalQuery] = useState("")
  const active = controlled !== undefined ? controlled : internal
  const setActive = setControlled ?? setInternal
  const query = controlledQuery !== undefined ? controlledQuery : internalQuery
  const setQuery = setControlledQuery ?? setInternalQuery

  const value = useMemo(
    () => ({ active, setActive, query, setQuery, highlight }),
    [active, setActive, query, setQuery, highlight]
  )
  return <FilterContext value={value}>{children}</FilterContext>
}

export function useFilter(): FilterContextValue {
  return (
    use(FilterContext) ?? {
      active: null,
      setActive: () => {},
      query: "",
      setQuery: () => {},
      highlight: null,
    }
  )
}

/** True when an item/section of `slug` should be visible under the active filter. */
export function isVisible(active: string | null, slug: string): boolean {
  return active === null || active === slug
}
