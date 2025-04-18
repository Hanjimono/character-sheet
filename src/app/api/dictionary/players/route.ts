import { Player } from "@/database/models/player"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get("character")
  const players = await Player.getPlayersForCharacter(Number(characterId) || 0)

  return Response.json({ players })
}
