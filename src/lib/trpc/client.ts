// System
import { createTRPCReact } from "@trpc/react-query"
// Server
import { type AppRouter } from "@/server/trpc/routers/_app"

export const trpc = createTRPCReact<AppRouter>()
