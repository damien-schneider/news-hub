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
4. **Give every standalone card a cover image.** A text-only feed is dull and
   the layout is built for visuals — so each major `<NewsItem>` should carry an
   `image=` cover. The most reliable per-story visual is the **`og:image` of the
   primary source**: get it with
   `scripts/og_image.sh <primary-url> [fallback-url …]` (prints the first page's
   OpenGraph/Twitter image; pass several source URLs so it falls back when one
   blocks bots). Set `imageAlt` too. **The cover and inline media stack** — on
   top of the cover, add as many in-body visuals as genuinely help: a chart or
   screenshot (`<NewsImage>`), a set of shots (`<Gallery>`), the real tweet
   (`<Tweet>`), or a demo clip (`<Video>`). Use a second image when it adds
   information the cover doesn't (a benchmark chart, a product screenshot, a
   before/after). Every image opens **full-screen on click** (lightbox), so use
   the largest clean URL you can. Bucket/"en bref" cards usually skip the cover.
   Never invent an image URL — a broken image auto-hides at render, and
   `check_links.sh` verifies every image URL like any other link.
5. **No AI slop.** Plain, factual French. See [references/style.md](references/style.md).
6. **French content.** Titles, summaries, and the lede are in French.
7. **Nouveauté — même sujet ≠ même news.** L'unité, c'est **le fait, pas
   l'entité**. Un sujet récurrent (Fable 5 : lancement → bridage → redéploiement)
   donne **plusieurs news distinctes** — on garde chaque **nouveau fait** et on
   ne carte que le changement (pas l'origine). On ne coupe **que** l'item qui
   redit un fait déjà raconté ; le seul fait qu'un sujet soit déjà apparu n'est
   jamais une raison de drop. En cas de doute, garder mais réduire au delta.
   **Date à l'événement, pas au mail** : un mail reçu aujourd'hui qui recape un
   lancement d'il y a trois jours n'est pas une news d'aujourd'hui. Voir
   [Continuité & nouveauté](#continuité--nouveauté-cross-day).

## Workflow

1. **Continuité — read what's already covered.** Before anything, run
   `scripts/recent_coverage.sh --before <date>` to dump the titles of the last
   ~7 digests. Hold that list in mind while selecting: it is the anti-repeat
   gate (step 3 checks every candidate against it).
2. **Gather** the day's sources. As Claude with the Gmail MCP, search the
   `Newsletters` label for that date — use the **display name**
   (`label:Newsletters after:YYYY/MM/DD before:YYYY/MM/DD`); the label-id form
   (`label:Label_8428948209629849474`) returns **nothing** in this MCP. Open each
   thread's full body (`get_thread`, `messageFormat="FULL_CONTENT"`) to extract
   **the real article/source links** plus any images, tweet ids, and video URLs.
   Other AIs: ask the user to paste the newsletters or the links.
3. **Select, dedupe & gate on novelty.** Keep only important items; collapse
   cross-source duplicates into one item with multiple `sources`. Then check
   each survivor against step 1's list — testing the **fact, not the subject**:
   a familiar subject with a **new fact** (new state, decision, number, actor)
   stays; an item that only repeats a fact already told gets dropped or folded
   into a « suivi » line. See [Continuité & nouveauté](#continuité--nouveauté-cross-day).
4. **Categorize** each item into one of the 8 slugs (see Categories below).
5. **Write** each item as a `<NewsItem>` (1–3 sentences, real sources, tags). Add
   an `image=` cover from the primary source's `og:image`
   (`scripts/og_image.sh <url>`) on every standalone card, plus inline media when
   available. Put a `<Category slug="…" />` divider before the first item of each
   category, in canonical order.
6. **Frontmatter** — fill the schema below. **Quote the `date`** (unquoted YAML
   parses it as a Date and breaks the schema). Set `sourceCount` = number of
   `<NewsItem>`. Set `highlight` to the day's single biggest news (copy the lead
   `<NewsItem>`'s `title`, `category`, and `image`) — its presence is what makes
   the recap eligible for the home "À la une". Omit it on a slow day.
7. **Validate** (see Verify). Start from [assets/template.mdx](assets/template.mdx).

## Frontmatter schema

```yaml
---
date: "2026-06-22"            # YYYY-MM-DD, quoted. Doubles as the URL slug.
title: "Titre court et factuel"
lede: "Une à deux phrases qui résument la journée, sans esbroufe."
categories: ["ia", "finance", "web"]   # only the slugs actually present
sourceCount: 9                # = number of <NewsItem> in the body
highlight:                    # the day's #1 news → home "À la une" (omit if none)
  title: "Titre de la news la plus marquante du jour"
  category: "ia"             # one of the 8 slugs
  image: "https://…"         # optional cover; reuse the lead <NewsItem>'s image
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
  image="https://example.com/og-image.jpg"
  imageAlt="Description de la couverture"
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
- `image` (+ `imageAlt`): cover at the top of the card, clickable to the first
  source. Fill it from the primary source's `og:image` via
  `scripts/og_image.sh <url>`. Optional but expected on standalone cards.
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

## Continuité & nouveauté (cross-day)

Dedupe within a single day is not enough. A **big story recurs across many
newsletters for days** — a launch is still the lede three days later — and if
you card it every day the feed becomes: *"Fable 5 launched"* on Mon, Tue **and**
Wed. That is the failure this section prevents.

### Same subject ≠ same news

This is the whole rule, and the easy mistake is to over-cut. **The unit is the
event, not the entity.** "Fable 5" appearing in a prior digest is **never on its
own a reason to drop** — the launch, the ban, the negotiation, the redeploy are
**four separate pieces of news** that happen to share a subject. Kill only the
item that repeats a **fact already told**, not every item that names a familiar
subject.

**Gate.** Run `scripts/recent_coverage.sh --before <date>` first (step 1). For
every candidate whose subject already appears in that list, ask one question:
**does it carry a fact no prior digest stated?** — a new state, a new decision,
a new number, a new actor, a shipped mechanism.

- **New fact → keep.** Write *only the new fact* and link the new source; don't
  re-tell the origin (a reader who missed it can click). An ongoing saga earns a
  card at each real beat: launched → restricted → open letter → negotiation →
  partial restore → full redeploy. Each beat is its own news.
- **No new fact → drop.** A newsletter still recapping yesterday's launch, with
  nothing added, is not today's news. Cut it, or, if it still matters as
  context, give it **one line** in an « En bref — suivi » bucket
  (`Fable 5 toujours hors ligne`) — never a fresh standalone card.
- **In doubt, keep — but trim to the delta.** Missing a real beat is worse than
  a thin card. If you can name one concrete thing that changed, it is news;
  write that one thing.

**Date to the event, not to the email.** The digest date is the day the thing
*happened*, not the day a newsletter landed in the inbox. When a source recaps
an older event, either it was already covered (drop) or you are back-filling a
missed day — put it in that day's file, not today's. If unsure when it broke,
check the **primary source's publish date** (the article/repo/paper), not the
newsletter's send date.

Worked example — Fable 5 over 3 weeks (same subject, several distinct news):
`06-09` launch = card. `06-10`/`06-11` newsletters still leading with that same
launch, nothing added = **drop**. `06-13` access cut = card (new fact). `06-15`/
`06-16` same cut, only fresh commentary/angle = one line in suivi. `06-20`
negotiation, `06-29` partial restore, `07-01` restore announced = each a card.
`07-03` worldwide redeploy **with a new safety classifier** = card — it ships a
new fact (effective redeploy + new mechanism), so it stays, even though the
subject is the same as `07-01`. `06-24` Qwable cloning Fable's behaviour is its
**own** story that merely references Fable = card on its own merits.

## Categories (slug → label, canonical order)

`ia` IA & LLMs · `web` Web & Frontend · `robotique` Robotique ·
`growth` Marketing & Growth · `productivite` Productivité & Org ·
`finance` Finance & Marchés · `hardware` Hardware & Santé ·
`evenements` Événements & Loisirs

Defined in `apps/web/src/content/categories.ts`. Add a new category there before using it.

## Before finishing — checklist

- [ ] ≤ ~20 items, each genuinely important and 1–3 sentences.
- [ ] Ran `scripts/recent_coverage.sh`: **no item repeats a fact already told in
      the last ~7 digests** — but a new beat of an ongoing subject (redeploy after
      a launch) is kept and cards only the new fact, dated to the event (not the
      newsletter). See Continuité & nouveauté.
- [ ] Every item links a **primary** source first (company/paper/repo/article),
      with the newsletter as a `via` entry — no item points only at a newsletter homepage.
- [ ] `scripts/check_links.sh` shows no `BAD` links (WARN = paywall/anti-bot is OK).
- [ ] `scripts/check_meta.sh` passes: `sourceCount` = item count, `date` quoted,
      `categories` == the dividers used, every `<NewsItem category>` has its divider.
- [ ] Every standalone card has an `image=` cover (primary source `og:image` via
      `scripts/og_image.sh`); bucket/"en bref" cards may skip it.
- [ ] Media uses real URLs/ids; tweets use the numeric status id.
- [ ] Read [references/style.md](references/style.md) and stripped the AI-slop tells.

## Verify

```bash
# Continuité: what the last ~7 digests already covered (run BEFORE writing)
.claude/skills/news-recap/scripts/recent_coverage.sh --before <date>
# Cover image: pull the primary source's og:image (pass fallbacks after it)
.claude/skills/news-recap/scripts/og_image.sh <primary-url> [fallback-url …]
.claude/skills/news-recap/scripts/check_links.sh apps/web/src/content/digests/<date>.mdx
# Frontmatter vs body: sourceCount, categories/dividers, quoted date
.claude/skills/news-recap/scripts/check_meta.sh apps/web/src/content/digests/<date>.mdx
cd apps/web && bun run dev            # open /posts/<date>, check render + category filter
bun run turbo typecheck lint          # from repo root
```

`check_links.sh` GETs every URL in the file and flags any that don't resolve
(status ≥ 400 or no response). Fix or replace every `BAD` link before finishing.
`check_meta.sh` cross-checks the frontmatter against the body: `sourceCount` =
number of `<NewsItem>`, `categories` = the `<Category slug>` dividers actually
used, every `<NewsItem category>` has its divider, no orphan divider, `date`
quoted. Both accept a glob (`…/digests/*.mdx`) to sweep every file at once.
