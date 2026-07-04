import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Fragment } from "react"
import { Reveal } from "@/components/motion/reveal"
import { FeaturedPosts } from "@/components/posts/featured-posts"
import { PostRow } from "@/components/posts/post-row"
import { siteConfig } from "@/config/site"
import { getDigests } from "@/content"
import { absoluteUrl, seo } from "@/lib/seo"

export const Route = createFileRoute("/")({
  loader: () => getDigests(),
  head: ({ loaderData }) => {
    const digests = loaderData ?? []
    // A CollectionPage whose ItemList points at the most recent recaps gives
    // crawlers (and AI answer engines) the freshest entry points up front.
    const collection = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteConfig.url}/#home`,
      url: absoluteUrl("/"),
      name: siteConfig.brand,
      description: siteConfig.seoDescription,
      inLanguage: siteConfig.lang,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#person` },
      mainEntity: {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: digests.length,
        itemListElement: digests.slice(0, 10).map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(`/posts/${d.date}`),
          name: d.title,
        })),
      },
    }
    return seo({
      title: siteConfig.seoTitle,
      description: siteConfig.seoDescription,
      path: "/",
      type: "website",
      jsonLd: [collection],
    })
  },
  component: Home,
})

function Home() {
  const digests = Route.useLoaderData()
  // "À la une" = the freshest recaps that carry a headline `highlight`.
  const featured = digests.filter((digest) => digest.highlight).slice(0, 3)
  // The feed lists the latest recaps in full — featured ones included, so
  // nothing silently drops out of "Derniers articles".
  const recent = digests.slice(0, 8)

  return (
    <div className="mx-auto max-w-[680px] px-5 py-14 sm:py-20">
      {/* Intro */}
      <Reveal className="space-y-4">
        <h1 className="flex items-center gap-2 font-heading text-[28px] text-foreground leading-none">
          Bienvenue <span className="text-2xl">👋</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {siteConfig.bio}
        </p>
      </Reveal>

      {/* Featured */}
      {featured.length > 0 && (
        <Reveal delay={0.05} className="mt-14">
          <h2 className="font-heading text-2xl text-foreground">À la une</h2>
          <div className="mt-5">
            <FeaturedPosts digests={featured} />
          </div>
        </Reveal>
      )}

      {/* New posts */}
      <Reveal delay={0.05} className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl text-foreground">
            Derniers articles
          </h2>
          <Link
            to="/posts"
            className="group inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Tous les articles
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="mt-3">
            {recent.map((digest, i) => (
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
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground text-sm">
            Aucun article pour le moment.
          </p>
        )}
      </Reveal>
    </div>
  )
}
