import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"

import { ScrollArea } from "@workspace/ui/components/scroll-area"
import appCss from "@workspace/ui/globals.css?url"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteSidebar } from "@/components/layout/site-sidebar"
import { SearchProvider } from "@/components/search/search-context"
import type { Theme } from "@/components/theme/theme-provider"
import { ThemeProvider, themeScript } from "@/components/theme/theme-provider"
import { siteConfig } from "@/config/site"
import { absoluteImage, absoluteUrl, siteJsonLd } from "@/lib/seo"

const getThemeServerFn = createServerFn().handler(() => {
  return (getCookie("ui-theme") ?? "system") as Theme
})

/**
 * Site-wide defaults. Every concrete route ships its own `seo()` head (title,
 * description, canonical, og:*), which overrides what is set here by meta
 * attribute — so this block is the safety net for any context that doesn't
 * (404, server routes) plus the tags that are identical on every page: the
 * `WebSite`/`Person` graph (the author/E-E-A-T signal the personal-brand play
 * depends on) and the RSS discovery link. Canonical is deliberately NOT set
 * here — a page must never emit two competing `<link rel="canonical">`.
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: siteConfig.seoTitle },
      { name: "description", content: siteConfig.seoDescription },
      { name: "author", content: siteConfig.name },
      { name: "keywords", content: siteConfig.keywords.join(", ") },
      { name: "generator", content: "TanStack Start" },
      {
        name: "robots",
        content:
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      // Open Graph (site default)
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteConfig.brand },
      { property: "og:locale", content: siteConfig.locale },
      { property: "og:title", content: siteConfig.seoTitle },
      { property: "og:description", content: siteConfig.seoDescription },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:image", content: absoluteImage() },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: siteConfig.brand },
      // Twitter / X (site default)
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.seoTitle },
      { name: "twitter:description", content: siteConfig.seoDescription },
      { name: "twitter:image", content: absoluteImage() },
      // Structured data
      { "script:ld+json": siteJsonLd() },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: `${siteConfig.brand} — RSS`,
        href: "/rss",
      },
      {
        rel: "alternate",
        type: "text/plain",
        title: `${siteConfig.brand} — llms.txt`,
        href: "/llms.txt",
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()
  // Explicit dark renders the class server-side (zero flash without JS); the
  // inline script below resolves the `system` case before paint.
  const htmlClass = theme === "dark" ? "dark" : ""

  return (
    <html lang="fr" className={htmlClass} suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Static, site-wide head: icons, PWA manifest and theme-color. Placed
            as raw JSX (not via `head()` meta) so the two media-scoped
            theme-color tags survive — TanStack dedupes meta by `name`, which
            would otherwise collapse them to one. */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content={siteConfig.themeColor.light}
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content={siteConfig.themeColor.dark}
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider initialTheme={theme}>
          <SearchProvider>
            <SiteSidebar />
            {/* Page scrolls inside this ScrollArea; its overlay scrollbar never
                reserves gutter width, so the layout width stays constant whether
                or not content overflows, and the masked edges fade clipped
                content. The sticky header rides inside the scroll viewport. */}
            <ScrollArea className="h-svh" mask={{ top: false }}>
              <div className="flex min-h-svh flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </ScrollArea>
          </SearchProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-heading font-semibold text-5xl">404</p>
      <p className="mt-3 text-muted-foreground">
        Cette page n'existe pas (ou plus).
      </p>
      <Link
        to="/"
        className="mt-6 inline-block font-medium text-sm underline underline-offset-4"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
