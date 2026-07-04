import { createFileRoute } from "@tanstack/react-router"
import { Reveal } from "@/components/motion/reveal"
import { BackLink } from "@/components/posts/back-link"
import { PostsList } from "@/components/posts/posts-list"
import { siteConfig } from "@/config/site"
import { getDigests } from "@/content"
import { absoluteUrl, breadcrumbJsonLd, seo } from "@/lib/seo"

const TITLE = `Tous les récapitulatifs — ${siteConfig.brand}`
const DESCRIPTION =
  "L'archive complète des récapitulatifs quotidiens : IA, web, finance, robotique et growth, du plus récent au plus ancien."

export const Route = createFileRoute("/posts/")({
  loader: () => getDigests(),
  head: ({ loaderData }) => {
    const digests = loaderData ?? []
    const collection = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteConfig.url}/posts/#collection`,
      url: absoluteUrl("/posts"),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: siteConfig.lang,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: digests.length,
        itemListElement: digests.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(`/posts/${d.date}`),
          name: d.title,
        })),
      },
    }
    return seo({
      title: TITLE,
      description: DESCRIPTION,
      path: "/posts",
      type: "website",
      jsonLd: [
        collection,
        breadcrumbJsonLd([
          ["Accueil", "/"],
          ["Récapitulatifs", "/posts"],
        ]),
      ],
    })
  },
  component: PostsPage,
})

function PostsPage() {
  const digests = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-[680px] px-5 py-14 sm:py-20">
      <Reveal>
        <BackLink fallbackTo="/" fallbackLabel="Accueil" />

        <h1 className="mt-5 font-heading text-[28px] text-foreground leading-none">
          Tous les articles
        </h1>
        <p className="mt-3 text-muted-foreground">
          {digests.length} récapitulatif{digests.length > 1 ? "s" : ""}, du plus
          récent au plus ancien.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        {digests.length > 0 ? (
          <PostsList digests={digests} />
        ) : (
          <p className="text-muted-foreground text-sm">
            Aucun article pour le moment.
          </p>
        )}
      </Reveal>
    </div>
  )
}
