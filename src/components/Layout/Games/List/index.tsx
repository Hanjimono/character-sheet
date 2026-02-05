"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import Link from "next/link"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Ui
import Beam from "@/ui/Layout/Beam"
import Title from "@/ui/Presentation/Title"
import Text from "@/ui/Presentation/Text"
import Stack from "@/ui/Layout/Stack"
// Styles and types
import { GamesListProps } from "./types"
import Inline from "@/ui/Layout/Inline"

/**
 * GamesList component displays a list of all games for the active campaign.
 *
 * @param {string} className - Additional class names to apply
 * @param {number} characterId - The ID of the character
 */
function GamesList({ className, characterId }: GamesListProps) {
  useSetCharacterId(characterId)
  const calculatedClassNames = cx(twMerge("games-list", className))

  const { data: games, isLoading } = trpc.game.list.useQuery(undefined, {
    enabled: !!characterId
  })

  if (isLoading) {
    return (
      <Beam className={calculatedClassNames}>
        <Text size="small">Loading games...</Text>
      </Beam>
    )
  }

  if (!games || games.length === 0) {
    return (
      <Beam className={calculatedClassNames}>
        <Text size="small">No games found for this campaign.</Text>
      </Beam>
    )
  }

  return (
    <Stack className={calculatedClassNames}>
      <Title size={2}>All Games</Title>
      <div className="flex flex-col gap-2">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/character/${characterId}/games/${game.id}`}
            className="bg-block-700 hover:bg-block-600 p-4 rounded-md transition-colors"
          >
            <div className="flex justify-between items-center">
              <Inline className="items-center">
                <Text className="font-semibold">
                  Game #{game.id}
                  {game.isActive && (
                    <span className="ml-2 text-green-500">(Active)</span>
                  )}
                </Text>
                <Text size="small" className="text-gray-400">
                  {new Date(game.date).toLocaleDateString()}
                </Text>
              </Inline>
            </div>
          </Link>
        ))}
      </div>
    </Stack>
  )
}

export default GamesList
