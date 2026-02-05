// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Components
import CoinSign from "../CoinSign"
// Utils
import { transformMoneyFromCopperToCoins } from "@/utils"
// Styles and types
import { MoneyRenderProps } from "./types"

/**
 * Renders a visual representation of a monetary amount using gold, silver, and copper coins.
 *
 * @param props.className - Optional additional CSS class names to apply to the container.
 * @param props.amount - The total amount in copper coins to be displayed. Defaults to 0.
 * @param props.isShowZero - If true, displays zero values for all coin types; otherwise, only non-zero coins are shown.
 */
function MoneyRender({
  className,
  amount = 0,
  isShowZero = false
}: MoneyRenderProps) {
  const calculatedClassNames = cx(twMerge("money-render flex gap-1", className))
  const transformedAmount = transformMoneyFromCopperToCoins(amount)
  return (
    <div className={calculatedClassNames}>
      {(isShowZero || transformedAmount.gold > 0) && (
        <span className="text-gray-400">{transformedAmount.gold}</span>
      )}
      {(isShowZero || transformedAmount.gold > 0) && (
        <span className="text-gray-400 w-4 h-full">
          <CoinSign type="gold" />
        </span>
      )}
      {(isShowZero || transformedAmount.silver > 0) && (
        <span className="text-gray-400">{transformedAmount.silver}</span>
      )}
      {(isShowZero || transformedAmount.silver > 0) && (
        <span className="text-gray-400 w-4 h-full">
          <CoinSign type="silver" />
        </span>
      )}
      {(isShowZero || transformedAmount.copper > 0) && (
        <span className="text-gray-400">{transformedAmount.copper}</span>
      )}
      {(isShowZero || transformedAmount.copper > 0) && (
        <span className="text-gray-400 w-4 h-full">
          <CoinSign type="copper" />
        </span>
      )}
    </div>
  )
}
export default MoneyRender
