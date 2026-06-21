import { useState } from "react"
import { createFileRoute, notFound, Link } from "@tanstack/react-router"
import { MDXProvider } from "@mdx-js/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

import { getDigestComponent, getDigestSummary } from "@/content"
import { formatDate } from "@/lib/format"
import { FilterProvider, mdxComponents } from "@/components/mdx"
import { CategoryFilter } from "@/components/posts/category-filter"
import { Reveal } from "@/components/motion/reveal"

export const Route = createFileRoute("/posts/$date")({
  loader: async ({ params }) => {
    const summary = await getDigestSummary(params.date)
    if (!summary) throw notFound()
    return summary
  },
  component: DigestPage,
})

function DigestPage() {
  const summary = Route.useLoaderData()
  const { date } = Route.useParams()
  const Body = getDigestComponent(date)
  const [active, setActive] = useState<string | null>(null)

  return (
    <>
      {/* Desktop: category filter pinned in the right gutter, beside the column */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[calc((100vw-680px)/2)] min-[1180px]:flex">
        <div className="mr-auto flex h-full w-[220px] flex-col py-14 pl-8 sm:py-16">
          <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
            Catégories
          </p>
          <CategoryFilter
            categories={summary.categories}
            active={active}
            onChange={setActive}
            orientation="vertical"
          />
        </div>
      </aside>

      <div className="mx-auto max-w-[680px] px-5 py-14 sm:py-20">
        {/* Recap header */}
        <Reveal>
          <Link
            to="/posts"
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-4 transition-transform group-hover:-translate-x-0.5"
            />
            Articles
          </Link>

          <h1 className="mt-5 font-heading text-[32px] leading-[1.1] text-foreground">
            {summary.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <time dateTime={summary.date}>{formatDate(summary.date)}</time>
            <span className="mx-1.5">·</span>
            {summary.sourceCount} brèves
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {summary.lede}
          </p>
        </Reveal>

        {/* Category filter (sticky under the header bar) — desktop uses the gutter */}
        <div className="sticky top-14 z-30 -mx-5 mt-8 border-b border-border/60 bg-background/85 px-5 py-3 backdrop-blur-xl min-[1180px]:hidden">
          <CategoryFilter
            categories={summary.categories}
            active={active}
            onChange={setActive}
          />
        </div>

        {/* Timeline of cards */}
        <div className="mt-6">
          {Body ? (
            <FilterProvider active={active} setActive={setActive}>
              <MDXProvider components={mdxComponents}>
                <Body />
              </MDXProvider>
            </FilterProvider>
          ) : (
            <p className="text-sm text-muted-foreground">
              Contenu indisponible.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
