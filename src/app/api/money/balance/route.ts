import { MoneyBalance } from "@/database/models/moneyBalance"
import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ campaign }) => {
  if (!campaign) {
    throw new Error("No campaign found")
  }
  const commonBalance = await MoneyBalance.getCommonBalance(campaign.id)
  const totalBalance = await MoneyBalance.getTotalBalance(campaign.id)
  return { total: totalBalance, common: commonBalance }
})
