import digestSources from "virtual:digest-sources"
import { normalizeText, slugify } from "@/lib/slug"
import { getCategory } from "./categories"

/**
 * Search index built from the raw `.mdx` source.
 *
 * The compiled digest modules expose only a React component (non-serializable,
 * opaque to text extraction), so the index is parsed from the raw files instead.
 * The source map comes from the `virtual:digest-sources` plugin (see
 * vite.config.ts) — read straight from disk, untouched by the MDX transform.
 * The authored shape is stable (the `news-recap` skill), so a light regex pass
 * over `<NewsItem>` blocks is enough. A future DB backend would replace this
 * whole module with a query over structured rows.
 */

/** One indexed news item — serializable, safe to return from a loader. */
export interface SearchItem {
  date: string
  /** Anchor id of the rendered card: `item-<slug>`. */
  anchor: string
  title: string
  category: string
  tags: string[]
  summary: string
  /** Cover image URL, when the authored card carries one. */
  image?: string
}

/** A ranked search result spanning both recaps and individual items. */
export interface SearchHit {
  kind: "digest" | "item"
  date: string
  /** Recap title (the page the hit lives on). */
  digestTitle: string
  /** What to show as the result's headline. */
  title: string
  /** Hash to scroll to, for item hits. */
  anchor?: string
  category?: string
  tags: string[]
  excerpt: string
  score: number
}

interface DigestDoc {
  date: string
  title: string
  lede: string
  items: SearchItem[]
}

/** Pull a single quoted (or bare) frontmatter scalar. */
function frontmatterField(block: string, key: string): string {
  const m = block.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"))
  return m ? m[1].trim() : ""
}

/** Strip markdown/JSX down to readable plain text for matching + excerpts. */
function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [label](url) → label
    .replace(/<[^>]+>/g, " ") // stray JSX/HTML tags
    .replace(/[*_`#>]/g, "") // emphasis / heading / quote marks
    .replace(/^\s*[-*]\s+/gm, "") // list bullets
    .replace(/\s+/g, " ")
    .trim()
}

const ITEM_RE = /<NewsItem\b([\s\S]*?)>([\s\S]*?)<\/NewsItem>/g
const TAG_RE = /tags=\{(\[[\s\S]*?\])\}/
const QUOTED_RE = /"([^"]*)"|'([^']*)'/g

function parseItems(date: string, body: string): SearchItem[] {
  const items: SearchItem[] = []
  for (const match of body.matchAll(ITEM_RE)) {
    const attrs = match[1]
    const title = attrs.match(/title="([^"]*)"/)?.[1] ?? ""
    if (!title) continue
    const category = attrs.match(/category="([^"]*)"/)?.[1] ?? ""

    const tagsBlock = attrs.match(TAG_RE)?.[1] ?? ""
    const tags: string[] = []
    for (const t of tagsBlock.matchAll(QUOTED_RE)) {
      tags.push(t[1] || t[2] || "")
    }

    const image = attrs.match(/\bimage="([^"]*)"/)?.[1] || undefined

    items.push({
      date,
      anchor: `item-${slugify(title)}`,
      title,
      category,
      tags,
      summary: toPlainText(match[2]),
      image,
    })
  }
  return items
}

const docs: DigestDoc[] = Object.entries(digestSources)
  .map(([date, src]) => {
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ""
    const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---/, "")
    return {
      date,
      title: frontmatterField(fm, "title") || date,
      lede: frontmatterField(fm, "lede"),
      items: parseItems(date, body),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

/** All news items of a recap (serializable) — drives the in-post result count. */
export function getDigestItems(date: string): SearchItem[] {
  return docs.find((d) => d.date === date)?.items ?? []
}

interface ScoredDoc {
  hit: Omit<SearchHit, "score">
  title: string
  tags: string
  text: string
}

const corpus: ScoredDoc[] = docs.flatMap((doc) => {
  const digest: ScoredDoc = {
    hit: {
      kind: "digest",
      date: doc.date,
      digestTitle: doc.title,
      title: doc.title,
      tags: [],
      excerpt: doc.lede,
    },
    title: normalizeText(doc.title),
    tags: "",
    text: normalizeText(doc.lede),
  }
  const items: ScoredDoc[] = doc.items.map((item) => {
    const catLabel = getCategory(item.category).label
    return {
      hit: {
        kind: "item",
        date: doc.date,
        digestTitle: doc.title,
        title: item.title,
        anchor: item.anchor,
        category: item.category,
        tags: item.tags,
        excerpt: item.summary,
      },
      title: normalizeText(item.title),
      tags: normalizeText([catLabel, ...item.tags].join(" ")),
      text: normalizeText(item.summary),
    }
  })
  return [digest, ...items]
})

/**
 * Rank the corpus against `query`. Token AND-match (every token must land
 * somewhere), weighted by field: title > tags/category > body. A whole-query
 * title substring gets a strong bonus so exact-ish title hits float to the top.
 */
export function searchAll(query: string, limit = 24): SearchHit[] {
  const q = normalizeText(query).trim()
  if (!q) return []
  const tokens = q.split(/\s+/)

  const hits: SearchHit[] = []
  for (const doc of corpus) {
    let score = 0
    let allTokensHit = true
    for (const token of tokens) {
      if (doc.title.includes(token)) score += 4
      else if (doc.tags.includes(token)) score += 2
      else if (doc.text.includes(token)) score += 1
      else {
        allTokensHit = false
        break
      }
    }
    if (!allTokensHit) continue
    if (doc.title.includes(q)) score += 6
    if (doc.hit.kind === "digest") score += 1 // surface the recap above its items
    if (score > 0) hits.push({ ...doc.hit, score })
  }

  return hits
    .sort((a, b) =>
      b.score !== a.score
        ? b.score - a.score
        : a.date < b.date
          ? 1
          : a.date > b.date
            ? -1
            : 0
    )
    .slice(0, limit)
}

/** Recap-level hits, newest first — the dialog's empty-query browse state. */
export function recentHits(limit = 8): SearchHit[] {
  return docs.slice(0, limit).map((doc) => ({
    kind: "digest" as const,
    date: doc.date,
    digestTitle: doc.title,
    title: doc.title,
    tags: [],
    excerpt: doc.lede,
    score: 0,
  }))
}
