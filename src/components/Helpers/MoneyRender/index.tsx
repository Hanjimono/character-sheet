// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { MoneyRenderProps } from "./types"
import { transformMoneyFromCopperToCoins } from "@/utils"
import CoinSign from "../CoinSign"

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
