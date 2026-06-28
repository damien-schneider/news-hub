import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Reveal } from "@/components/motion/reveal"
import { FeaturedPosts } from "@/components/posts/featured-posts"
import { PostRow } from "@/components/posts/post-row"
import { siteConfig } from "@/config/site"
import { getDigests } from "@/content"

export const Route = createFileRoute("/")({
  loader: () => getDigests(),
  component: Home,
})

function Home() {
  const digests = Route.useLoaderData()
  const featured = digests.filter((digest) => digest.featured).slice(0, 3)
  const featuredDates = new Set(featured.map((digest) => digest.date))
  const recent = digests
    .filter((digest) => !featuredDates.has(digest.date))
    .slice(0, 8)

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

      {/* Links */}
      <Reveal delay={0.05} className="mt-14">
        <h2 className="font-heading text-2xl text-foreground">Liens</h2>
        <ul className="mt-4 space-y-2">
          {siteConfig.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
                className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-14 border-border/60 border-t" />

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
            {recent.map((digest) => (
              <PostRow key={digest.date} digest={digest} />
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
