import { Campaign } from "@/database/models/campaign"
import { DiceBalance } from "@/database/models/diceBalance"
import { DiceBalanceHistory } from "@/database/models/diceBalanceHistory"
import { Game } from "@/database/models/game"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const data = await request.json()
  const { player, isNegative } = data
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ success: false })
  }
  const activeGame = await Game.getActiveGame(campaign.id)
  if (!activeGame) {
    return Response.json({ success: false })
  }
  const historySaveResult = await DiceBalanceHistory.saveRollForPlayer(
    player,
    campaign.id,
    activeGame.id,
    isNegative
  )
  if (!historySaveResult) {
    return Response.json({ success: false })
  }
  const balanceSaveResult = await DiceBalance.saveBalanceForPlayer(
    player,
    campaign.id,
    isNegative
  )
  if (!balanceSaveResult) {
    return Response.json({ success: false })
  }
  return Response.json({ success: true })
}
