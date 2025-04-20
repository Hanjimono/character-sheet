import { Campaign } from "@/database/models/campaign"
import { DamageBalance } from "@/database/models/damageBalance"
import { DamageBalanceHistory } from "@/database/models/damageBalanceHistory"
import { Game } from "@/database/models/game"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const data = await request.json()
  const { player, isNegative, count, isSummon, comment } = data
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ success: false })
  }
  const activeGame = await Game.getActiveGame(campaign.id)
  if (!activeGame) {
    return Response.json({ success: false })
  }
  const historySaveResult = await DamageBalanceHistory.saveDamageForPlayer(
    player,
    campaign.id,
    activeGame.id,
    isNegative,
    count,
    isSummon,
    comment
  )
  if (!historySaveResult) {
    return Response.json({ success: false })
  }
  const balanceSaveResult = await DamageBalance.saveBalanceForPlayer(
    player,
    campaign.id,
    isNegative,
    count
  )
  if (!balanceSaveResult) {
    return Response.json({ success: false })
  }
  return Response.json({ success: true })
}
