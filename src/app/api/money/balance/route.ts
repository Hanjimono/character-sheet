import { MoneyBalance } from "@/database/models/moneyBalance"
import { withCampaignContext } from "@/lib/api/context/campaing"

export const GET = withCampaignContext(async ({ campaign }) => {
  if (!campaign) {
    throw new Error("No campaign found")
  }
  const commonBalance = await MoneyBalance.getCommonBalance(campaign.id)
  const totalBalance = await MoneyBalance.getTotalBalance(campaign.id)
  return { total: totalBalance, common: commonBalance }
})
