#!/usr/bin/env bash
# Verify every http(s) link in an MDX recap resolves.
# Usage: check_links.sh <file.mdx>
# Classifies each URL: OK (2xx/3xx), WARN (401/403/405/429 — protected:
# paywall or bot-block, exists but can't be auto-checked), BAD (404/5xx/000 —
# dead). Exits 1 only if any link is BAD.
set -u

file="${1:?usage: check_links.sh <file.mdx>}"
[ -f "$file" ] || { echo "no such file: $file" >&2; exit 2; }

fail=$(mktemp)
grep -oE 'https?://[^ )"'"'"'<>]+' "$file" | sed -E 's/[).,;:]+$//' | sort -u |
while read -r url; do
  code=$(curl -fsSL -A "Mozilla/5.0 (news-hub link check)" \
    --connect-timeout 10 --max-time 20 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null)
  code=${code:-000}
  case "$code" in
    2??|3??)        printf 'OK   %s  %s\n' "$code" "$url" ;;
    401|403|405|429) printf 'WARN %s  %s  (protégé : paywall/anti-bot — vérifier à la main)\n' "$code" "$url" ;;
    *)              printf 'BAD  %s  %s\n' "$code" "$url"; echo 1 >> "$fail" ;;
  esac
done

n=$(wc -c < "$fail"); rm -f "$fail"
[ "$n" -eq 0 ]
