import type { ComponentType } from "react"
import { z } from "zod"

/**
 * Frontmatter authored at the top of each digest `.mdx` file.
 * `date` (YYYY-MM-DD) doubles as the route slug.
 */
export const DigestFrontmatterSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  title: z.string(),
  lede: z.string(),
  /** Category slugs present in this recap (see content/categories.ts). */
  categories: z.array(z.string()).default([]),
  /** Number of news items in the recap (shown on lists). */
  sourceCount: z.number().int().nonnegative().default(0),
  /** Highlighted on the home "Featured" block. */
  featured: z.boolean().default(false),
})

export type DigestFrontmatter = z.infer<typeof DigestFrontmatterSchema>

/** A single news item — rendered as a timeline card. */
export interface NewsItem {
  title: string
  summary: string
  category: string
  tags: string[]
  sources: { label: string; url: string }[]
}

/** List shape (no body) used by the home and /posts pages. */
export interface DigestSummary {
  date: string
  title: string
  lede: string
  categories: string[]
  sourceCount: number
  featured: boolean
}

/**
 * Digest body. A discriminated union so a future Convex/Supabase backend can
 * return structured `blocks` instead of an MDX React component without changing
 * the timeline renderer's contract.
 */
export type DigestBody =
  | { kind: "mdx"; Component: ComponentType }
  | { kind: "blocks"; items: NewsItem[] }

export interface Digest extends DigestSummary {
  body: DigestBody
}
