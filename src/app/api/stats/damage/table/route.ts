import { DamageBalancePlayerInfo } from "@/constants/types/damage"
import { Campaign } from "@/database/models/campaign"
import { DamageBalance } from "@/database/models/damageBalance"
import { DamageBalanceHistory } from "@/database/models/damageBalanceHistory"
import { Game } from "@/database/models/game"
import { Player } from "@/database/models/player"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const isGameStats = searchParams.get("game")
  const stats: DamageBalancePlayerInfo[] = []
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json(stats)
  }
  let gameId
  if (isGameStats) {
    const activeGame = await Game.getActiveGame(campaign.id)
    if (!activeGame) {
      return Response.json(stats)
    }
    gameId = activeGame.id
  }
  const players = await Player.getPlayersForCharacter(Number(characterId || 0))
  if (!players) {
    return Response.json(stats)
  }
  for (const player of players) {
    const balance = {
      totalPositive: 0,
      totalNegative: 0
    }
    if (gameId) {
      const gameBalance = await DamageBalanceHistory.getDamageSum(
        campaign.id,
        gameId,
        player.id
      )
      balance.totalPositive = gameBalance.totalPositive
      balance.totalNegative = gameBalance.totalNegative
    } else {
      const balanceTotal = await DamageBalance.getTotalBalance(
        campaign.id,
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
  return Response.json(stats)
}
