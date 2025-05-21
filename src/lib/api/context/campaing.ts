import { ApiCampaignContext } from "@/constants/types/api"
import { apiHandler } from "../handler"
import { getCampaignForCharacterId, getCharacterIdFromRequest } from "./helpers"
import { Character } from "@/database/models/character"

/**
 * A wrapper for API handlers that provides the campaign context.
 */
export function withCampaignContext<T>(
  handler: (ctx: ApiCampaignContext) => Promise<T>
) {
  return apiHandler(async (req) => {
    const characterId = await getCharacterIdFromRequest(req)
    const character = await Character.findOne({
      where: {
        id: characterId
      }
    })
    const campaign = await getCampaignForCharacterId(characterId)

    return handler({ req, characterId, campaign, character })
  })
}
