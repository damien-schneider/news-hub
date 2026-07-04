/**
 * Public origin for a request, honouring reverse-proxy headers so generated
 * absolute URLs (sitemap, llms.txt, robots) advertise the real host rather than
 * `localhost` — identical behaviour to the RSS feed, in one place.
 */
export function resolveOrigin(request: Request): string {
  const url = new URL(request.url)
  const host = request.headers.get("x-forwarded-host") ?? url.host
  const proto =
    request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
  return `${proto}://${host}`
}
