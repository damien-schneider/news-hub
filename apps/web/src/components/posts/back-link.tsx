import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router"
import type { LinkProps } from "@tanstack/react-router"

const className =
  "group inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"

function Icon() {
  return (
    <HugeiconsIcon
      icon={ArrowLeft01Icon}
      strokeWidth={2}
      className="size-4 transition-transform group-hover:-translate-x-0.5"
    />
  )
}

type BackLinkProps = {
  /** Where to go when there's no in-app history (cold load / deep link). */
  fallbackTo: LinkProps["to"]
  /** Label for the fallback link. */
  fallbackLabel: string
}

/**
 * Step back through real history when the user arrived from another page, so the
 * back affordance returns them where they came from instead of always jumping
 * to a fixed parent. Falls back to a plain link on a cold/deep-link load where
 * there's no in-app history.
 */
export function BackLink({ fallbackTo, fallbackLabel }: BackLinkProps) {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  if (canGoBack) {
    return (
      <button
        type="button"
        onClick={() => router.history.back()}
        className={className}
      >
        <Icon />
        Retour
      </button>
    )
  }

  return (
    <Link to={fallbackTo} className={className}>
      <Icon />
      {fallbackLabel}
    </Link>
  )
}
