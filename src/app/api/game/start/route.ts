import { Game } from "@/database/models/game"
import { withGameContext } from "@/lib/api/context/game"

export const POST = withGameContext(async ({ campaign, game }) => {
  if (!!game) {
    return game
  }
  if (!campaign) {
    throw new Error("Campaign not found")
  }
  const newGame = await Game.startNewGame(campaign.characterId, campaign.id)
  return newGame
})
