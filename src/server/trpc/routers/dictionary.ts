// Server
import { publicProcedure, router } from "../trpc"

export const dictionaryRouter = router({
  players: publicProcedure.query(async ({ ctx }) => {
    return ctx.players
  })
})
