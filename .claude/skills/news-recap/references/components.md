# MDX components reference

All components are auto-injected (no imports in the `.mdx` file). They are defined
in `apps/web/src/components/mdx/`. Authored content goes inside `<NewsItem>` children.

## Table of contents
- Structure: `<Category>`, `<NewsItem>`, `<Source>`
- Media: `<NewsImage>`, `<Gallery>`, `<Video>`, `<Tweet>`, `<Embed>`, markdown images
- Inline: links, emphasis, code, lists
- MDX gotchas (escaping)

---

## `<Category slug="…" />`

Section divider. Place one before the first item of each category. The slug must
be one of the 8 (see SKILL.md). Render order should follow the canonical order.

```mdx
<Category slug="finance" />
```

## `<NewsItem>`

One news card. Props:

| Prop | Type | Notes |
|------|------|-------|
| `title` | string (required) | Short, factual headline. |
| `category` | slug (required) | Must match a `<Category slug>` above it — drives the filter. |
| `tags` | `string[]` | 1–3 short lowercase tags. Rendered as `#tag, #tag`. |
| `sources` | `{ label: string; url?: string }[]` | Real attribution. Prefer `url`. |
| `image` | string (URL) | Cover image at the top of the card, clickable to the first source. Use the **primary source's `og:image`** (see below). Expected on every standalone card. |
| `imageAlt` | string | Alt text for the cover (defaults to `title`). |
| children | MDX | 1–3 sentence summary + optional media. |

```mdx
<NewsItem
  title="Anthropic lève à 350 Md$"
  category="finance"
  tags={["levée", "anthropic"]}
  sources={[
    { label: "The Information", url: "https://www.theinformation.com/articles/…" },
    { label: "Bloomberg", url: "https://www.bloomberg.com/news/…" },
  ]}
  image="https://www.theinformation.com/og/anthropic-350b.jpg"
  imageAlt="Logo Anthropic"
>
La levée valorise Anthropic à 350 Md$, soit 3× son tour précédent. Le tour est mené par un fonds souverain.
</NewsItem>
```

Summary writing: lead with the fact, then the number/why. No preamble. Concrete
figures over adjectives. 1–3 sentences max.

### Cover image (`image=`) — pull the `og:image`

Most article, paper, company and repo pages expose an `og:image` (or
`twitter:image`) meta tag — a stable, hotlink-friendly preview. That is the
cover for a card. Don't hand-pick fragile newsletter-CDN images (expiring or
truncated query strings); use the primary source's OpenGraph image instead.

```bash
# Prints the first page's og:image; pass fallbacks so it skips bot-blockers.
.claude/skills/news-recap/scripts/og_image.sh \
  https://openai.com/index/gpt-5-6 \
  https://www.theverge.com/…   # fallback if the first 403s
```

Paste the printed URL into `image=`. A cover that later dies is hidden
automatically at render (no broken-image icon), and `check_links.sh` flags it
like any other link. Skip the cover on bucket/"en bref" cards.

## `<Source label="…" href="…" />`

A single source chip. Usually you pass `sources` on `<NewsItem>` instead; use the
standalone form only for an extra inline citation inside the prose.

```mdx
<Source label="communiqué" href="https://example.com/press" />
```

---

## Media

Put media blocks **inside** `<NewsItem>` children, each separated by a blank line.
Always use **real** URLs/ids from the source. Never invent media.

These **stack with the card's `image=` cover** — a card can have a cover *and*
one or more in-body visuals. Add a `<NewsImage>` / `<Gallery>` whenever a second
visual carries information the cover doesn't (a benchmark chart, a product
screenshot, a before/after). Every `<NewsImage>`, `<Gallery>` image and markdown
image **opens full-screen on click** (lightbox, closes on click/Esc), so prefer
the largest clean URL available. A broken image hides itself at render.

### `<NewsImage src alt caption />`

Single image (rounded, lazy). `caption` optional.

```mdx
<NewsImage src="https://cdn.example.com/chart.png" alt="Courbe ARR" caption="ARR d'Anthropic, 2024–2026." />
```

### `<Gallery items={[…]} />`

Horizontal, snap-scrolling strip (for 2+ visuals). Each item:
`{ src: string, alt?: string, type?: "image" | "video" }` (`type` defaults to image).

```mdx
<Gallery items={[
  { src: "https://cdn.example.com/1.jpg", alt: "vue 1" },
  { src: "https://cdn.example.com/2.jpg", alt: "vue 2" },
  { src: "https://cdn.example.com/clip.mp4", type: "video" },
]} />
```

### `<Video src caption poster />`

A **YouTube / youtu.be** URL becomes an embed; any other URL (e.g. `.mp4`) plays
in a native player. `caption` and `poster` optional.

```mdx
<Video src="https://youtu.be/dQw4w9WgXcQ" caption="Démo officielle." />
<Video src="https://cdn.example.com/demo.mp4" poster="https://cdn.example.com/poster.jpg" />
```

### `<Tweet id="…" />`

Embedded X / Twitter post (SSR-friendly, theme-synced, no widget script).
`id` is the **numeric status id**: for `x.com/<user>/status/1790000000000000000`
→ `id="1790000000000000000"`. Use this for "viral tweet" / "X post" items.

```mdx
<Tweet id="1790000000000000000" />
```

### `<Embed src title ratio />`

Generic responsive iframe (maps, CodePen, etc.). Default `ratio="16 / 9"`.
Prefer `<Tweet>`/`<Video>` over `<Embed>` for X and YouTube.

```mdx
<Embed src="https://www.google.com/maps/embed?pb=…" title="Carte" ratio="4 / 3" />
```

### Markdown images

`![alt](https://…)` also works (rounded, responsive) — equivalent to a simple
`<NewsImage>` without caption.

---

## Inline formatting

- **Links**: `[texte](https://…)` — external links open in a new tab automatically.
  Use them to cite the real source inline in addition to `sources`.
- **Emphasis**: `**gras**` for key terms/figures, `*italique*` sparingly.
- **Inline code**: `` `gpt-5.5` `` for model names, flags, code, prices with symbols.
- **Lists**: `-` bullets for an item that genuinely enumerates (e.g. a spec list).
  Keep lists short; prose is usually better.

---

## MDX gotchas (escaping)

MDX parses `{` … `}` as JS and `<` … `>` as JSX. In prose:

- Avoid a bare `<` / `>` — write "moins de" / "plus de", or wrap in backticks:
  `` `@media (300px < width < 800px)` ``.
- Avoid bare `{` `}` — wrap code in backticks: `` `Map.getOrInsert()` ``.
- Frontmatter strings with `:`, `"`, `×`, accents → wrap the whole value in quotes.
- `date` MUST be quoted: `date: "2026-06-22"`.
- Component props use real JS: arrays/objects in `{…}`, e.g.
  `sources={[{ label: "X", url: "https://…" }]}`.
