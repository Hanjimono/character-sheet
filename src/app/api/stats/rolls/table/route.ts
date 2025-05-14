import { DiceBalancePlayerInfo } from "@/constants/types/dice"
import { DiceBalance } from "@/database/models/diceBalance"
import { DiceBalanceHistory } from "@/database/models/diceBalanceHistory"
import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ req, game, campaign, players }) => {
  const { searchParams } = new URL(req.url)
  const isShowGameStats = searchParams.get("isShowGameStats") === "true"
  let gameId
  if (isShowGameStats) {
    if (!game || !campaign) {
      throw new Error("No game found")
    }
    gameId = game.id
  }
  if (!campaign) {
    throw new Error("No campaign found")
  }
  const stats: DiceBalancePlayerInfo[] = []
  for (const player of players) {
    const balance = {
      totalPositive: 0,
      totalNegative: 0
    }
    if (gameId) {
      const gameBalance = await DiceBalanceHistory.getRollsSum(
        campaign.id,
        gameId,
        player.id
      )
      balance.totalPositive = gameBalance.totalPositive
      balance.totalNegative = gameBalance.totalNegative
    } else {
      const balanceTotal = await DiceBalance.getTotalBalance(
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
