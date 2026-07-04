import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"

import { RssSubscribe } from "@/components/layout/rss-subscribe"
import { SearchTrigger } from "@/components/search/search-trigger"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { siteConfig } from "@/config/site"

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Articles", to: "/posts" },
] as const

const YEAR = new Date().getFullYear()

/**
 * Desktop-only navigation. Sits fixed in the left gutter beside the centered
 * reading column (which stays exactly viewport-centered), so it persists while
 * the article scrolls. Below the breakpoint, `SiteHeader` takes over.
 */
export function SiteSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[calc((100vw-680px)/2)] min-[1180px]:flex">
      <div className="ml-auto flex h-full w-[210px] flex-col py-14 pr-8 sm:py-16">
        {/* Brand */}
        <Link to="/" className="group mb-5 block leading-tight">
          <span className="font-semibold text-foreground text-lg tracking-tight transition-colors group-hover:text-muted-foreground">
            {siteConfig.brand}
          </span>
          <span className="mt-0.5 block text-muted-foreground text-xs">
            by {siteConfig.name}
          </span>
        </Link>

        {/* Global search */}
        <SearchTrigger />

        {/* Nav */}
        <nav className="mt-4 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer block, pinned to the bottom of the gutter */}
        <div className="mt-auto space-y-3 text-muted-foreground text-sm">
          <RssSubscribe />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {siteConfig.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  aria-label={link.label}
                  className="transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={link.icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </a>
              ))}
            </div>
            <ThemeToggle />
          </div>
          <span className="block text-xs">
            © {YEAR} {siteConfig.name}
          </span>
        </div>
      </div>
    </aside>
  )
}
