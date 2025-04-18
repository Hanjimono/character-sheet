import { Campaign } from "@/database/models/campaign"
import { DiceBalance } from "@/database/models/diceBalance"
import { DiceBalanceHistory } from "@/database/models/diceBalanceHistory"
import { Game } from "@/database/models/game"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ totalPositive: 0, totalNegative: 0 })
  }
  const activeGame = await Game.getActiveGame(campaign.id)
  if (!activeGame) {
    return Response.json({ totalPositive: 0, totalNegative: 0 })
  }
  const balanceTotal = await DiceBalanceHistory.getRollsSum(
    campaign.id,
    activeGame.id
  )
  return Response.json({ ...balanceTotal })
}
