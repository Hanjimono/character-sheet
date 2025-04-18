import { Campaign } from "@/database/models/campaign"
import { DiceBalance } from "@/database/models/diceBalance"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ totalPositive: 0, totalNegative: 0 })
  }
  const balanceTotal = await DiceBalance.getTotalBalance(campaign.id)
  return Response.json({ ...balanceTotal })
}
