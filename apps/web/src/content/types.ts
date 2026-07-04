import type { ComponentType } from "react"
import { z } from "zod"

/**
 * The single headline news of a recap, surfaced on the home "À la une" block.
 * Authored in frontmatter (not in a `<NewsItem>` body flag) so it stays in the
 * serializable `DigestSummary` the list loaders read — no MDX body parsing, and
 * it survives the future Convex backend swap untouched.
 */
export const HighlightSchema = z.object({
  /** Headline of the day's biggest news (may differ from the recap `title`). */
  title: z.string(),
  /** Category slug of that news (drives the accent chip). */
  category: z.string(),
  /** Cover image URL for the À la une card. Optional. */
  image: z.string().url().optional(),
})

export type Highlight = z.infer<typeof HighlightSchema>

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
  /** Day's headline news — present ⇒ eligible for the home "À la une". */
  highlight: HighlightSchema.optional(),
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
  /** Day's headline news, when authored — drives the home "À la une". */
  highlight?: Highlight
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
