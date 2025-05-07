import { Campaign } from "@/database/models/campaign"

/**
 * Get the character ID from the request URL.
 */
export async function getCharacterIdFromRequest(req: Request): Promise<number> {
  const { searchParams } = new URL(req.url)
  return Number(searchParams.get("character") || 0)
}

/**
 * Get the active campaign for a given character ID.
 *
 * @param characterId - The ID of the character to get the campaign for.
 */
export async function getCampaignForCharacterId(
  characterId: number | string | null
): Promise<Campaign | null> {
  return await Campaign.getActiveCampaign(Number(characterId || 0))
}
