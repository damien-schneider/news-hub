import { Tweet as ReactTweet } from "react-tweet"

import { useTheme } from "@/components/theme/theme-provider"

/**
 * Embedded X / Twitter post via react-tweet (SSR-friendly, no widget script).
 * `id` is the numeric status id, e.g. for x.com/user/status/123456 → id="123456".
 * Follows the site theme (explicit light/dark; "system" defers to the OS).
 */
export function Tweet({ id }: { id: string }) {
  const { theme } = useTheme()
  const dataTheme = theme === "system" ? undefined : theme

  return (
    <div
      data-theme={dataTheme}
      className="my-3 flex justify-center [&_.react-tweet-theme]:my-0"
    >
      <ReactTweet id={id} />
    </div>
  )
}
