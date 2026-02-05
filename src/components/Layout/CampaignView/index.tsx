"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Components
import WithoutCampaignView from "./WithoutCampaignView"
import GameView from "./GameView"
// Ui
import Beam from "@/ui/Layout/Beam"
import Title from "@/ui/Presentation/Title"
import Text from "@/ui/Presentation/Text"
import Stack from "@/ui/Layout/Stack"
import Button from "@/ui/Actions/Button"
// Styles and types
import { CampaignViewProps } from "./types"

/**
 * CampaignView component displays the active campaign for a character.
 * Uses tRPC to fetch campaign data.
 *
 * @param {string} className - Additional class names to apply
 * @param {number} characterId - The ID of the character
 */
function CampaignView({ className, characterId }: CampaignViewProps) {
  useSetCharacterId(characterId)
  const calculatedClassNames = cx(twMerge("campaign-view relative"), className)

  const { data, isLoading } = trpc.campaign.active.useQuery(undefined, {
    enabled: !!characterId
  })

  if (isLoading) {
    return (
      <Beam className={calculatedClassNames}>
        <Text size="small">Loading campaign...</Text>
      </Beam>
    )
  }

  const campaign = data?.campaign

  if (!campaign) {
    return <WithoutCampaignView />
  }

  return (
    <Stack className={calculatedClassNames}>
      <Text className="absolute -top-5 left-1 text-gray-400" size="small">
        current campaign:
      </Text>
      <Title size={1}>{campaign.name}</Title>
      <Button
        link={`/character/${characterId}/games`}
        className="absolute -top-7.5 right-0"
        primary
        isText
        endIcon="arrow_forward"
        isNoPadding
      >
        View All Games
      </Button>
      <GameView campaignId={campaign.id} characterId={characterId} />
    </Stack>
  )
}

export default CampaignView
