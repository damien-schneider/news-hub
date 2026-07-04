import { Link } from "@tanstack/react-router"

import { RssSubscribe } from "@/components/layout/rss-subscribe"
import { SearchTrigger } from "@/components/search/search-trigger"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { siteConfig } from "@/config/site"

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Articles", to: "/posts" },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-3 min-[1180px]:hidden">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex flex-col leading-tight">
            <span className="font-semibold text-sm tracking-tight">
              {siteConfig.brand}
            </span>
            <span className="text-[11px] text-muted-foreground">
              by {siteConfig.name}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <SearchTrigger variant="icon" />
          <RssSubscribe variant="icon" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
