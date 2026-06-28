import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"

import appCss from "@workspace/ui/globals.css?url"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteSidebar } from "@/components/layout/site-sidebar"
import { SearchProvider } from "@/components/search/search-context"
import type { Theme } from "@/components/theme/theme-provider"
import { ThemeProvider, themeScript } from "@/components/theme/theme-provider"
import { siteConfig } from "@/config/site"

const getThemeServerFn = createServerFn().handler(() => {
  return (getCookie("ui-theme") ?? "system") as Theme
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${siteConfig.name} — ${siteConfig.tagline}` },
      { name: "description", content: siteConfig.bio },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider initialTheme={theme}>
          <SearchProvider>
            <SiteSidebar />
            <div className="flex min-h-svh flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
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
