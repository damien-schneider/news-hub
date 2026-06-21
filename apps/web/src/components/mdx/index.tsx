import type { ComponentProps } from "react"

import { Category } from "./category"
import { NewsItem } from "./news-item"
import { Source } from "./source"
import { Embed, Gallery, MdxImage, NewsImage, Video } from "./media"
import { Tweet } from "./tweet"

function isExternal(href: string | undefined): boolean {
  return Boolean(href && /^https?:\/\//.test(href))
}

/**
 * Components made available to every digest `.mdx` file via <MDXProvider>.
 * Custom components drive the timeline + media; the intrinsic-element overrides
 * keep any inline prose, links and images inside a news item summary on-brand.
 */
export const mdxComponents = {
  // Timeline structure
  Category,
  NewsItem,
  Source,
  // Media (images / galleries / video / tweets / embeds)
  NewsImage,
  Gallery,
  Video,
  Tweet,
  Embed,
  img: MdxImage,
  // Inline prose
  a: (props: ComponentProps<"a">) => (
    <a
      {...props}
      target={isExternal(props.href) ? "_blank" : undefined}
      rel={isExternal(props.href) ? "noreferrer noopener" : undefined}
      className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:decoration-foreground"
    />
  ),
  p: (props: ComponentProps<"p">) => <p {...props} className="m-0" />,
  strong: (props: ComponentProps<"strong">) => (
    <strong {...props} className="font-semibold text-foreground" />
  ),
  em: (props: ComponentProps<"em">) => (
    <em {...props} className="text-muted-foreground" />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul {...props} className="mt-1 list-disc space-y-0.5 ps-5" />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      {...props}
      className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
    />
  ),
}

export { Category, NewsItem, Source }
export { Embed, Gallery, NewsImage, Video } from "./media"
export { Tweet } from "./tweet"
export { FilterProvider, useFilter } from "./filter-context"
