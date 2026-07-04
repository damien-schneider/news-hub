import type { ComponentProps } from "react"
import { useState } from "react"
import { ZoomImage } from "./zoom-image"

/** Markdown image (`![alt](src)`) → rounded, lazy, responsive, click-to-zoom. */
export function MdxImage({ src, alt }: ComponentProps<"img">) {
  if (typeof src !== "string") return null
  return (
    <ZoomImage
      src={src}
      alt={typeof alt === "string" ? alt : undefined}
      className="my-3 w-full rounded-xl border border-border/70 bg-muted object-cover"
    />
  )
}

/** Explicit single image with optional caption. Click to view full-screen; disappears if it fails. */
export function NewsImage({
  src,
  alt,
  caption,
}: {
  src: string
  alt?: string
  caption?: string
}) {
  if (!src) return null
  return (
    <ZoomImage
      src={src}
      alt={alt}
      caption={caption}
      className="w-full rounded-xl border border-border/70 bg-muted object-cover"
    />
  )
}

interface MediaItem {
  src: string
  alt?: string
  type?: "image" | "video"
}

/** A single gallery cell that drops out of the strip if its media fails to load. */
function GalleryCell({ item }: { item: MediaItem }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <div className="relative aspect-[1.8/1] h-40 shrink-0 snap-start overflow-hidden rounded-lg border border-border/60 bg-muted">
      {item.type === "video" ? (
        <video
          src={item.src}
          muted
          loop
          playsInline
          controls
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <ZoomImage
          src={item.src}
          alt={item.alt}
          onError={() => setFailed(true)}
          triggerClassName="size-full"
          className="size-full object-cover"
        />
      )}
    </div>
  )
}

/** Horizontal, snap-scrolling media strip (matches the timeline-feed look). */
export function Gallery({ items }: { items: MediaItem[] }) {
  return (
    <div className="my-3 flex snap-x snap-mandatory gap-1.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,#000_88%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <GalleryCell key={item.src} item={item} />
      ))}
    </div>
  )
}

function youtubeId(url: string): string | null {
  const match =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/.exec(url)
  return match ? match[1] : null
}

/** Video player. YouTube/youtu.be URLs become an embed; everything else is a native player. */
export function Video({
  src,
  poster,
  caption,
}: {
  src: string
  poster?: string
  caption?: string
}) {
  const id = youtubeId(src)
  return (
    <figure className="my-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border/70 bg-muted">
        {id ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title={caption ?? "Vidéo"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <video
            src={src}
            poster={poster}
            controls
            playsInline
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-1.5 text-muted-foreground text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/** Generic responsive iframe embed (tweets, codepens, maps…). */
export function Embed({
  src,
  title,
  ratio = "16 / 9",
}: {
  src: string
  title?: string
  ratio?: string
}) {
  return (
    <figure className="my-3">
      <div
        className="relative overflow-hidden rounded-xl border border-border/70 bg-muted"
        style={{ aspectRatio: ratio }}
      >
        <iframe
          src={src}
          title={title ?? "Embed"}
          loading="lazy"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    </figure>
  )
}
