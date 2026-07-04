import { createFileRoute } from "@tanstack/react-router"

import { getDigestItems, getDigests } from "@/content"
import { resolveOrigin } from "@/lib/request-origin"

/**
 * XML sitemap served at `/sitemap.xml`. Lists the home page, the archive and
 * every recap with a `lastmod` so crawlers re-fetch only what changed. Recaps
 * that carry a cover image expose it via the image-sitemap extension, which
 * lets Google index the visuals alongside the page. Absolute URLs come from the
 * request, so dev and any production host both work without configuration.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = resolveOrigin(request)
        const digests = await getDigests()
        const newest = digests[0]?.date ?? today()

        const urls: string[] = [
          urlEntry(`${origin}/`, newest, "daily", "1.0"),
          urlEntry(`${origin}/posts`, newest, "daily", "0.8"),
        ]

        for (const d of digests) {
          const loc = `${origin}/posts/${d.date}`
          const cover = getDigestItems(d.date).find((i) => i.image)?.image
          const image = cover
            ? `\n    <image:image><image:loc>${esc(cover)}</image:loc>` +
              `<image:title>${esc(d.title)}</image:title></image:image>`
            : ""
          urls.push(
            urlEntry(
              loc,
              d.date,
              d.highlight ? "weekly" : "monthly",
              "0.7",
              image
            )
          )
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=0, s-maxage=3600",
          },
        })
      },
    },
  },
})

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
  extra = ""
): string {
  return [
    "  <url>",
    `    <loc>${esc(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>${extra}`,
    "  </url>",
  ].join("\n")
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/** UTC `YYYY-MM-DD` fallback when there are no recaps yet. */
function today(): string {
  return new Date().toISOString().slice(0, 10)
}
