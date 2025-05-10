import { Game } from "@/database/models/game"
import { withGameContext } from "@/lib/api/context/game"

export const POST = withGameContext(async ({ game }) => {
  if (!game) {
    throw new Error("Active game not found")
  }
  await Game.endGame(game.id)
  return true
})
