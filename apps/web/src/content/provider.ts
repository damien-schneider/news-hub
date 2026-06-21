import type { Digest, DigestSummary } from "./types"

/**
 * Storage-agnostic content contract. The MDX-on-disk implementation lives in
 * `mdx-provider.ts`; a future `convex-provider.ts` can satisfy the same
 * interface and be swapped in `index.ts` without touching the UI.
 */
export interface ContentProvider {
  /** All recaps, sorted newest first. */
  getDigests: () => Promise<DigestSummary[]>
  /** A single recap by its `date` slug, or null if not found. */
  getDigestByDate: (date: string) => Promise<Digest | null>
}
