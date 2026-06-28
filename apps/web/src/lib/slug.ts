/**
 * Text helpers shared by search (global + in-post) and news-item anchors.
 * Accent-insensitive so a query like "hermes" matches "Hermès" — the content is
 * French, so diacritics must never gate a match.
 */

const DIACRITICS = /[̀-ͯ]/g

/** Lowercase + strip diacritics. "Hermès" → "hermes". */
export function normalizeText(input: string): string {
  return input.normalize("NFD").replace(DIACRITICS, "").toLowerCase()
}

/** "Hermès : le luxe" → "hermes-le-luxe". Stable id for deep-link anchors. */
export function slugify(input: string): string {
  return normalizeText(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * AND token match, accent- and case-insensitive: every whitespace-separated
 * token of `query` must appear somewhere in `haystack`. Empty query → matches.
 */
export function queryMatches(haystack: string, query: string): boolean {
  const q = normalizeText(query).trim()
  if (!q) return true
  const h = normalizeText(haystack)
  return q.split(/\s+/).every((token) => h.includes(token))
}
