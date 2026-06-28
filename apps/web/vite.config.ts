import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import type { Plugin } from "vite"
import { defineConfig } from "vite"

/**
 * Exposes the *unprocessed* digest `.mdx` source as `virtual:digest-sources`
 * (a `{ "YYYY-MM-DD": rawString }` map) for the search index. A `?raw` glob
 * can't be used: the pre-phase MDX plugin claims `.mdx` ids regardless of query
 * and returns a compiled component. A virtual module is read straight from disk,
 * so MDX never sees it and dev/build stay identical.
 */
function digestSources(): Plugin {
  const VIRTUAL = "virtual:digest-sources"
  const RESOLVED = "\0" + VIRTUAL
  let dir = ""

  return {
    name: "digest-sources",
    configResolved(c) {
      dir = path.resolve(c.root, "src/content/digests")
    },
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    async load(id) {
      if (id !== RESOLVED) return
      const files = (await readdir(dir)).filter((f) => f.endsWith(".mdx"))
      const entries = await Promise.all(
        files.map(async (f) => {
          const src = await readFile(path.join(dir, f), "utf8")
          return [f.replace(/\.mdx$/, ""), src] as const
        })
      )
      return `export default ${JSON.stringify(Object.fromEntries(entries))}`
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(dir) || !file.endsWith(".mdx")) return
      const mod = server.moduleGraph.getModuleById(RESOLVED)
      if (mod) server.moduleGraph.invalidateModule(mod)
      server.ws.send({ type: "full-reload" })
    },
  }
}

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    digestSources(),
    // MDX must run in the `pre` phase, before the TanStack Start and React
    // transforms, otherwise the compiled JSX is never picked up.
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
        ],
        providerImportSource: "@mdx-js/react",
      }),
    },
    tanstackStart(),
    viteReact({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
})

export default config
