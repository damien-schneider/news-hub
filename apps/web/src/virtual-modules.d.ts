/** Raw, unprocessed digest `.mdx` source keyed by date — see vite.config.ts. */
declare module "virtual:digest-sources" {
  const sources: Record<string, string>
  export default sources
}
