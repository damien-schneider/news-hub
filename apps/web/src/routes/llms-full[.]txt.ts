import { createFileRoute } from "@tanstack/react-router"

import { buildLlmsFull } from "@/content/llms"
import { resolveOrigin } from "@/lib/request-origin"

/** `/llms-full.txt` — the full corpus, item by item, for grounding answers. */
export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const body = buildLlmsFull(resolveOrigin(request))
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
