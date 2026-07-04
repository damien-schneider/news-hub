import { createFileRoute } from "@tanstack/react-router"

import { resolveOrigin } from "@/lib/request-origin"

/**
 * `robots.txt` served dynamically so the `Sitemap:` line always points at the
 * host actually being crawled (no hard-coded domain to drift). Everything is
 * allowed — including AI answer-engine crawlers, which are named explicitly so
 * the intent ("yes, train/answer on this") is unambiguous rather than relying
 * on the wildcard. The `llms.txt` pointer is a hint for GEO-aware fetchers.
 */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = resolveOrigin(request)
        const aiBots = [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Bytespider",
          "CCBot",
          "Amazonbot",
          "cohere-ai",
        ]
        const body = [
          "# https://www.robotstxt.org/robotstxt.html",
          "User-agent: *",
          "Allow: /",
          "",
          "# AI crawlers & answer engines — explicitly welcomed (GEO).",
          ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, "Allow: /"]),
          "",
          `# LLM-friendly index: ${origin}/llms.txt`,
          `Sitemap: ${origin}/sitemap.xml`,
          "",
        ].join("\n")

        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=0, s-maxage=86400",
          },
        })
      },
    },
  },
})
