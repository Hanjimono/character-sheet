// System
import { z } from "zod"
// Server
import { publicProcedure, router } from "../trpc"
import { MoneyChangeRequest } from "@/constants/types/money"

const saveMoneyValidateSchema = z.object({
  fromPlayerId: z.number().optional(),
  toPlayerId: z.number().optional(),
  count: z.number(),
  isNegative: z.boolean().optional(),
  isTransfer: z.boolean().optional(),
  isCommon: z.boolean().optional(),
  comment: z.string()
})

export const moneyRouter = router({
  balance: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.campaign) {
      throw new Error("No campaign found")
    }
    const { MoneyBalance } = await import("@/database/models/moneyBalance")
    const commonBalance = await MoneyBalance.getCommonBalance(ctx.campaign.id)
    const totalBalance = await MoneyBalance.getTotalBalance(ctx.campaign.id)
    return { total: totalBalance, common: commonBalance }
  }),
  stats: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.campaign) {
      throw new Error("No campaign found")
    }
    const { MoneyBalance } = await import("@/database/models/moneyBalance")
    const { MoneyBalanceHistory } = await import(
      "@/database/models/moneyBalanceHistory"
    )
    const info = []
    for (const player of ctx.players) {
      const balance = await MoneyBalance.getBalance(
        player.id,
        ctx.campaign.id,
        false
      )
      let history = []
      if (ctx.game) {
        history = await MoneyBalanceHistory.getHistory(
          player.id,
          ctx.campaign.id,
          ctx.game.id
        )
      }
      info.push({
        player: player,
        amount: balance,
        history
      })
    }
    return info
  }),
  change: publicProcedure
    .input(saveMoneyValidateSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.game || !ctx.campaign) {
        throw new Error("No active game or campaign")
      }
      const {
        fromPlayerId,
        toPlayerId,
        count,
        comment,
        isCommon = false,
        isNegative = false,
        isTransfer = false
      } = input

      if (count <= 0 || (!fromPlayerId && !isCommon)) {
        throw new Error("Invalid data")
      }
      if (isTransfer && !toPlayerId && !isCommon) {
        throw new Error("Transfer without to player is not allowed")
      }
      if (isTransfer && fromPlayerId === toPlayerId && !isCommon) {
        throw new Error("Transfer to the same player is not allowed")
      }

      const { MoneyBalanceHistory } = await import(
        "@/database/models/moneyBalanceHistory"
      )
      const { MoneyBalance } = await import("@/database/models/moneyBalance")
      const { Player } = await import("@/database/models/player")
      const sequelize = (await import("@/lib/sequlize")).default

      if (!isTransfer) {
        if (!isCommon) {
          if (!fromPlayerId) {
            throw new Error("From player is required")
          }
          const player = await Player.getPlayerById(fromPlayerId)
          if (!player) {
            throw new Error("Player not found")
          }
          await sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveBalanceChange(
              player.id,
              null,
              ctx.campaign.id,
              ctx.game.id,
              count,
              comment,
              isNegative,
              false,
              transaction
            )
            await MoneyBalance.changeBalance(
              player.id,
              ctx.campaign.id,
              count,
              false,
              isNegative,
              transaction
            )
          })
        } else {
          await sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveBalanceChange(
              null,
              null,
              ctx.campaign.id,
              ctx.game.id,
              count,
              comment,
              isNegative,
              false,
              transaction
            )
            await MoneyBalance.changeBalance(
              null,
              ctx.campaign.id,
              count,
              true,
              isNegative,
              transaction
            )
          })
        }
      }
      if (isTransfer) {
        if (!isCommon) {
          if (!fromPlayerId) {
            throw new Error("From player is required")
          }
          if (!toPlayerId) {
            throw new Error("To player is required")
          }
          const fromPlayer = await Player.getPlayerById(fromPlayerId)
          const toPlayer = await Player.getPlayerById(toPlayerId)
          if (!fromPlayer || !toPlayer) {
            throw new Error("Player not found")
          }
          await sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveTransfer(
              fromPlayer.id,
              toPlayer.id,
              ctx.campaign.id,
              ctx.game.id,
              count,
              comment,
              transaction
            )
            await MoneyBalance.changeBalance(
              fromPlayer.id,
              ctx.campaign.id,
              count,
              false,
              true,
              transaction
            )
            await MoneyBalance.changeBalance(
              toPlayer.id,
              ctx.campaign.id,
              count,
              false,
              false,
              transaction
            )
          })
        } else {
          if (fromPlayerId) {
            const fromPlayer = await Player.getPlayerById(fromPlayerId)
            if (!fromPlayer) {
              throw new Error("From player not found")
            }
          }
          if (toPlayerId) {
            const toPlayer = await Player.getPlayerById(toPlayerId)
            if (!toPlayer) {
              throw new Error("To player not found")
            }
          }
          await sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveTransfer(
              fromPlayerId || null,
              toPlayerId || null,
              ctx.campaign.id,
              ctx.game.id,
              count,
              comment,
              transaction
            )
            if (fromPlayerId) {
              await MoneyBalance.changeBalance(
                fromPlayerId,
                ctx.campaign.id,
                count,
                false,
                true,
                transaction
              )
              await MoneyBalance.changeBalance(
                null,
                ctx.campaign.id,
                count,
                true,
                false,
                transaction
              )
            }
            if (toPlayerId) {
              await MoneyBalance.changeBalance(
                null,
                ctx.campaign.id,
                count,
                true,
                true,
                transaction
              )
              await MoneyBalance.changeBalance(
                toPlayerId,
                ctx.campaign.id,
                count,
                false,
                false,
                transaction
              )
            }
          })
        }
      }
      return true
    }),
  delete: publicProcedure
    .input(z.object({ historyId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.campaign) {
        throw new Error("No campaign found")
      }
      const { MoneyBalanceHistory } = await import(
        "@/database/models/moneyBalanceHistory"
      )
      const { MoneyBalance } = await import("@/database/models/moneyBalance")
      const sequelize = (await import("@/lib/sequlize")).default

      const historyRecord = await MoneyBalanceHistory.findByPk(input.historyId)
      if (!historyRecord) {
        throw new Error("Money history record not found")
      }
      if (historyRecord.campaignId !== ctx.campaign.id) {
        throw new Error("Unauthorized")
      }

      await sequelize.transaction(async (transaction) => {
        if (historyRecord.isTransfer) {
          const pairedRecord = await MoneyBalanceHistory.findOne({
            where: {
              campaignId: ctx.campaign.id,
              gameId: historyRecord.gameId,
              fromPlayerId: historyRecord.fromPlayerId,
              toPlayerId: historyRecord.toPlayerId,
              isTransfer: true,
              isNegative: !historyRecord.isNegative
            },
            order: [["createdAt", "ASC"]]
          })

          if (pairedRecord) {
            await pairedRecord.destroy({ transaction })
          }

          if (historyRecord.fromPlayerId) {
            await MoneyBalance.changeBalance(
              historyRecord.fromPlayerId,
              ctx.campaign.id,
              historyRecord.count,
              false,
              false,
              transaction
            )
          }
          if (historyRecord.toPlayerId) {
            await MoneyBalance.changeBalance(
              historyRecord.toPlayerId,
              ctx.campaign.id,
              historyRecord.count,
              false,
              true,
              transaction
            )
          }
          if (!historyRecord.fromPlayerId && historyRecord.toPlayerId) {
            await MoneyBalance.changeBalance(
              null,
              ctx.campaign.id,
              historyRecord.count,
              true,
              true,
              transaction
            )
            await MoneyBalance.changeBalance(
              historyRecord.toPlayerId,
              ctx.campaign.id,
              historyRecord.count,
              false,
              false,
              transaction
            )
          }
          if (historyRecord.fromPlayerId && !historyRecord.toPlayerId) {
            await MoneyBalance.changeBalance(
              historyRecord.fromPlayerId,
              ctx.campaign.id,
              historyRecord.count,
              false,
              false,
              transaction
            )
            await MoneyBalance.changeBalance(
              null,
              ctx.campaign.id,
              historyRecord.count,
              true,
              false,
              transaction
            )
          }
        } else {
          await MoneyBalance.changeBalance(
            historyRecord.fromPlayerId,
            ctx.campaign.id,
            historyRecord.count,
            historyRecord.fromPlayerId === null,
            !historyRecord.isNegative,
            transaction
          )
        }
        await historyRecord.destroy({ transaction })
      })
      return true
    })
})
