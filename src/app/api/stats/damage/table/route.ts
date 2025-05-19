import { DamageBalancePlayerInfo } from "@/constants/types/damage"
import { DamageBalance } from "@/database/models/damageBalance"
import { DamageBalanceHistory } from "@/database/models/damageBalanceHistory"
import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ campaign, game, players }) => {
  if (!campaign) {
    throw new Error("No campaign found")
  }
  const stats: DamageBalancePlayerInfo[] = []
  for (const player of players) {
    const balance = {
      totalPositive: 0,
      totalNegative: 0
    }
    if (game) {
      const gameBalance = await DamageBalanceHistory.getDamageSum(
        campaign.id,
        game.id,
        player.id
      )
      balance.totalPositive = gameBalance.totalPositive
      balance.totalNegative = gameBalance.totalNegative
    } else {
      const balanceTotal = await DamageBalance.getTotalBalance(
        campaign.id,
        player.id
      )
      balance.totalPositive = balanceTotal.totalPositive
      balance.totalNegative = balanceTotal.totalNegative
    }
    stats.push({
      player: player,
      totalPositive: balance.totalPositive,
      totalNegative: balance.totalNegative
    })
  }
  return stats
})
