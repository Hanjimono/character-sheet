import { DamageBalanceHistory } from "@/database/models/damageBalanceHistory"
import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ campaign, game, players }) => {
  if (!campaign) {
    throw new Error("No campaign or game found")
  }
  if (!game) {
    return { totalPositive: 0, totalNegative: 0 }
  }
  const balanceTotal = await DamageBalanceHistory.getDamageSum(
    campaign.id,
    game.id
  )
  return balanceTotal
})
