import { createFileRoute } from "@tanstack/react-router"
import { siteConfig } from "@/config/site"
import { getDigests } from "@/content"
import { getCategory } from "@/content/categories"

/**
 * RSS 2.0 feed served at `/rss`. Hand-rolled (no dep): the recap list is small
 * and we only need title/lede/link/date per item. Readers poll this file and
 * notify their users of new recaps — that is the "subscribe" path. Absolute
 * URLs are derived from the incoming request so the same code works in dev and
 * behind any host.
 */
export const Route = createFileRoute("/rss")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = resolveOrigin(request)
        const digests = await getDigests()

        const items = digests
          .map((d) => {
            const url = `${origin}/posts/${d.date}`
            const categories = d.categories
              .map(
                (slug) =>
                  `    <category>${esc(getCategory(slug).label)}</category>`
              )
              .join("\n")
            return [
              "  <item>",
              `    <title>${esc(d.title)}</title>`,
              `    <link>${url}</link>`,
              `    <guid isPermaLink="true">${url}</guid>`,
              `    <pubDate>${toRfc822(d.date)}</pubDate>`,
              `    <description>${esc(d.lede)}</description>`,
              categories,
              "  </item>",
            ]
              .filter(Boolean)
              .join("\n")
          })
          .join("\n")

        const lastBuild = digests[0] ? toRfc822(digests[0].date) : ""

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(siteConfig.brand)} — ${esc(siteConfig.tagline)}</title>
  <link>${origin}</link>
  <description>${esc(siteConfig.bio)}</description>
  <language>fr</language>
  <atom:link href="${origin}/rss" rel="self" type="application/rss+xml" />
${lastBuild ? `  <lastBuildDate>${lastBuild}</lastBuildDate>\n` : ""}${items}
</channel>
</rss>
`

        return new Response(xml, {
          headers: {
            "content-type": "application/rss+xml; charset=utf-8",
            // Cache at the edge; recaps land at most once a day.
            "cache-control": "public, max-age=0, s-maxage=3600",
          },
        })
      },
    },
  },
})

/** Escape the five XML-significant characters. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/** `YYYY-MM-DD` → RFC-822 date (noon UTC avoids a timezone day-shift). */
function toRfc822(date: string): string {
  return new Date(`${date}T12:00:00Z`).toUTCString()
}

/** Honour proxy headers so the feed advertises the public host, not localhost. */
function resolveOrigin(request: Request): string {
  const url = new URL(request.url)
  const host = request.headers.get("x-forwarded-host") ?? url.host
  const proto =
    request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
  return `${proto}://${host}`
}
