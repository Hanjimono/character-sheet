// System
import { z } from "zod"
// Server
import { publicProcedure, router } from "../trpc"
import { GameInfo } from "@/constants/types/game"

export const gameRouter = router({
  active: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.game) {
      return null
    }
    return {
      id: ctx.game.id,
      date: String(ctx.game.date),
      isActive: ctx.game.isActive,
      campaignId: ctx.game.campaignId,
      characterId: ctx.game.characterId
    } as GameInfo
  }),
  start: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.game) {
      return ctx.game
    }
    if (!ctx.campaign) {
      throw new Error("Campaign not found")
    }
    const { Game } = await import("@/database/models/game")
    const newGame = await Game.startNewGame(
      ctx.campaign.characterId,
      ctx.campaign.id
    )
    return newGame
  }),
  end: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.game) {
      throw new Error("No active game")
    }
    if (!ctx.campaign) {
      throw new Error("Campaign not found")
    }
    const { Game } = await import("@/database/models/game")
    await Game.endGame(ctx.game.id)
    return true
  })
})
