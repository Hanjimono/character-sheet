import { Campaign } from "@/database/models/campaign"
import { Game } from "@/database/models/game"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ game: null })
  }
  const activeGame = await Game.getActiveGame(campaign.id)
  if (activeGame) {
    return Response.json({ game: activeGame })
  }
  const game = await Game.startNewGame(campaign.characterId, campaign.id)
  return Response.json({ game })
}
