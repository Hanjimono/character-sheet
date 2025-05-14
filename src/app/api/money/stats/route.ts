import { MoneyBalancePlayerInfo, MoneyHistory } from "@/constants/types/money"
import { MoneyBalance } from "@/database/models/moneyBalance"
import { MoneyBalanceHistory } from "@/database/models/moneyBalanceHistory"
import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ campaign, game, players }) => {
  if (!campaign) {
    throw new Error("No campaign found")
  }
  const info: MoneyBalancePlayerInfo[] = []
  for (const player of players) {
    const balance = await MoneyBalance.getBalance(player.id, campaign.id, false)
    let history: MoneyHistory[] = []
    if (!!game) {
      history = await MoneyBalanceHistory.getHistory(
        player.id,
        campaign.id,
        game.id
      )
    }
    info.push({
      player: player,
      amount: balance,
      history
    })
  }
  return info
})
