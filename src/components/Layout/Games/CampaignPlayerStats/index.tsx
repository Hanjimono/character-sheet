"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Components
import PlayerStatBlock from "@/components/Layout/Games/PlayerStatBlock"
// Ui
import Beam from "@/ui/Layout/Beam"
import Text from "@/ui/Presentation/Text"
import Title from "@/ui/Presentation/Title"
// Styles and types
import { CampaignPlayerStatsProps } from "./types"

/**
 * Renders a row of player stat blocks with campaign totals (dices, damages, money total).
 *
 * @param {string} className - Additional class names to apply
 * @param {number} characterId - The ID of the character
 */
function CampaignPlayerStats({
  className,
  characterId
}: CampaignPlayerStatsProps) {
  useSetCharacterId(characterId)
  const calculatedClassNames = cx(twMerge("campaign-player-stats", className))

  const { data: playerStats, isLoading } =
    trpc.stats.getCampaignPlayerStats.useQuery(undefined, {
      enabled: !!characterId
    })

  if (isLoading) {
    return (
      <Beam className={calculatedClassNames}>
        <Text size="small">Loading player stats...</Text>
      </Beam>
    )
  }

  if (!playerStats || playerStats.length === 0) {
    return null
  }

  return (
    <div className={calculatedClassNames}>
      <Title size={3} className="mb-3">
        Campaign stats by player
      </Title>
      <div className="w-full px-24">
        <Beam className="gap-same-level">
          {playerStats.map((stat) => (
            <PlayerStatBlock
              key={stat.player.id}
              playerName={stat.player.name}
              playerImage={stat.player.image ?? null}
              rolls={stat.rolls}
              damages={stat.damages}
              moneyTotal={stat.moneyTotal}
              selfHarmTotal={stat.selfHarmTotal}
              selfHarmPercentage={stat.selfHarmPercentage}
              isGameContext={false}
            />
          ))}
        </Beam>
      </div>
    </div>
  )
}

export default CampaignPlayerStats
