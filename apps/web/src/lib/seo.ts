import { siteConfig } from "@/config/site"

/**
 * Centralised `<head>` builder so every route emits a consistent, complete set
 * of SEO + social tags. Returns the `{ meta, links }` shape TanStack Router's
 * `head()` expects. JSON-LD is passed through as `script:ld+json` meta entries —
 * TanStack renders those as `<script type="application/ld+json">` in the head.
 *
 * Canonical lives here (one per page): the root route deliberately omits it so a
 * page never ships two competing `<link rel="canonical">`.
 */

/** Join the site origin with a path → an absolute, canonical-safe URL. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/+$/, "")
  if (!path || path === "/") return `${base}/`
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

/** Resolve an image ref (absolute http(s) URL, or root-relative) to absolute. */
export function absoluteImage(image?: string): string {
  const src = image || siteConfig.ogImage
  return src.startsWith("http") ? src : absoluteUrl(src)
}

export interface SeoInput {
  /** Full document `<title>`. */
  title: string
  description: string
  /** Route path, e.g. `/posts/2026-06-27`. Drives canonical + og:url. */
  path: string
  /** Share image — absolute or root-relative; defaults to the site OG image. */
  image?: string
  imageAlt?: string
  type?: "website" | "article"
  /** ISO date (`YYYY-MM-DD`) — only for `type: "article"`. */
  publishedTime?: string
  /** Section/category label — only for `type: "article"`. */
  section?: string
  /** Extra JSON-LD objects rendered into the head (Article, Breadcrumb, …). */
  jsonLd?: Array<Record<string, unknown>>
  /** Keep the page out of the index (e.g. thin or duplicate routes). */
  noindex?: boolean
}

type MetaTag = Record<string, unknown>

export function seo(input: SeoInput): {
  meta: MetaTag[]
  links: Array<{ rel: string; href: string; [k: string]: string }>
} {
  const url = absoluteUrl(input.path)
  const image = absoluteImage(input.image)
  const type = input.type ?? "website"

  const meta: MetaTag[] = [
    { title: input.title },
    { name: "description", content: input.description },
    {
      name: "robots",
      content: input.noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    // Open Graph
    { property: "og:type", content: type },
    { property: "og:site_name", content: siteConfig.brand },
    { property: "og:locale", content: siteConfig.locale },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: input.imageAlt ?? input.title },
    // Twitter / X
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: input.imageAlt ?? input.title },
  ]

  if (type === "article") {
    if (input.publishedTime) {
      meta.push({
        property: "article:published_time",
        content: `${input.publishedTime}T08:00:00.000Z`,
      })
    }
    if (input.section) {
      meta.push({ property: "article:section", content: input.section })
    }
    meta.push({ property: "article:author", content: siteConfig.name })
  }

  for (const node of input.jsonLd ?? []) {
    meta.push({ "script:ld+json": node })
  }

  return { meta, links: [{ rel: "canonical", href: url }] }
}

/** The site-wide WebSite + Person graph (root route). */
export function siteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: absoluteUrl("/"),
        name: siteConfig.brand,
        description: siteConfig.seoDescription,
        inLanguage: siteConfig.lang,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        url: absoluteUrl("/"),
        description: siteConfig.bio,
        jobTitle: siteConfig.role,
        sameAs: siteConfig.links
          .filter((link) => link.href.startsWith("http"))
          .map((link) => link.href),
      },
    ],
  }
}

/** A BreadcrumbList for `crumbs` of `[label, path]` pairs. */
export function breadcrumbJsonLd(
  crumbs: Array<[label: string, path: string]>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}
