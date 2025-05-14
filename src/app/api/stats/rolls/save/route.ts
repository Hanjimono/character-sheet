import { ApiGameContext } from "@/constants/types/api"
import { DiceRollSaveRequest } from "@/constants/types/dice"
import { DiceBalance } from "@/database/models/diceBalance"
import { DiceBalanceHistory } from "@/database/models/diceBalanceHistory"
import { withGameContext } from "@/lib/api/context/game"
import { withPostValidateContext } from "@/lib/api/context/postValidate"
import * as yup from "yup"

const saveRollValidateSchema = yup.object().shape({
  player: yup.number().required(),
  isNegative: yup.boolean(),
  test: yup.number().required()
})

export const POST = withGameContext(async (ctx) =>
  withPostValidateContext<DiceRollSaveRequest, ApiGameContext, boolean>(
    ctx,
    saveRollValidateSchema,
    async ({ game, campaign }, { player, isNegative }) => {
      if (!game || !campaign) {
        throw new Error("No active game or campaign")
      }
      const historySaveResult = await DiceBalanceHistory.saveRollForPlayer(
        player,
        campaign.id,
        game.id,
        isNegative || false
      )
      if (!historySaveResult) {
        throw new Error("Failed to save roll history")
      }
      const balanceSaveResult = await DiceBalance.saveBalanceForPlayer(
        player,
        campaign.id,
        isNegative || false
      )
      if (!balanceSaveResult) {
        throw new Error("Failed to save balance")
      }
      return true
    }
  )
)
