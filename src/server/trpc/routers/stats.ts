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
    delete: publicProcedure
      .input(z.object({ historyId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.campaign) {
          throw new Error("No campaign found")
        }
        const { DiceBalanceHistory } = await import(
          "@/database/models/diceBalanceHistory"
        )
        const { DiceBalance } = await import("@/database/models/diceBalance")

        const historyRecord = await DiceBalanceHistory.findByPk(input.historyId)
        if (!historyRecord) {
          throw new Error("Roll history record not found")
        }
        if (historyRecord.campaignId !== ctx.campaign.id) {
          throw new Error("Unauthorized")
        }

        await DiceBalance.deleteBalanceForPlayer(
          historyRecord.playerId,
          ctx.campaign.id,
          historyRecord.isNegative
        )
        await historyRecord.destroy()
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
    delete: publicProcedure
      .input(z.object({ historyId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.campaign) {
          throw new Error("No campaign found")
        }
        const { DamageBalanceHistory } = await import(
          "@/database/models/damageBalanceHistory"
        )
        const { DamageBalance } = await import(
          "@/database/models/damageBalance"
        )

        const historyRecord = await DamageBalanceHistory.findByPk(
          input.historyId
        )
        if (!historyRecord) {
          throw new Error("Damage history record not found")
        }
        if (historyRecord.campaignId !== ctx.campaign.id) {
          throw new Error("Unauthorized")
        }

        await DamageBalance.deleteBalanceForPlayer(
          historyRecord.playerId,
          ctx.campaign.id,
          historyRecord.isNegative,
          historyRecord.count
        )
        await historyRecord.destroy()
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
  }),
  getGameStats: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.campaign) {
        throw new Error("No campaign found")
      }
      const { DamageBalanceHistory } = await import(
        "@/database/models/damageBalanceHistory"
      )
      const { DiceBalanceHistory } = await import(
        "@/database/models/diceBalanceHistory"
      )
      const { MoneyBalanceHistory } = await import(
        "@/database/models/moneyBalanceHistory"
      )

      const damages = []
      const rolls = []
      const moneyTransactions = []

      for (const player of ctx.players) {
        const damageSum = await DamageBalanceHistory.getDamageSum(
          ctx.campaign.id,
          input.gameId,
          player.id
        )
        damages.push({
          player,
          totalPositive: damageSum.totalPositive,
          totalNegative: damageSum.totalNegative
        })

        const rollsSum = await DiceBalanceHistory.getRollsSum(
          ctx.campaign.id,
          input.gameId,
          player.id
        )
        rolls.push({
          player,
          totalPositive: rollsSum.totalPositive,
          totalNegative: rollsSum.totalNegative
        })

        const moneyHistory = await MoneyBalanceHistory.getHistory(
          player.id,
          ctx.campaign.id,
          input.gameId
        )
        moneyTransactions.push({
          player,
          history: moneyHistory
        })
      }

      return {
        damages,
        rolls,
        moneyTransactions
      }
    }),
  getCampaignPlayerStats: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.campaign) {
      throw new Error("No campaign found")
    }
    const { DamageBalance } = await import("@/database/models/damageBalance")
    const { DiceBalance } = await import("@/database/models/diceBalance")
    const { MoneyBalance } = await import("@/database/models/moneyBalance")

    const playerStats = []
    for (const player of ctx.players) {
      const [damageBalance, diceBalance, moneyBalance] = await Promise.all([
        DamageBalance.getTotalBalance(ctx.campaign.id, player.id),
        DiceBalance.getTotalBalance(ctx.campaign.id, player.id),
        MoneyBalance.getBalance(player.id, ctx.campaign.id, false)
      ])
      playerStats.push({
        player,
        rolls: {
          totalPositive: diceBalance.totalPositive,
          totalNegative: diceBalance.totalNegative
        },
        damages: {
          totalPositive: damageBalance.totalPositive,
          totalNegative: damageBalance.totalNegative
        },
        moneyTotal: moneyBalance
      })
    }
    return playerStats
  }),
  getGameHistory: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.campaign) {
        throw new Error("No campaign found")
      }
      const { DamageBalanceHistory } = await import(
        "@/database/models/damageBalanceHistory"
      )
      const { DiceBalanceHistory } = await import(
        "@/database/models/diceBalanceHistory"
      )
      const { MoneyBalanceHistory } = await import(
        "@/database/models/moneyBalanceHistory"
      )
      const { Player } = await import("@/database/models/player")

      const [damageRecords, rollRecords, moneyRecords] = await Promise.all([
        DamageBalanceHistory.getAllForGame(ctx.campaign.id, input.gameId),
        DiceBalanceHistory.getAllForGame(ctx.campaign.id, input.gameId),
        MoneyBalanceHistory.getAllForGame(ctx.campaign.id, input.gameId)
      ])

      const damages = await Promise.all(
        damageRecords.map(async (record) => {
          const player = await Player.findByPk(record.playerId)
          return {
            id: record.id,
            player: player
              ? {
                  id: player.id,
                  name: player.name,
                  image: player.image,
                  shortname: player.shortname,
                  isMe: player.isMain,
                  isDM: player.isDM
                }
              : null,
            count: record.count,
            isNegative: record.isNegative,
            isSummon: record.isSummon,
            comment: record.comment,
            createdAt: String(record.createdAt)
          }
        })
      )

      const rolls = await Promise.all(
        rollRecords.map(async (record) => {
          const player = await Player.findByPk(record.playerId)
          return {
            id: record.id,
            player: player
              ? {
                  id: player.id,
                  name: player.name,
                  image: player.image,
                  shortname: player.shortname,
                  isMe: player.isMain,
                  isDM: player.isDM
                }
              : null,
            isNegative: record.isNegative,
            createdAt: String(record.createdAt)
          }
        })
      )

      const moneyTransactions = await Promise.all(
        moneyRecords.map(async (record) => {
          const fromPlayer = record.fromPlayerId
            ? await Player.findByPk(record.fromPlayerId)
            : null
          const toPlayer = record.toPlayerId
            ? await Player.findByPk(record.toPlayerId)
            : null
          return {
            id: record.id,
            fromPlayer: fromPlayer
              ? {
                  id: fromPlayer.id,
                  name: fromPlayer.name,
                  image: fromPlayer.image,
                  shortname: fromPlayer.shortname,
                  isMe: fromPlayer.isMain,
                  isDM: fromPlayer.isDM
                }
              : null,
            toPlayer: toPlayer
              ? {
                  id: toPlayer.id,
                  name: toPlayer.name,
                  image: toPlayer.image,
                  shortname: toPlayer.shortname,
                  isMe: toPlayer.isMain,
                  isDM: toPlayer.isDM
                }
              : null,
            amount: record.count,
            isNegative: record.isNegative,
            isTransfer: record.isTransfer,
            comment: record.comment,
            createdAt: String(record.createdAt)
          }
        })
      )

      return {
        damages,
        rolls,
        moneyTransactions
      }
    })
})
