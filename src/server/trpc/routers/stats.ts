// System
import { z } from "zod"
// Server
import { publicProcedure, router } from "../trpc"

const saveRollValidateSchema = z.object({
  player: z.number(),
  isNegative: z.boolean().optional()
})

const saveDamageValidateSchema = z.object({
  player: z.number(),
  isNegative: z.boolean().optional(),
  count: z.number(),
  isSummon: z.boolean().optional(),
  comment: z.string()
})

export const statsRouter = router({
  rolls: router({
    save: publicProcedure
      .input(saveRollValidateSchema)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.game || !ctx.campaign) {
          throw new Error("No active game or campaign")
        }
        const { DiceBalanceHistory } = await import(
          "@/database/models/diceBalanceHistory"
        )
        const { DiceBalance } = await import("@/database/models/diceBalance")

        const historySaveResult = await DiceBalanceHistory.saveRollForPlayer(
          input.player,
          ctx.campaign.id,
          ctx.game.id,
          input.isNegative || false
        )
        if (!historySaveResult) {
          throw new Error("Failed to save roll history")
        }
        const balanceSaveResult = await DiceBalance.saveBalanceForPlayer(
          input.player,
          ctx.campaign.id,
          input.isNegative || false
        )
        if (!balanceSaveResult) {
          throw new Error("Failed to save balance")
        }
        return true
      }),
    table: publicProcedure
      .input(
        z.object({
          isShowGameStats: z.boolean().optional()
        })
      )
      .query(async ({ input, ctx }) => {
        if (!ctx.campaign) {
          throw new Error("No campaign found")
        }
        const { DiceBalance } = await import("@/database/models/diceBalance")
        const { DiceBalanceHistory } = await import(
          "@/database/models/diceBalanceHistory"
        )

        let gameId: number | undefined
        if (input.isShowGameStats) {
          if (!ctx.game) {
            throw new Error("No game found")
          }
          gameId = ctx.game.id
        }

        const stats = []
        for (const player of ctx.players) {
          const balance = {
            totalPositive: 0,
            totalNegative: 0
          }
          if (gameId) {
            const gameBalance = await DiceBalanceHistory.getRollsSum(
              ctx.campaign.id,
              gameId,
              player.id
            )
            balance.totalPositive = gameBalance.totalPositive
            balance.totalNegative = gameBalance.totalNegative
          } else {
            const balanceTotal = await DiceBalance.getTotalBalance(
              ctx.campaign.id,
              player.id
            )
            balance.totalPositive = balanceTotal.totalPositive
            balance.totalNegative = balanceTotal.totalNegative
          }
          stats.push({
            player: player,
            totalPositive: balance.totalPositive,
            totalNegative: balance.totalNegative
          })
        }
        return stats
      }),
    total: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.campaign) {
        throw new Error("No campaign found")
      }
      const { DiceBalance } = await import("@/database/models/diceBalance")
      const balanceTotal = await DiceBalance.getTotalBalance(ctx.campaign.id)
      return balanceTotal
    }),
    game: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.game || !ctx.campaign) {
        throw new Error("No game or campaign found")
      }
      const { DiceBalanceHistory } = await import(
        "@/database/models/diceBalanceHistory"
      )
      const balanceTotal = await DiceBalanceHistory.getRollsSum(
        ctx.campaign.id,
        ctx.game.id
      )
      return balanceTotal
    })
  }),
  damage: router({
    save: publicProcedure
      .input(saveDamageValidateSchema)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.game || !ctx.campaign) {
          throw new Error("No active game or campaign")
        }

        const { DamageBalanceHistory } = await import(
          "@/database/models/damageBalanceHistory"
        )
        const { DamageBalance } = await import(
          "@/database/models/damageBalance"
        )

        const historySaveResult =
          await DamageBalanceHistory.saveDamageForPlayer(
            input.player,
            ctx.campaign.id,
            ctx.game.id,
            input.isNegative || false,
            input.count,
            input.isSummon || false,
            input.comment
          )
        if (!historySaveResult) {
          throw new Error("Failed to save damage history")
        }
        const balanceSaveResult = await DamageBalance.saveBalanceForPlayer(
          input.player,
          ctx.campaign.id,
          input.isNegative || false,
          input.count
        )
        if (!balanceSaveResult) {
          throw new Error("Failed to save damage balance")
        }
        return true
      }),
    table: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.campaign) {
        throw new Error("No campaign found")
      }
      const { DamageBalance } = await import("@/database/models/damageBalance")
      const { DamageBalanceHistory } = await import(
        "@/database/models/damageBalanceHistory"
      )

      const stats = []
      for (const player of ctx.players) {
        const balance = {
          totalPositive: 0,
          totalNegative: 0
        }
        if (ctx.game) {
          const gameBalance = await DamageBalanceHistory.getDamageSum(
            ctx.campaign.id,
            ctx.game.id,
            player.id
          )
          balance.totalPositive = gameBalance.totalPositive
          balance.totalNegative = gameBalance.totalNegative
        } else {
          const balanceTotal = await DamageBalance.getTotalBalance(
            ctx.campaign.id,
            player.id
          )
          balance.totalPositive = balanceTotal.totalPositive
          balance.totalNegative = balanceTotal.totalNegative
        }
        stats.push({
          player: player,
          totalPositive: balance.totalPositive,
          totalNegative: balance.totalNegative
        })
      }
      return stats
    }),
    game: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.campaign) {
        throw new Error("No campaign or game found")
      }
      if (!ctx.game) {
        return { totalPositive: 0, totalNegative: 0 }
      }
      const { DamageBalanceHistory } = await import(
        "@/database/models/damageBalanceHistory"
      )
      const balanceTotal = await DamageBalanceHistory.getDamageSum(
        ctx.campaign.id,
        ctx.game.id
      )
      return balanceTotal
    })
  })
})
