import { ApiGameContext } from "@/constants/types/api"
import { apiHandler } from "../handler"
import { getCampaignForCharacterId, getCharacterIdFromRequest } from "./helpers"
import { Game } from "@/database/models/game"
import { Player } from "@/database/models/player"
import { Character } from "@/database/models/character"

/**
 * A wrapper for API handlers that provides the game context.
 */
export function withGameContext<T>(
  handler: (ctx: ApiGameContext) => Promise<T>
) {
  return apiHandler(async (req) => {
    const characterId = await getCharacterIdFromRequest(req)
    const campaign = await getCampaignForCharacterId(characterId)
    const game: Game | null = campaign
      ? await Game.getActiveGame(campaign.id)
      : null
    const players: Player[] = await Player.getPlayersForCharacter(characterId)
    const character = await Character.findOne({
      where: {
        id: characterId
      }
    })
    return handler({ req, characterId, campaign, game, players, character })
  })
}
