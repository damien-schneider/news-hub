import {
  AiBrain01Icon,
  Calendar03Icon,
  ChartIncreaseIcon,
  ChartLineData01Icon,
  CheckListIcon,
  ChipIcon,
  CircleIcon,
  Robot01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * The recap categories. These mirror the 8 colour-coded sections of the source
 * newsletter digest. `accent` is a hex colour reused for chips and timeline
 * markers (applied with opacity so it reads in both light and dark themes).
 */
export interface CategoryMeta {
  slug: string
  label: string
  /** Short label for tight chip rows. */
  short: string
  accent: string
  /** Hugeicon shown as the section marker. */
  icon: IconSvgElement
}

export const CATEGORIES = {
  ia: {
    slug: "ia",
    label: "IA & LLMs",
    short: "IA",
    accent: "#e8593b",
    icon: AiBrain01Icon,
  },
  web: {
    slug: "web",
    label: "Web & Frontend",
    short: "Web",
    accent: "#d6a256",
    icon: SourceCodeIcon,
  },
  robotique: {
    slug: "robotique",
    label: "Robotique",
    short: "Robotique",
    accent: "#7bb99b",
    icon: Robot01Icon,
  },
  growth: {
    slug: "growth",
    label: "Marketing & Growth",
    short: "Growth",
    accent: "#c97bb4",
    icon: ChartIncreaseIcon,
  },
  productivite: {
    slug: "productivite",
    label: "Productivité & Org",
    short: "Produit",
    accent: "#b8a382",
    icon: CheckListIcon,
  },
  finance: {
    slug: "finance",
    label: "Finance & Marchés",
    short: "Finance",
    accent: "#7b9dc9",
    icon: ChartLineData01Icon,
  },
  hardware: {
    slug: "hardware",
    label: "Hardware & Santé",
    short: "Hardware",
    accent: "#9bae85",
    icon: ChipIcon,
  },
  evenements: {
    slug: "evenements",
    label: "Événements & Loisirs",
    short: "Événements",
    accent: "#e8c75c",
    icon: Calendar03Icon,
  },
} as const satisfies Record<string, CategoryMeta>

export type CategorySlug = keyof typeof CATEGORIES

/** Canonical display order. */
export const CATEGORY_ORDER: CategorySlug[] = [
  "ia",
  "web",
  "robotique",
  "growth",
  "productivite",
  "finance",
  "hardware",
  "evenements",
]

export function getCategory(slug: string): CategoryMeta {
  if (Object.prototype.hasOwnProperty.call(CATEGORIES, slug)) {
    return CATEGORIES[slug as CategorySlug]
  }
  return {
    slug,
    label: slug,
    short: slug,
    accent: "var(--muted-foreground)",
    icon: CircleIcon,
  }
}

/** Sort an arbitrary list of slugs by the canonical order. */
export function sortCategories(slugs: string[]): string[] {
  return [...slugs].sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a as CategorySlug) -
      CATEGORY_ORDER.indexOf(b as CategorySlug)
  )
}
