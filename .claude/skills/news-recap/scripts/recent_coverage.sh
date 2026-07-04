#!/usr/bin/env bash
# Print what the recent digests already covered, so a new day's recap does NOT
# re-card a story already told. Newsletters trail a big story for days; without
# this check each day re-headlines the same launch.
#
# Usage:
#   recent_coverage.sh                         # last 7 digests before today
#   recent_coverage.sh --days 10               # last 10
#   recent_coverage.sh --before 2026-07-04     # last 7 strictly before that date
#   recent_coverage.sh --days 14 --before 2026-07-04 [digests_dir]
#
# For each recent digest it prints the file date, the frontmatter title, and
# every <NewsItem> card title. Read it BEFORE writing: any candidate that only
# repeats one of these lines (no NEW development) must be dropped or folded into
# a one-line "suivi", not carded again. See SKILL.md "Continuité & nouveauté".
set -u

days=7
before=""
dir=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --days)   days="${2:?}"; shift 2 ;;
    --before) before="${2:?}"; shift 2 ;;
    -h|--help) grep -E '^#( |$)' "$0" | sed -E 's/^# ?//'; exit 0 ;;
    *)        dir="$1"; shift ;;
  esac
done

# Default digests dir: resolve relative to the repo root (two levels above skill).
if [ -z "$dir" ]; then
  here=$(cd "$(dirname "$0")" && pwd)
  root=$(cd "$here/../../../.." && pwd)
  dir="$root/apps/web/src/content/digests"
fi
[ -d "$dir" ] || { echo "no digests dir: $dir" >&2; exit 2; }

# Newest-first list of YYYY-MM-DD.mdx, keeping only those strictly before --before.
files=$(ls -1 "$dir"/*.mdx 2>/dev/null | sort -r)
[ -n "$files" ] || { echo "no digests in $dir" >&2; exit 2; }

count=0
printf '%s\n' "$files" | while IFS= read -r f; do
  d=$(basename "$f" .mdx)
  [ -n "$before" ] && [ ! "$d" \< "$before" ] && continue   # skip d >= before
  count=$((count + 1))
  [ "$count" -gt "$days" ] && break

  # Frontmatter title (first `title:` line in the file).
  ft=$(grep -m1 -E '^title:' "$f" | sed -E 's/^title:[[:space:]]*//; s/^"//; s/"$//')
  printf '\n=== %s — %s\n' "$d" "$ft"

  # Every card title: `title="..."` on a <NewsItem> (inline or on its own line).
  grep -oE 'title="[^"]+"' "$f" | sed -E 's/^title="//; s/"$//' \
    | grep -vxF "$ft" | sed 's/^/  • /'
done
