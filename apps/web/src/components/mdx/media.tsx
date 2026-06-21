import type { ComponentProps } from "react"

/** Markdown image (`![alt](src)`) → rounded, lazy, responsive. */
export function MdxImage(props: ComponentProps<"img">) {
  return (
    <img
      {...props}
      loading="lazy"
      className="my-3 w-full rounded-xl border border-border/70 bg-muted object-cover"
    />
  )
}

/** Explicit single image with optional caption. */
export function NewsImage({
  src,
  alt,
  caption,
}: {
  src: string
  alt?: string
  caption?: string
}) {
  return (
    <figure className="my-3">
      <img
        src={src}
        alt={alt ?? caption ?? ""}
        loading="lazy"
        className="w-full rounded-xl border border-border/70 bg-muted object-cover"
      />
      {caption ? (
        <figcaption className="mt-1.5 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

interface MediaItem {
  src: string
  alt?: string
  type?: "image" | "video"
}

/** Horizontal, snap-scrolling media strip (matches the timeline-feed look). */
export function Gallery({ items }: { items: MediaItem[] }) {
  return (
    <div className="my-3 flex snap-x snap-mandatory [scrollbar-width:none] gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,#000_88%,transparent)] pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <div
          key={item.src}
          className="relative aspect-[1.8/1] h-40 shrink-0 snap-start overflow-hidden rounded-lg border border-border/60 bg-muted"
        >
          {item.type === "video" ? (
            <video
              src={item.src}
              muted
              loop
              playsInline
              controls
              className="size-full object-cover"
            />
          ) : (
            <img
              src={item.src}
              alt={item.alt ?? ""}
              loading="lazy"
              className="size-full object-cover"
            />
          )}
        </div>
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
        <figcaption className="mt-1.5 text-xs text-muted-foreground">
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
