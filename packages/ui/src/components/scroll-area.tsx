import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "@workspace/ui/lib/utils"

export type MaskSides = {
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
  /** Shorthand: sets both `left` and `right`. Per-side keys override. */
  x?: boolean
  /** Shorthand: sets both `top` and `bottom`. Per-side keys override. */
  y?: boolean
}

/**
 * - `true` (default): fade the top/bottom edges while content is clipped there.
 * - `false`: no fade.
 * - object: per-side override on top of the vertical default.
 */
export type ScrollAreaMask = boolean | MaskSides

type ResolvedMask = { top: boolean; bottom: boolean; left: boolean; right: boolean }

function resolveMask(mask: ScrollAreaMask): ResolvedMask {
  if (mask === false) return { top: false, bottom: false, left: false, right: false }

  // Default to a vertical fade — matches the single overlay vertical scrollbar.
  const sides: ResolvedMask = { top: true, bottom: true, left: false, right: false }
  if (mask === true) return sides

  if (mask.y !== undefined) {
    sides.top = mask.y
    sides.bottom = mask.y
  }
  if (mask.x !== undefined) {
    sides.left = mask.x
    sides.right = mask.x
  }
  if (mask.top !== undefined) sides.top = mask.top
  if (mask.bottom !== undefined) sides.bottom = mask.bottom
  if (mask.left !== undefined) sides.left = mask.left
  if (mask.right !== undefined) sides.right = mask.right

  return sides
}

/** Base UI sets `data-overflow-{x,y}-{start,end}` on the viewport when content is
 * clipped on that edge, so the fade only shows while there's more to scroll. */
function maskClasses(sides: ResolvedMask) {
  return cn(
    sides.top && "data-[overflow-y-start]:mask-t-from-[calc(100%-2rem)]",
    sides.bottom && "data-[overflow-y-end]:mask-b-from-[calc(100%-2rem)]",
    sides.left && "data-[overflow-x-start]:mask-l-from-[calc(100%-2rem)]",
    sides.right && "data-[overflow-x-end]:mask-r-from-[calc(100%-2rem)]"
  )
}

/** Custom scroll container (Base UI). The scrollbar is overlaid, so it never
 * reserves layout width — the content keeps the same width whether or not it
 * overflows. `overscroll-contain` on the viewport kills the macOS rubber-band /
 * scroll-chaining, so a fixed background behind a transparent viewport never
 * appears to "move" when you reach the end. */
function ScrollArea({
  className,
  children,
  mask = true,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /** Fade content at the edges where it's clipped by overflow. Defaults to the vertical axis. */
  mask?: ScrollAreaMask
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full overscroll-contain rounded-[inherit] outline-none",
          maskClasses(resolveMask(mask))
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "z-20 flex touch-none select-none p-px opacity-0 transition-opacity delay-150 data-[hovering]:opacity-100 data-[scrolling]:opacity-100 data-[hovering]:delay-0 data-[scrolling]:delay-0",
        orientation === "vertical" && "h-full w-2",
        orientation === "horizontal" && "h-2 w-full flex-col",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-foreground/25"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
