import { createFileRoute } from "@tanstack/react-router"

import { buildLlmsIndex } from "@/content/llms"
import { resolveOrigin } from "@/lib/request-origin"

/** `/llms.txt` — the GEO index (llmstxt.org convention). */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const body = buildLlmsIndex(resolveOrigin(request))
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=0, s-maxage=3600",
          },
        })
      },
    },
  },
})
