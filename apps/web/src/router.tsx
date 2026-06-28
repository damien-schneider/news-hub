import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

// React Grab: select any UI element in the running app and hand its source
// location to an AI agent. Dev-only and client-only — it touches the DOM, so it
// must never load during SSR.
if (import.meta.env.DEV && typeof window !== "undefined") {
  import("react-grab")
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
