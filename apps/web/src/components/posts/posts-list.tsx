import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { Fragment, useRef } from "react"

import { PostRow } from "@/components/posts/post-row"
import type { DigestSummary } from "@/content"

/**
 * Below this count we render every row, so the full list stays in the SSR DOM
 * (good for SEO and the no-JS fallback). Past it, the page-scroll virtualizer
 * keeps the rendered DOM bounded no matter how many recaps pile up.
 */
const VIRTUALIZE_THRESHOLD = 50

export function PostsList({ digests }: { digests: DigestSummary[] }) {
  if (digests.length < VIRTUALIZE_THRESHOLD) {
    return (
      <>
        {digests.map((digest, i) => (
          <Fragment key={digest.date}>
            {i > 0 && (
              <div
                role="separator"
                className="my-px border-border border-t border-dashed"
              />
            )}
            <PostRow digest={digest} />
          </Fragment>
        ))}
      </>
    )
  }

  return <VirtualizedPostsList digests={digests} />
}

function VirtualizedPostsList({ digests }: { digests: DigestSummary[] }) {
  const listRef = useRef<HTMLDivElement>(null)

  const virtualizer = useWindowVirtualizer({
    count: digests.length,
    estimateSize: () => 73,
    overscan: 8,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  })

  return (
    <div
      ref={listRef}
      style={{ height: virtualizer.getTotalSize(), position: "relative" }}
    >
      {virtualizer.getVirtualItems().map((item) => {
        const digest = digests[item.index]
        const isLast = item.index === digests.length - 1

        return (
          <div
            key={digest.date}
            data-index={item.index}
            ref={virtualizer.measureElement}
            // PostRow has no divider of its own; draw the dashed separator on
            // the wrapper between rows — except after the real last row.
            className={
              isLast ? undefined : "border-border border-b border-dashed"
            }
            style={{
              position: "absolute",
              insetInlineStart: 0,
              top: 0,
              width: "100%",
              transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
            }}
          >
            <PostRow digest={digest} />
          </div>
        )
      })}
    </div>
  )
}
