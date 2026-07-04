#!/usr/bin/env bash
# Extract a stable preview image (og:image / twitter:image) from a page URL.
# Use it on a NewsItem's PRIMARY source to fill the `image=` cover prop.
#
# Usage:  og_image.sh <url>
#         og_image.sh <url1> <url2> ...   # tries each, prints the first hit
# Prints the absolute image URL on success (exit 0); nothing on failure (exit 1).
#
# Why author-time and not at render: the site content is static and every URL is
# link-checked (check_links.sh), so the cover URL is verified once and never
# fetched again at runtime. Pages that block bots (some 403) yield nothing — fall
# back to another source, the company/CDN hero image, or omit the cover.
set -u

ua="Mozilla/5.0 (compatible; news-hub-og/1.0; +https://news-hub.local)"

extract() {
  local url="$1" html img origin
  html=$(curl -fsSL -A "$ua" --connect-timeout 10 --max-time 25 "$url" 2>/dev/null) || return 1
  # First og:image / og:image:secure_url / twitter:image content value.
  img=$(printf '%s' "$html" \
    | tr '\n' ' ' \
    | grep -oiE '<meta[^>]+(property|name)=["'"'"']?(og:image(:secure_url)?|twitter:image(:src)?)["'"'"']?[^>]*>' \
    | grep -oiE 'content=["'"'"'][^"'"'"']+' \
    | sed -E 's/^content=["'"'"']//' \
    | head -n1)
  [ -n "$img" ] || return 1
  # Resolve protocol-relative (//cdn/x.jpg) and root-relative (/x.jpg) URLs.
  case "$img" in
    //*) img="https:$img" ;;
    /*)  origin=$(printf '%s' "$url" | sed -E 's#(https?://[^/]+).*#\1#'); img="$origin$img" ;;
  esac
  printf '%s\n' "$img"
  return 0
}

[ "$#" -ge 1 ] || { echo "usage: og_image.sh <url> [url...]" >&2; exit 2; }
for u in "$@"; do
  extract "$u" && exit 0
done
exit 1
