import { withGameContext } from "@/lib/api/context/game"

export const GET = withGameContext(async ({ players }) => {
  return players
})
