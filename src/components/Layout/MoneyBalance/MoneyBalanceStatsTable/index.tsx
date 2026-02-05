// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Components
import MoneyRender from "@/components/Helpers/MoneyRender"
// Styles and types
import { MoneyBalanceStatsTableProps } from "./types"

/**
 * Renders a table displaying the money balance statistics for players associated with a character.
 * If there is an active game, it also shows the transaction history for each player.
 *
 * @param {string} [props.className] - Optional additional class names to apply to the root element.
 * @param {string | number} props.characterId - The ID of the character whose money stats are being displayed.
 */
function MoneyBalanceStatsTable({
  className,
  stats
}: MoneyBalanceStatsTableProps) {
  const calculatedClassNames = cx(
    twMerge(
      "money-balance-stats bg-block-700 min-w-full min-h-24 h-fit overflow-auto rounded-md p-4",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      <div className="flex flex-col gap-2 overflow-visible">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-semibold text-gray-200">Money Balance</h3>
        </div>
      </div>
      {stats &&
        stats.map((stat) => (
          <>
            <div
              key={stat.player.id}
              className="flex justify-between items-center w-full p-2 bg-block-600 rounded-md mb-2"
            >
              <span className="text-gray-200">{stat.player.name}</span>
              <span className="text-gray-200">
                <MoneyRender
                  amount={stat.amount}
                  className="bg-block-800 py-2 px-3 rounded-lg"
                  isShowZero
                />
              </span>
            </div>
            {stat.history.length > 0 && (
              <div className="flex flex-col overflow-visible">
                {stat.history.map((history, idx) => (
                  <div
                    key={idx}
                    className={cx(
                      twMerge(
                        "flex justify-between items-center w-full px-2 py-0.5 rounded-md mb-2",
                        history.isNegative ? "bg-red-800/25" : "bg-green-700/25"
                      )
                    )}
                  >
                    <span className="text-gray-400">
                      {history.comment}
                      {history.isTransfer && (
                        <span className="text-gray-400">
                          {history.isNegative && ` (->${history.toPlayer})`}
                          {!history.isNegative && ` (<-${history.fromPlayer})`}
                        </span>
                      )}
                    </span>
                    <span className="text-gray-200">
                      <MoneyRender amount={history.amount} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ))}
    </div>
  )
}
export default MoneyBalanceStatsTable
