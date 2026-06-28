import type { ReactNode } from "react"
import { isValidElement } from "react"

/**
 * Flatten a React subtree to its visible text. Used by the in-post search to
 * make a news item's rendered summary (paragraphs, lists, links, bold) matchable
 * without a parallel data source.
 */
export function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join(" ")
  if (isValidElement(node)) {
    return nodeText((node.props as { children?: ReactNode }).children)
  }
  return ""
}
