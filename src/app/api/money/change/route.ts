import { MoneyBalanceHistory } from "@/database/models/moneyBalanceHistory"
import { MoneyBalance } from "@/database/models/moneyBalance"
import sequelize from "@/lib/sequlize"
import { Player } from "@/database/models/player"
import * as yup from "yup"
import { withGameContext } from "@/lib/api/context/game"
import { withPostValidateContext } from "@/lib/api/context/postValidate"
import { ApiGameContext } from "@/constants/types/api"
import { MoneyChangeRequest } from "@/constants/types/money"

const saveMoneyValidateSchema = yup.object().shape({
  fromPlayerId: yup.number(),
  toPlayerId: yup.number(),
  count: yup.number().required(),
  isNegative: yup.boolean(),
  isTransfer: yup.boolean(),
  isCommon: yup.boolean(),
  comment: yup.string().required()
})

//TODO: refactor this piece of code, it's too long and hard to read
export const POST = withGameContext(async (ctx) =>
  withPostValidateContext<MoneyChangeRequest, ApiGameContext, boolean>(
    ctx,
    saveMoneyValidateSchema,
    async (
      { game, campaign },
      {
        fromPlayerId,
        toPlayerId,
        count,
        comment,
        isCommon = false,
        isNegative = false,
        isTransfer = false
      }
    ) => {
      if (!game || !campaign) {
        throw new Error("No active game or campaign")
      }
      if (count <= 0 || (!fromPlayerId && !isCommon)) {
        throw new Error("Invalid data")
      }
      if (isTransfer && !toPlayerId && !isCommon) {
        throw new Error("Transfer without to player is not allowed")
      }
      if (isTransfer && fromPlayerId === toPlayerId && !isCommon) {
        throw new Error("Transfer to the same player is not allowed")
      }

      if (!isTransfer) {
        if (!isCommon) {
          if (!fromPlayerId) {
            throw new Error("From player is required")
          }
          const player = await Player.getPlayerById(fromPlayerId)
          if (!player) {
            throw new Error("Player not found")
          }
          sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveBalanceChange(
              player.id,
              null,
              campaign.id,
              game.id,
              count,
              comment,
              isNegative,
              false,
              transaction
            )
            await MoneyBalance.changeBalance(
              player.id,
              campaign.id,
              count,
              false,
              isNegative,
              transaction
            )
          })
        } else {
          sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveBalanceChange(
              null,
              null,
              campaign.id,
              game.id,
              count,
              comment,
              isNegative,
              false,
              transaction
            )
            await MoneyBalance.changeBalance(
              null,
              campaign.id,
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
          sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveTransfer(
              fromPlayer.id,
              toPlayer.id,
              campaign.id,
              game.id,
              count,
              comment,
              transaction
            )
            await MoneyBalance.changeBalance(
              fromPlayer.id,
              campaign.id,
              count,
              false,
              true,
              transaction
            )
            await MoneyBalance.changeBalance(
              toPlayer.id,
              campaign.id,
              count,
              false,
              false,
              transaction
            )
          })
        } else {
          if (!!fromPlayerId) {
            const fromPlayer = await Player.getPlayerById(fromPlayerId)
            if (!fromPlayer) {
              throw new Error("From player not found")
            }
          }
          if (!!toPlayerId) {
            const toPlayer = await Player.getPlayerById(toPlayerId)
            if (!toPlayer) {
              throw new Error("To player not found")
            }
          }
          sequelize.transaction(async (transaction) => {
            await MoneyBalanceHistory.saveTransfer(
              fromPlayerId,
              toPlayerId,
              campaign.id,
              game.id,
              count,
              comment,
              transaction
            )
            if (fromPlayerId) {
              await MoneyBalance.changeBalance(
                fromPlayerId,
                campaign.id,
                count,
                false,
                true,
                transaction
              )
              await MoneyBalance.changeBalance(
                null,
                campaign.id,
                count,
                true,
                false,
                transaction
              )
            }
            if (toPlayerId) {
              await MoneyBalance.changeBalance(
                null,
                campaign.id,
                count,
                true,
                true,
                transaction
              )
              await MoneyBalance.changeBalance(
                toPlayerId,
                campaign.id,
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
    }
  )
)
