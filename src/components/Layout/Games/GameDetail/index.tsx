"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Components
import PlayerStatBlock from "@/components/Layout/Games/PlayerStatBlock"
import GameDamageHistoryTable from "@/components/Layout/Games/GameDamageHistoryTable"
import GameRollHistoryTable from "@/components/Layout/Games/GameRollHistoryTable"
import GameMoneyHistoryTable from "@/components/Layout/Games/GameMoneyHistoryTable"
// Ui
import Beam from "@/ui/Layout/Beam"
import Title from "@/ui/Presentation/Title"
import Text from "@/ui/Presentation/Text"
import Stack from "@/ui/Layout/Stack"
// Styles and types
import { GameDetailProps } from "./types"

/**
 * GameDetail component displays detailed information about a specific game,
 * including damages, rolls, and money transactions.
 *
 * @param {string} className - Additional class names to apply
 * @param {number} characterId - The ID of the character
 * @param {number} gameId - The ID of the game
 */
function GameDetail({ className, characterId, gameId }: GameDetailProps) {
  useSetCharacterId(characterId)
  const calculatedClassNames = cx(twMerge("game-detail", className))

  const { data: gameStats, isLoading } = trpc.stats.getGameStats.useQuery(
    { gameId },
    {
      enabled: !!characterId && !!gameId
    }
  )

  const { data: gameHistory, isLoading: historyLoading } =
    trpc.stats.getGameHistory.useQuery(
      { gameId },
      {
        enabled: !!characterId && !!gameId
      }
    )

  if (isLoading || historyLoading) {
    return (
      <Beam className={calculatedClassNames}>
        <Text size="small">Loading game details...</Text>
      </Beam>
    )
  }

  if (!gameStats || !gameHistory) {
    return (
      <Beam className={calculatedClassNames}>
        <Text size="small">No game data found.</Text>
      </Beam>
    )
  }

  const moneyStats = gameStats.moneyTransactions.map((transaction) => {
    const totalAmount = transaction.history.reduce((sum, item) => {
      return sum + (item.isNegative ? -item.amount : item.amount)
    }, 0)
    return {
      player: transaction.player,
      amount: totalAmount,
      history: transaction.history
    }
  })

  return (
    <Stack className={calculatedClassNames} gap="distant">
      <Title size={2}>Game #{gameId}</Title>
      <div>
        <Title size={3} className="mb-3">
          This game by player
        </Title>
        <div className="w-full px-24">
          <Beam className="gap-same-level">
            {gameStats.damages.map((d, i) => (
              <PlayerStatBlock
                key={d.player.id}
                playerName={d.player.name}
                playerImage={d.player.image ?? null}
                rolls={
                  gameStats.rolls[i] ?? { totalPositive: 0, totalNegative: 0 }
                }
                damages={{
                  totalPositive: d.totalPositive,
                  totalNegative: d.totalNegative
                }}
                moneyTotal={moneyStats[i]?.amount ?? 0}
                isGameContext
              />
            ))}
          </Beam>
        </div>
      </div>
      <Stack gap="distant">
        <GameDamageHistoryTable damages={gameHistory.damages} />
        <GameRollHistoryTable rolls={gameHistory.rolls} />
        <GameMoneyHistoryTable transactions={gameHistory.moneyTransactions} />
      </Stack>
    </Stack>
  )
}

export default GameDetail
