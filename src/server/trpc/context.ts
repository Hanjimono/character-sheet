// System
import { Campaign } from "@/database/models/campaign"
import { Character } from "@/database/models/character"
import { Game } from "@/database/models/game"
import { Player } from "@/database/models/player"

/**
 * Creates the tRPC context for each request.
 * Provides character, campaign, game, and players data based on characterId.
 */
export async function createContext(opts: { characterId?: number }) {
  const characterId = opts.characterId || 0

  const character = await Character.findOne({
    where: {
      id: characterId
    }
  })

  const campaign = await Campaign.getActiveCampaign(characterId)
  const game: Game | null = campaign
    ? await Game.getActiveGame(campaign.id)
    : null
  const players: Player[] = await Player.getPlayersForCharacter(characterId)

  return {
    characterId,
    character,
    campaign,
    game,
    players
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
