import { DiceBalanceHistory } from "@/database/models/diceBalanceHistory"
import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ game, campaign }) => {
  if (!game || !campaign) {
    throw new Response("No game or campaign found")
  }
  const balanceTotal = await DiceBalanceHistory.getRollsSum(
    campaign.id,
    game.id
  )
  return balanceTotal
})
