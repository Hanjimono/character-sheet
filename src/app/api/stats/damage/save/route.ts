import { ApiGameContext } from "@/constants/types/api"
import { DamageSaveRequest } from "@/constants/types/damage"
import { DamageBalance } from "@/database/models/damageBalance"
import { DamageBalanceHistory } from "@/database/models/damageBalanceHistory"
import { withGameContext } from "@/lib/api/context/game"
import { withPostValidateContext } from "@/lib/api/context/postValidate"
import * as yup from "yup"

const saveDamageValidateSchema = yup.object().shape({
  player: yup.number().required(),
  isNegative: yup.boolean(),
  count: yup.number().required(),
  isSummon: yup.boolean(),
  comment: yup.string().required()
})

export const POST = withGameContext(async (ctx) =>
  withPostValidateContext<DamageSaveRequest, ApiGameContext, boolean>(
    ctx,
    saveDamageValidateSchema,
    async (
      { game, campaign },
      { player, count, comment, isNegative = false, isSummon = false }
    ) => {
      if (!game || !campaign) {
        throw new Error("No active game or campaign")
      }

      const historySaveResult = await DamageBalanceHistory.saveDamageForPlayer(
        player,
        campaign.id,
        game.id,
        isNegative,
        count,
        isSummon,
        comment
      )
      if (!historySaveResult) {
        throw new Error("Failed to save damage history")
      }
      const balanceSaveResult = await DamageBalance.saveBalanceForPlayer(
        player,
        campaign.id,
        isNegative,
        count
      )
      if (!balanceSaveResult) {
        throw new Error("Failed to save damage balance")
      }
      return true
    }
  )
)
