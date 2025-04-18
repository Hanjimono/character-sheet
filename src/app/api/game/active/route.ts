import { Campaign } from "@/database/models/campaign"
import { Game } from "@/database/models/game"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))
  if (!campaign) {
    return Response.json({ game: null })
  }
  const game = await Game.getActiveGame(campaign.id)
  return Response.json({ game })
}
