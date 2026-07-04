#!/usr/bin/env bash
# Validate a news-recap MDX file's frontmatter against its body.
# Usage:
#   check_meta.sh <file.mdx> [more.mdx ...]
#   check_meta.sh apps/web/src/content/digests/*.mdx
#
# Per file, checks:
#   1. sourceCount == number of <NewsItem> cards
#   2. frontmatter `categories` == the set of <Category slug> dividers actually used
#   3. every <NewsItem category="x"> has a matching <Category slug="x"> divider
#   4. no orphan <Category> divider (one with no <NewsItem> before the next divider)
#   5. `date:` is quoted (unquoted YAML parses as a Date and breaks the schema)
#
# Prints one line per file (OK / FAIL + reasons). Exits 1 if any file fails.
# Companion to check_links.sh — run both before finishing a recap.
set -u

slugs() { grep -oE '"[a-z]+"' | tr -d '"' | sort -u | tr '\n' ' '; }

fail=0
for f in "$@"; do
  [ -f "$f" ] || { echo "FAIL $f  (fichier introuvable)"; fail=1; continue; }
  p=""

  # 1. sourceCount vs actual <NewsItem> count
  sc=$(grep -m1 -E '^sourceCount:' "$f" | grep -oE '[0-9]+')
  ni=$(grep -cE '^<NewsItem' "$f")
  [ "$sc" = "$ni" ] || p="$p; sourceCount=$sc mais $ni <NewsItem>"

  # 5. date quoted
  grep -qE '^date:[[:space:]]*"' "$f" || p="$p; date: non quotée"

  # 2. frontmatter categories == divider slugs used
  fmcats=$(grep -m1 -E '^categories:' "$f" | slugs)
  dividers=$(grep -oE '<Category slug="[a-z]+"' "$f" | slugs)
  [ "$fmcats" = "$dividers" ] || p="$p; categories[ ${fmcats}] != dividers[ ${dividers}]"

  # 3. every NewsItem category has a divider above it
  for c in $(grep -oE 'category="[a-z]+"' "$f" | slugs); do
    case " $dividers " in *" $c "*) ;; *) p="$p; <NewsItem category=\"$c\"> sans <Category> divider" ;; esac
  done

  # 4. orphan dividers (a <Category> with no <NewsItem> before the next one / EOF)
  orph=$(awk '
    /^<Category slug=/ { if (open) c++; open=1; next }
    /^<NewsItem/       { open=0 }
    END { if (open) c++; print c+0 }' "$f")
  [ "$orph" = "0" ] || p="$p; $orph <Category> divider(s) orphelin(s)"

  if [ -n "$p" ]; then echo "FAIL $f${p#;}"; fail=1; else echo "OK   $f"; fi
done
exit $fail
