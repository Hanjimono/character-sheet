// System
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
// Server
import { appRouter } from "@/server/trpc/routers/_app"
import { createContext } from "@/server/trpc/context"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const { searchParams } = new URL(req.url)
      const characterId = Number(searchParams.get("character") || 0)
      return createContext({ characterId })
    }
  })

export { handler as GET, handler as POST }
