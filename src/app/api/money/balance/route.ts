import { Campaign } from "@/database/models/campaign"
import { MoneyBalance } from "@/database/models/moneyBalance"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ total: 0, common: 0 })
  }
  const commonBalance = await MoneyBalance.getCommonBalance(campaign.id)
  const totalBalance = await MoneyBalance.getTotalBalance(campaign.id)
  return Response.json({ total: totalBalance, common: commonBalance })
}
