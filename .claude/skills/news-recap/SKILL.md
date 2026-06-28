---
name: news-recap
description: >-
  Author a concise daily news-recap MDX file for the news-hub site from
  newsletter / email sources. Use when asked to generate, write, or update a
  daily recap or digest, turn newsletters into a post, or add news to news-hub.
  Covers the frontmatter schema, the MDX components (NewsItem, Category, Source,
  Gallery, NewsImage, Video, Tweet, Embed), the 8 categories, the
  real-link/media requirements, and the anti-AI-slop editorial rules.
---

# News recap authoring

Produce **one MDX file per day**: `apps/web/src/content/digests/<YYYY-MM-DD>.mdx`.
One file = one day's recap. The site renders it as a filterable card feed grouped
by category. **Signal over completeness** — keep only news that genuinely matters.

## Golden rules

1. **Concise.** Target **6–14 brèves** for a normal day (hard cap ~20). Cut
   filler, duplicates, and "interesting but not important". Merge related angles
   into one item. Each item is **1–3 tight sentences**.
2. **Link the primary source — never invented.** Each `<NewsItem>` links the
   **primary source first** — the company/product page, the paper, the repo, or
   the article — then adds the newsletter as a secondary `via` entry, e.g.
   `sources={[{ label: "Unsloth", url: "https://github.com/unslothai/unsloth" }, { label: "via AlphaSignal", url: "https://alphasignal.ai" }]}`.
   Find the primary by resolving the newsletter's link (`curl -L`) or
   **web-searching the named entity** (repo, paper title, company + product).
   Many newsletters embed canonical links inline (e.g. Aktionnaire → WSJ, Le
   Figaro); others only expose **opaque tracking redirects** (e.g.
   `app.alphasignal.ai/c?…`) — recover the primary by search. The **newsletter
   homepage alone is not an acceptable sole source** (it tells the reader
   nothing specific); only fall back to it, clearly as `via`, when the primary
   genuinely cannot be found. **Every URL must resolve** — run
   `scripts/check_links.sh` (see Verify). Never fabricate or guess a dead URL.
3. **Regroup recurring buckets.** When several items are the same recurring
   *kind* — new model releases, funding rounds, tool/library updates,
   benchmarks, or assorted "en bref" — combine them into **one** `<NewsItem>`
   with a bullet list (each bullet keeps its own real link), not many cards.
   Reserve a standalone card for a genuinely major story. See Grouping below.
4. **Real media.** When the source has an image, a tweet, or a video, embed it
   with the real URL/id (`<NewsImage>`, `<Gallery>`, `<Tweet>`, `<Video>`).
5. **No AI slop.** Plain, factual French. See [references/style.md](references/style.md).
6. **French content.** Titles, summaries, and the lede are in French.

## Workflow

1. **Gather** the day's sources. As Claude with the Gmail MCP, read the
   `Newsletters` label (id `Label_8428948209629849474`) for that date and open
   each thread's full body to extract **the real article/source links** plus any
   images, tweet ids, and video URLs. Other AIs: ask the user to paste the
   newsletters or the links.
2. **Select & dedupe.** Keep only important items; collapse cross-source
   duplicates into one item with multiple `sources`.
3. **Categorize** each item into one of the 8 slugs (see Categories below).
4. **Write** each item as a `<NewsItem>` (1–3 sentences, real sources, tags,
   media when available). Put a `<Category slug="…" />` divider before the first
   item of each category, in canonical order.
5. **Frontmatter** — fill the schema below. **Quote the `date`** (unquoted YAML
   parses it as a Date and breaks the schema). Set `sourceCount` = number of
   `<NewsItem>`. Set `featured: true` only for a standout day.
6. **Validate** (see Verify). Start from [assets/template.mdx](assets/template.mdx).

## Frontmatter schema

```yaml
---
date: "2026-06-22"            # YYYY-MM-DD, quoted. Doubles as the URL slug.
title: "Titre court et factuel"
lede: "Une à deux phrases qui résument la journée, sans esbroufe."
categories: ["ia", "finance", "web"]   # only the slugs actually present
sourceCount: 9                # = number of <NewsItem> in the body
featured: false
---
```

## Components (cheat-sheet)

Full API + examples: [references/components.md](references/components.md).

```mdx
<Category slug="ia" />

<NewsItem
  title="Titre de la brève"
  category="ia"
  tags={["modèle", "open-source"]}
  sources={[{ label: "TechCrunch", url: "https://example.com/article" }]}
>
Résumé factuel en une à trois phrases. Liens inline possibles : [le papier](https://arxiv.org/abs/xxxx).

<NewsImage src="https://real.cdn/img.jpg" alt="…" caption="…" />
<Gallery items={[{ src: "https://…1.jpg" }, { src: "https://…2.mp4", type: "video" }]} />
<Tweet id="1790000000000000000" />
<Video src="https://youtu.be/VIDEO_ID" />
</NewsItem>
```

- `category` on `<NewsItem>` **must** match a `<Category slug>` above it (drives filtering).
- `sources`: `[{ label, url? }]`. `url` optional but **strongly preferred** — that is the whole point.
- Media goes **inside** `<NewsItem>` children (blank line before each block).

## Grouping recurring buckets

A daily AI digest usually ships *several* model releases, repo/tool updates, and
minor items. Do **not** make a card each. Make one bucket card with a list, each
line carrying its own real link:

```mdx
<NewsItem
  title="Nouveaux modèles & outils open-source"
  category="ia"
  tags={["open-source"]}
  sources={[{ label: "AlphaSignal", url: "https://alphasignal.ai" }]}
>
- **[GLM-5.2](https://huggingface.co/zai-org/GLM-5.2)** — 744B params, MIT, contexte 1M.
- **[AgentDeck](https://github.com/asheshgoplani/agent-deck)** — pilote Claude Code depuis un Stream Deck+.
- **[Microsoft AI for Beginners](https://github.com/microsoft/AI-For-Beginners)** — cours gratuit, 24 leçons.
</NewsItem>
```

Common buckets: `Nouveaux modèles`, `Outils & repos open-source`, `Levées de
fonds`, `Benchmarks & papers`, `En bref`. Keep the major standalone story
(e.g. a flagship launch, a big study) as its own card.

## Categories (slug → label, canonical order)

`ia` IA & LLMs · `web` Web & Frontend · `robotique` Robotique ·
`growth` Marketing & Growth · `productivite` Productivité & Org ·
`finance` Finance & Marchés · `hardware` Hardware & Santé ·
`evenements` Événements & Loisirs

Defined in `apps/web/src/content/categories.ts`. Add a new category there before using it.

## Before finishing — checklist

- [ ] ≤ ~20 items, each genuinely important and 1–3 sentences.
- [ ] Every item links a **primary** source first (company/paper/repo/article),
      with the newsletter as a `via` entry — no item points only at a newsletter homepage.
- [ ] `scripts/check_links.sh` shows no `BAD` links (WARN = paywall/anti-bot is OK).
- [ ] `date` quoted; `sourceCount` matches the item count; `categories` lists only present slugs.
- [ ] Each `<NewsItem category>` has a matching `<Category slug>` divider.
- [ ] Media uses real URLs/ids; tweets use the numeric status id.
- [ ] Read [references/style.md](references/style.md) and stripped the AI-slop tells.

## Verify

```bash
.claude/skills/news-recap/scripts/check_links.sh apps/web/src/content/digests/<date>.mdx
cd apps/web && bun run dev            # open /posts/<date>, check render + category filter
bun run turbo typecheck lint          # from repo root
```

`check_links.sh` GETs every URL in the file and flags any that don't resolve
(status ≥ 400 or no response). Fix or replace every `BAD` link before finishing.
