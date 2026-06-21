import { createContext, use, useMemo, useState } from "react"
import type { ReactNode } from "react"

interface FilterContextValue {
  /** Active category slug, or null when showing every category. */
  active: string | null
  setActive: (slug: string | null) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({
  children,
  active: controlled,
  setActive: setControlled,
}: {
  children: ReactNode
  active?: string | null
  setActive?: (slug: string | null) => void
}) {
  // Uncontrolled fallback so the provider also works standalone.
  const [internal, setInternal] = useState<string | null>(null)
  const active = controlled !== undefined ? controlled : internal
  const setActive = setControlled ?? setInternal

  const value = useMemo(() => ({ active, setActive }), [active, setActive])
  return <FilterContext value={value}>{children}</FilterContext>
}

export function useFilter(): FilterContextValue {
  return use(FilterContext) ?? { active: null, setActive: () => {} }
}

/** True when an item/section of `slug` should be visible under the active filter. */
export function isVisible(active: string | null, slug: string): boolean {
  return active === null || active === slug
}
