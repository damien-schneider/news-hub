import {
  getDigestComponent as mdxGetComponent,
  getDigestSummary as mdxGetSummary,
  mdxProvider,
} from "./mdx-provider"
import type { ContentProvider } from "./provider"

/**
 * Single swap point for the content backend. Today it is MDX files on disk;
 * later a `convexProvider` implementing the same `ContentProvider` interface
 * can replace this line with no UI changes.
 */
const provider: ContentProvider = mdxProvider

export const getDigests = () => provider.getDigests()
export const getDigestByDate = (date: string) => provider.getDigestByDate(date)

/** Serializable recap metadata for a single date (safe to return from loaders). */
export const getDigestSummary = mdxGetSummary
/** The non-serializable MDX body component — resolve inside the component. */
export const getDigestComponent = mdxGetComponent

export type { Digest, DigestSummary, NewsItem } from "./types"
