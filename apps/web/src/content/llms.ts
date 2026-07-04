import digestSources from "virtual:digest-sources"

import { siteConfig } from "@/config/site"
import { getCategory, sortCategories } from "./categories"

/**
 * Builders for `/llms.txt` and `/llms-full.txt` — the GEO ("generative engine
 * optimisation") surface. The format follows the llmstxt.org convention: an H1
 * title, a blockquote summary, then link sections an LLM can crawl. The full
 * variant inlines every recap's item-level text so an answer engine can ground
 * on the site without fetching 40 pages. Parsed straight from the raw MDX
 * (`virtual:digest-sources`) — the same untouched source the search index uses.
 */

interface RawSource {
  label: string
  url: string
}
interface RawItem {
  title: string
  category: string
  text: string
  sources: RawSource[]
}
interface RawDigest {
  date: string
  title: string
  lede: string
  categories: string[]
  items: RawItem[]
}

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---/
const ITEM_RE = /<NewsItem\b([\s\S]*?)>([\s\S]*?)<\/NewsItem>/g
const SOURCES_RE = /sources=\{(\[[\s\S]*?\])\}/
const SOURCE_PAIR_RE = /label:\s*"([^"]*)"\s*,\s*url:\s*"([^"]*)"/g

function field(fm: string, key: string): string {
  const m = fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"))
  return m ? m[1].trim() : ""
}

function listField(fm: string, key: string): string[] {
  const raw = fm.match(new RegExp(`^${key}:\\s*\\[(.*?)\\]`, "m"))?.[1] ?? ""
  return Array.from(raw.matchAll(/"([^"]*)"/g)).map((m) => m[1])
}

/** Markdown/JSX → readable plain text, keeping links as `label (url)`. */
function clean(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, "$1 ($2)")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`#>]/g, "")
    .replace(/^\s*[-*]\s+/gm, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim()
}

function parseItems(body: string): RawItem[] {
  const items: RawItem[] = []
  for (const match of body.matchAll(ITEM_RE)) {
    const attrs = match[1]
    const title = attrs.match(/title="([^"]*)"/)?.[1] ?? ""
    if (!title) continue
    const sourcesBlock = attrs.match(SOURCES_RE)?.[1] ?? ""
    const sources: RawSource[] = Array.from(
      sourcesBlock.matchAll(SOURCE_PAIR_RE)
    ).map((m) => ({ label: m[1], url: m[2] }))
    items.push({
      title,
      category: attrs.match(/category="([^"]*)"/)?.[1] ?? "",
      text: clean(match[2]),
      sources,
    })
  }
  return items
}

const digests: RawDigest[] = Object.entries(digestSources)
  .map(([date, src]) => {
    const fm = src.match(FM_RE)?.[1] ?? ""
    const body = src.replace(FM_RE, "")
    return {
      date,
      title: field(fm, "title") || date,
      lede: field(fm, "lede"),
      categories: listField(fm, "categories"),
      items: parseItems(body),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

/** Concise `/llms.txt` index: summary, recent recaps, categories, resources. */
export function buildLlmsIndex(origin: string): string {
  const recent = digests
    .slice(0, 30)
    .map(
      (d) => `- [${d.title} — ${d.date}](${origin}/posts/${d.date}): ${d.lede}`
    )
    .join("\n")

  const categories = sortCategories(
    Array.from(new Set(digests.flatMap((d) => d.categories)))
  )
    .map((slug) => `- **${getCategory(slug).label}**`)
    .join("\n")

  return `# ${siteConfig.brand}

> ${siteConfig.seoDescription}

${siteConfig.bio} Auteur : ${siteConfig.name}. Langue : français. ${digests.length} récapitulatifs publiés.

## Récapitulatifs récents
${recent}

## Catégories couvertes
${categories}

## Ressources
- [Tous les récapitulatifs](${origin}/posts)
- [Contenu complet pour LLM](${origin}/llms-full.txt)
- [Flux RSS](${origin}/rss)
- [Sitemap](${origin}/sitemap.xml)
`
}

/** Full corpus for `/llms-full.txt`: every recap, item by item, with sources. */
export function buildLlmsFull(origin: string): string {
  const head = `# ${siteConfig.brand} — contenu complet

> ${siteConfig.seoDescription}

${siteConfig.bio} Auteur : ${siteConfig.name}. ${digests.length} récapitulatifs, du plus récent au plus ancien.

---
`

  const body = digests
    .map((d) => {
      const items = d.items
        .map((item) => {
          const cat = getCategory(item.category).label
          const src = item.sources.length
            ? `\nSources : ${item.sources
                .map((s) => `${s.label} (${s.url})`)
                .join(", ")}`
            : ""
          return `### ${item.title} [${cat}]\n${item.text}${src}`
        })
        .join("\n\n")
      return `## ${d.title}\nDate : ${d.date} · ${origin}/posts/${d.date}\n\n${d.lede}\n\n${items}`
    })
    .join("\n\n---\n\n")

  return `${head}\n${body}\n`
}
