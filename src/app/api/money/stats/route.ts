import { MoneyBalancePlayerInfo } from "@/constants/types/money"
import { Campaign } from "@/database/models/campaign"
import { Game } from "@/database/models/game"
import { MoneyBalance } from "@/database/models/moneyBalance"
import { MoneyBalanceHistory } from "@/database/models/moneyBalanceHistory"
import { Player } from "@/database/models/player"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  const info: MoneyBalancePlayerInfo[] = []
  if (!campaign) {
    return Response.json(info)
  }
  const players = await Player.getPlayersForCharacter(Number(characterId || 0))
  if (!players) {
    return Response.json(info)
  }
  for (const player of players) {
    const balance = await MoneyBalance.getBalance(player.id, campaign.id, false)
    info.push({
      player: player,
      amount: balance,
      history: []
    })
  }
  const activeGame = await Game.getActiveGame(campaign.id)
  if (!activeGame) {
    return Response.json(info)
  }
  for (const player of players) {
    const playerInfo = info.find((info) => info.player.id === player.id)
    if (playerInfo) {
      const history = await MoneyBalanceHistory.getHistory(
        player.id,
        campaign.id,
        activeGame.id
      )
      playerInfo.history = history
    }
  }
  return Response.json(info)
}
