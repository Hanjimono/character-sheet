// Server
import { publicProcedure, router } from "../trpc"

export const campaignRouter = router({
  active: publicProcedure.query(async ({ ctx }) => {
    return { campaign: ctx.campaign }
  })
})
