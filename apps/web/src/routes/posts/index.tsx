import { createFileRoute } from "@tanstack/react-router"

import { getDigests } from "@/content"
import { PostRow } from "@/components/posts/post-row"
import { Reveal } from "@/components/motion/reveal"

export const Route = createFileRoute("/posts/")({
  loader: () => getDigests(),
  component: PostsPage,
})

function PostsPage() {
  const digests = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-[680px] px-5 py-14 sm:py-20">
      <Reveal>
        <h1 className="font-heading text-[28px] leading-none text-foreground">
          Tous les articles
        </h1>
        <p className="mt-3 text-muted-foreground">
          {digests.length} récapitulatif{digests.length > 1 ? "s" : ""}, du plus
          récent au plus ancien.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        {digests.length > 0 ? (
          digests.map((digest) => <PostRow key={digest.date} digest={digest} />)
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun article pour le moment.
          </p>
        )}
      </Reveal>
    </div>
  )
}
