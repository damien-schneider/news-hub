import {
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * Single edit point for personal branding. Replace the placeholders below with
 * your real name, bio, avatar and links.
 */
export const siteConfig = {
  /** Visible wordmark / site brand. */
  brand: "Daily News",
  /** Author / person behind the site — the winnable SEO keyword. */
  name: "Damien Schneider",
  /** Public origin, no trailing slash. Set via `VITE_SITE_URL`. */
  url: (
    import.meta.env.VITE_SITE_URL ?? "https://news.damien-schneider.pro"
  ).replace(/\/$/, ""),
  /** BCP-47 content language and OG locale (the site is authored in French). */
  locale: "fr_FR",
  lang: "fr",
  /** Keyword-rich `<title>` for the home page (keep ~60 chars). */
  seoTitle:
    "Daily News — la veille IA, web, finance & robotique par Damien Schneider",
  /** Keyword-rich meta description (~155 chars). */
  seoDescription:
    "La veille quotidienne de Damien Schneider : l'actualité IA, web, finance, robotique et growth qui compte, condensée et classée par jour.",
  /** Free-form keyword hints (low SEO weight today, but cheap and harmless). */
  keywords: [
    "veille technologique",
    "actualité IA",
    "intelligence artificielle",
    "LLM",
    "web",
    "frontend",
    "finance",
    "robotique",
    "growth",
    "récapitulatif quotidien",
    "Damien Schneider",
  ],
  /** Default social-share image (1200×630), resolved to an absolute URL. */
  ogImage: "/og.png",
  /** First day the digest went live — feeds the Person/WebSite founding date. */
  foundingDate: "2026-05-09",
  /** `<meta name="theme-color">` for light / dark (matches the CSS palette). */
  themeColor: { light: "#edecea", dark: "#171616" },
  /** Short role shown under the name. */
  role: "Veille quotidienne",
  /** One-to-two sentence intro on the home page. */
  bio: "Je trie l'actualité qui compte — IA, web, finance et plus — et la republie ici, condensée et classée par jour.",
  /** Tagline under the avatar in the header. */
  tagline: "L'actu, triée par jour.",
  /** Avatar image URL (or leave empty to show initials). */
  avatar: "" as string,
  /** Email used by the (decorative) contact affordance. */
  email: "damien.schneider01@gmail.com",
  links: [
    { label: "Twitter", href: "https://x.com/damien_schneid", icon: NewTwitterIcon },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/schneider-damien/",
      icon: Linkedin01Icon,
    },
    {
      label: "Email",
      href: "mailto:damien.schneider01@gmail.com",
      icon: Mail01Icon,
    },
  ] satisfies { label: string; href: string; icon: IconSvgElement }[],
} as const

/** Initials fallback for the avatar. */
export function siteInitials(): string {
  return siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
