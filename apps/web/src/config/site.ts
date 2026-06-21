import { NewTwitterIcon, RssIcon, Mail01Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * Single edit point for personal branding. Replace the placeholders below with
 * your real name, bio, avatar and links.
 */
export const siteConfig = {
  name: "Damien Schneider",
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
    { label: "Twitter", href: "https://twitter.com/", icon: NewTwitterIcon },
    { label: "RSS", href: "/rss", icon: RssIcon },
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
