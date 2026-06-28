import { HugeiconsIcon } from "@hugeicons/react"

import { Separator } from "@workspace/ui/components/separator"

import { siteConfig } from "@/config/site"

const YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-2xl px-4 pb-12 min-[1180px]:hidden">
      <Separator className="mb-6 bg-border/60" />
      <div className="flex flex-wrap items-center justify-between gap-3 text-muted-foreground text-sm">
        <span>
          © {YEAR} {siteConfig.name}
        </span>
        <div className="flex items-center gap-3">
          {siteConfig.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noreferrer noopener" : undefined
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
      </div>
    </footer>
  )
}
