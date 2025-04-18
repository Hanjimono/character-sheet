import { Campaign } from "@/database/models/campaign"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const campaign = await Campaign.getActiveCampaign(Number(characterId || 0))

  return Response.json({ campaign })
}
