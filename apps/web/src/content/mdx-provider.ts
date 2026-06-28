import type { ComponentType } from "react"
import type { ContentProvider } from "./provider"
import type { DigestSummary } from "./types"
import { DigestFrontmatterSchema } from "./types"

/**
 * Each `.mdx` digest compiles to a module exposing:
 *  - a `frontmatter` named export (via remark-mdx-frontmatter)
 *  - a `default` export: the React component for the body
 *
 * Globbed eagerly: the recap body is a non-serializable React component, so it
 * is resolved synchronously in the route component (via `getDigestComponent`)
 * rather than passed through a TanStack loader. Fine for the current volume; a
 * future DB backend drops this entirely.
 */
type DigestModule = { frontmatter?: unknown; default: ComponentType }

const modules = import.meta.glob<DigestModule>("./digests/*.mdx", {
  eager: true,
})

function dateFromPath(path: string): string {
  return path.replace(/^.*\/(.+)\.mdx$/, "$1")
}

function parseSummary(path: string, mod: DigestModule): DigestSummary {
  const fm = DigestFrontmatterSchema.parse(mod.frontmatter ?? {})
  return {
    date: fm.date || dateFromPath(path),
    title: fm.title,
    lede: fm.lede,
    categories: fm.categories,
    sourceCount: fm.sourceCount,
    featured: fm.featured,
  }
}

function findEntry(date: string): [string, DigestModule] | undefined {
  return Object.entries(modules).find(([path]) => dateFromPath(path) === date)
}

export const mdxProvider: ContentProvider = {
  async getDigests() {
    return Object.entries(modules)
      .map(([path, mod]) => parseSummary(path, mod))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  },

  async getDigestByDate(date) {
    const entry = findEntry(date)
    if (!entry) return null
    const [path, mod] = entry
    return {
      ...parseSummary(path, mod),
      body: { kind: "mdx", Component: mod.default },
    }
  },
}

/** Serializable recap metadata for a single date (safe for loaders). */
export async function getDigestSummary(
  date: string
): Promise<DigestSummary | null> {
  const entry = findEntry(date)
  return entry ? parseSummary(entry[0], entry[1]) : null
}

/** The MDX body component for a date. Synchronous — resolve in the component. */
export function getDigestComponent(date: string): ComponentType | null {
  const entry = findEntry(date)
  return entry ? entry[1].default : null
}
