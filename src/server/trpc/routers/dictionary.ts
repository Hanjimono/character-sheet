// Server
import { publicProcedure, router } from "../trpc"
import { Character } from "@/database/models/character"

export const dictionaryRouter = router({
  players: publicProcedure.query(async ({ ctx }) => {
    return ctx.players
  }),
  characters: publicProcedure.query(async () => {
    const characters = await Character.findAll({
      order: [["name", "ASC"]]
    })
    return characters.map((char) => ({
      id: char.id,
      name: char.name,
      obsidianPath: char.obsidianPath
    }))
  })
})
