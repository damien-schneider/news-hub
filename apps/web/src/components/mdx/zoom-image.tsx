import { cn } from "@workspace/ui/lib/utils"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { useEffect, useId, useState } from "react"
import { createPortal } from "react-dom"
import { EASE } from "@/components/motion/reveal"

interface ZoomImageProps {
  src: string
  alt?: string
  caption?: string
  /** Classes for the `<img>` itself (rounding, object-fit, size). */
  className?: string
  /** Classes for the clickable wrapper (defaults to `block`). */
  triggerClassName?: string
  /** Called once if the image fails to load, so a parent can hide its frame. */
  onError?: () => void
}

const SPRING = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 } as const

/**
 * A content image that morphs full-screen on click and removes itself if the
 * source fails to load. Shared by covers, inline `<NewsImage>` and galleries.
 *
 * The expand is a framer-motion shared-layout transition: the thumbnail and the
 * full-screen image share a `layoutId`, so the image flies from its place in the
 * card to the centre of the viewport (and back on close) while the backdrop
 * fades via `AnimatePresence`. The overlay is rendered through a portal on
 * `document.body` — news items live inside a framer-motion subtree whose
 * `transform` would otherwise become the containing block for `position: fixed`,
 * clipping the lightbox to the card.
 */
export function ZoomImage({
  src,
  alt,
  caption,
  className,
  triggerClassName,
  onError,
}: ZoomImageProps) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const layoutId = useId()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (failed) return null

  const label = alt ?? caption ?? "image"

  // Thumbnail is unmounted while open so the same layoutId can morph to the
  // full-screen copy (and back when it remounts on close).
  const thumbnail = !open ? (
    <button
      type="button"
      aria-label={`Agrandir : ${label}`}
      onClick={() => setOpen(true)}
      className={cn("block cursor-zoom-in", triggerClassName)}
    >
      <motion.img
        layoutId={layoutId}
        src={src}
        alt={alt ?? caption ?? ""}
        loading="lazy"
        transition={SPRING}
        onError={() => {
          setFailed(true)
          onError?.()
        }}
        className={className}
      />
    </button>
  ) : null

  const overlay = mounted
    ? createPortal(
        <AnimatePresence>
          {open ? (
            <motion.div
              key="zoom-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={label}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/85 p-4 backdrop-blur-sm sm:p-8"
            >
              <motion.img
                layoutId={layoutId}
                src={src}
                alt={alt ?? caption ?? ""}
                transition={SPRING}
                onClick={(event) => {
                  event.stopPropagation()
                  setOpen(false)
                }}
                className="max-h-[88vh] max-w-[94vw] cursor-zoom-out rounded-lg object-contain shadow-2xl"
              />
              {caption ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE, delay: 0.05 }}
                  className="max-w-[70ch] text-center text-sm text-white/70"
                >
                  {caption}
                </motion.p>
              ) : null}
              <motion.button
                type="button"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
              >
                ✕
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )
    : null

  return (
    <LayoutGroup>
      {caption ? (
        <figure className="my-3">
          {thumbnail}
          <figcaption className="mt-1.5 text-muted-foreground text-xs">
            {caption}
          </figcaption>
        </figure>
      ) : (
        thumbnail
      )}
      {overlay}
    </LayoutGroup>
  )
}
