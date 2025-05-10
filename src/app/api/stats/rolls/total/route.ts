import { DiceBalance } from "@/database/models/diceBalance"
import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ campaign }) => {
  if (!campaign) {
    throw new Error("No campaign found")
  }
  const balanceTotal = await DiceBalance.getTotalBalance(campaign.id)
  return balanceTotal
})
