"use server"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Database
import { Campaign } from "@/database/models/campaign"
// components
import WithoutCampaignView from "./WithoutCampaignView"
import GameView from "./GameView"
// ui
import Beam from "@/ui/Layout/Beam"
import Title from "@/ui/Presentation/Title"
import Text from "@/ui/Presentation/Text"
// Styles and types
import { CampaignViewProps } from "./types"

async function CampaignView({ className, characterId }: CampaignViewProps) {
  const calculatedClassNames = cx(twMerge("campaign-view relative"), className)
  const campaign = await Campaign.getActiveCampaign(characterId)
  console.log("typeof UserList:", typeof WithoutCampaignView)
  if (!campaign) {
    return <WithoutCampaignView />
  }
  return (
    <Beam className={calculatedClassNames}>
      <Text className="absolute -top-5 left-1 text-gray-400" size="small">
        current campaign:
      </Text>
      <Title size={1} bottomGap="same">
        {campaign.name}
      </Title>
      <GameView campaignId={campaign.id} characterId={characterId} />
    </Beam>
  )
}
export default CampaignView
