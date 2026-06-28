import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { MDXProvider } from "@mdx-js/react"
import {
  createFileRoute,
  Link,
  notFound,
  useLocation,
} from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { FilterProvider, mdxComponents } from "@/components/mdx"
import { Reveal } from "@/components/motion/reveal"
import { CategoryFilter } from "@/components/posts/category-filter"
import { PostSearch } from "@/components/posts/post-search"
import { getDigestComponent, getDigestItems, getDigestSummary } from "@/content"
import { formatDate } from "@/lib/format"
import { queryMatches } from "@/lib/slug"

export const Route = createFileRoute("/posts/$date")({
  loader: async ({ params }) => {
    const summary = await getDigestSummary(params.date)
    if (!summary) throw notFound()
    return { summary, items: getDigestItems(params.date) }
  },
  component: DigestPage,
})

function DigestPage() {
  const { summary, items } = Route.useLoaderData()
  const { date } = Route.useParams()
  const { hash } = useLocation()
  const Body = getDigestComponent(date)
  const [active, setActive] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [highlight, setHighlight] = useState<string | null>(null)

  const searching = query.trim() !== ""
  // Mirror NewsItem's match so the count + empty state stay in sync with the
  // cards that actually render. Title + tags + summary cover the same fields.
  const matchCount = useMemo(
    () =>
      items.filter((item) =>
        queryMatches(
          [item.title, item.tags.join(" "), item.summary].join(" "),
          query
        )
      ).length,
    [items, query]
  )

  // Deep-link from global search: scroll the targeted item into view and flash
  // its ring once the body has rendered. Retries briefly because the post can
  // fall back to client rendering, where the element appears a beat late.
  useEffect(() => {
    const id = hash.replace(/^#/, "")
    if (!id) {
      setHighlight(null)
      return
    }
    let tries = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    const attempt = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        setHighlight(id)
        timers.push(setTimeout(() => setHighlight(null), 2400))
      } else if (tries++ < 20) {
        timers.push(setTimeout(attempt, 100))
      }
    }
    timers.push(setTimeout(attempt, 80))
    return () => timers.forEach(clearTimeout)
  }, [hash])

  return (
    <>
      {/* Desktop: filters pinned in the right gutter, beside the column */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[calc((100vw-680px)/2)] min-[1180px]:flex">
        <div className="mr-auto flex h-full w-[230px] flex-col py-14 pl-8 sm:py-16">
          <PostSearch value={query} onChange={setQuery} className="mb-6" />
          <p className="mb-3 font-medium text-muted-foreground/70 text-xs uppercase tracking-wide">
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
            className="group inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-4 transition-transform group-hover:-translate-x-0.5"
            />
            Articles
          </Link>

          <h1 className="mt-5 font-heading text-[32px] text-foreground leading-[1.1]">
            {summary.title}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            <time dateTime={summary.date}>{formatDate(summary.date)}</time>
            <span className="mx-1.5">·</span>
            {searching
              ? `${matchCount} résultat${matchCount > 1 ? "s" : ""}`
              : `${summary.sourceCount} brèves`}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {summary.lede}
          </p>
        </Reveal>

        {/* Filter bar (sticky under the header) — desktop uses the gutter */}
        <div className="sticky top-14 z-30 -mx-5 mt-8 space-y-3 border-border/60 border-b bg-background/85 px-5 py-3 backdrop-blur-xl min-[1180px]:hidden">
          <PostSearch value={query} onChange={setQuery} />
          <CategoryFilter
            categories={summary.categories}
            active={active}
            onChange={setActive}
          />
        </div>

        {/* Timeline of cards */}
        <div className="mt-6">
          {searching && matchCount === 0 ? (
            <p className="py-10 text-center text-muted-foreground text-sm">
              Aucune brève ne correspond à «&nbsp;{query.trim()}&nbsp;».
            </p>
          ) : null}
          {Body ? (
            <FilterProvider
              active={active}
              setActive={setActive}
              query={query}
              setQuery={setQuery}
              highlight={highlight}
            >
              <MDXProvider components={mdxComponents}>
                <Body />
              </MDXProvider>
            </FilterProvider>
          ) : (
            <p className="text-muted-foreground text-sm">
              Contenu indisponible.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
