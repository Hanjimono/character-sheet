import { Campaign } from "@/database/models/campaign"
import { Game } from "@/database/models/game"
import { MoneyBalanceHistory } from "@/database/models/moneyBalanceHistory"
import { MoneyBalance } from "@/database/models/moneyBalance"
import sequelize from "@/lib/sequlize"
import { Player } from "@/database/models/player"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ success: false, error: "Campaign not found" })
  }
  const activeGame = await Game.getActiveGame(campaign.id)
  if (!activeGame) {
    return Response.json({ success: false, error: "Game not found" })
  }
  const body = await request.json()
  const {
    fromPlayerId = null,
    toPlayerId = null,
    count,
    isNegative = false,
    isTransfer = false,
    comment = null,
    isCommon = false
  } = body
  if (count <= 0 || (!fromPlayerId && !isCommon)) {
    return Response.json({ success: false, error: "Invalid data" })
  }
  if (isTransfer && !toPlayerId && !isCommon) {
    return Response.json({ success: false, error: "Invalid data" })
  }
  if (isTransfer && fromPlayerId === toPlayerId && !isCommon) {
    return Response.json({ success: false, error: "Invalid data" })
  }
  if (!isTransfer) {
    if (!isCommon) {
      const player = await Player.getPlayerById(fromPlayerId)
      if (!player) {
        return Response.json({ success: false, error: "Player not found" })
      }
      sequelize.transaction(async (transaction) => {
        await MoneyBalanceHistory.saveBalanceChange(
          player.id,
          null,
          campaign.id,
          activeGame.id,
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
          activeGame.id,
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
      const fromPlayer = await Player.getPlayerById(fromPlayerId)
      const toPlayer = await Player.getPlayerById(toPlayerId)
      if (!fromPlayer || !toPlayer) {
        return Response.json({ success: false, error: "Player not found" })
      }
      sequelize.transaction(async (transaction) => {
        await MoneyBalanceHistory.saveTransfer(
          fromPlayer.id,
          toPlayer.id,
          campaign.id,
          activeGame.id,
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
          return Response.json({ success: false, error: "Player not found" })
        }
      }
      if (!!toPlayerId) {
        const toPlayer = await Player.getPlayerById(toPlayerId)
        if (!toPlayer) {
          return Response.json({ success: false, error: "Player not found" })
        }
      }
      sequelize.transaction(async (transaction) => {
        await MoneyBalanceHistory.saveTransfer(
          fromPlayerId,
          toPlayerId,
          campaign.id,
          activeGame.id,
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
  return Response.json({ success: true })
}
