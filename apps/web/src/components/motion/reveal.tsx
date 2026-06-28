import type { HTMLMotionProps } from "motion/react"
import { motion } from "motion/react"

/** Shared easing — a soft "Framer" ease-out for smooth, modern motion. */
export const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Fade + rise into view on scroll (once). Use `delay` to stagger siblings.
 * Falls back to fully visible if JS never runs (content is still in the DOM).
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
