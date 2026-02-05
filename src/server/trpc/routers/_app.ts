// Server
import { router } from "../trpc"
import { campaignRouter } from "./campaign"
import { dictionaryRouter } from "./dictionary"
import { gameRouter } from "./game"
import { moneyRouter } from "./money"
import { notesRouter } from "./notes"
import { statsRouter } from "./stats"

export const appRouter = router({
  campaign: campaignRouter,
  game: gameRouter,
  money: moneyRouter,
  stats: statsRouter,
  notes: notesRouter,
  dictionary: dictionaryRouter
})

export type AppRouter = typeof appRouter
