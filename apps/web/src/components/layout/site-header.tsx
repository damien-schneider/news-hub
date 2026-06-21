import { Link } from "@tanstack/react-router"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"

import { siteConfig, siteInitials } from "@/config/site"
import { ThemeToggle } from "@/components/theme/theme-toggle"

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Articles", to: "/posts" },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl min-[1180px]:hidden">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Avatar size="sm">
            {siteConfig.avatar ? (
              <AvatarImage src={siteConfig.avatar} alt={siteConfig.name} />
            ) : null}
            <AvatarFallback>{siteInitials()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{siteConfig.name}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
