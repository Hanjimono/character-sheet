// System
import { z } from "zod"
// Server
import { publicProcedure, router } from "../trpc"

export const notesRouter = router({
  list: publicProcedure
    .input(
      z.object({
        folder: z.string().optional()
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.character) {
        throw new Error("Character not found")
      }
      const { parseNotesForCharacterInFolder } = await import(
        "@/lib/api/obsidianParser"
      )
      return parseNotesForCharacterInFolder(ctx.character, input.folder || null)
    }),
  important: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.character) {
      throw new Error("Character not found")
    }
    const { extractObsidianCallouts } = await import("@/lib/api/obsidianParser")
    const notePath = ctx.character.obsidianPath + "//" + "important.md"
    return extractObsidianCallouts(notePath)
  })
})
