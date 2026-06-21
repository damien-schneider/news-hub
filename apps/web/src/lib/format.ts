const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]

/** "2026-05-09" → "9 mai 2026". Parsed manually to stay timezone-stable (SSR). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  return `${d} ${MONTHS_FR[m - 1]} ${y}`
}

/** "2026-05-09" → "09.05.26". */
export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split("-")
  if (!y || !m || !d) return iso
  return `${d}.${m}.${y.slice(2)}`
}
