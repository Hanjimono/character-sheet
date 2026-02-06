"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Components
import SmartImage from "@/ui/Presentation/SmartImage"
// Ui
import Title from "@/ui/Presentation/Title"
// Styles and types
import { GameRollHistoryTableProps } from "./types"

/**
 * Detailed table showing every dice roll record for a game as separate rows.
 *
 * @param {string} className - Additional class names to apply
 * @param {Array} rolls - Array of roll records to display
 */
function GameRollHistoryTable({ className, rolls }: GameRollHistoryTableProps) {
  const calculatedClassNames = cx(
    twMerge(
      "game-roll-history-table bg-block-700 min-w-full min-h-24 h-fit overflow-auto rounded-md p-4",
      className
    )
  )

  if (!rolls || rolls.length === 0) {
    return (
      <div className={calculatedClassNames}>
        <Title size={3}>Rolls</Title>
        <p className="text-gray-400 mt-2">No roll records for this game.</p>
      </div>
    )
  }

  return (
    <div className={calculatedClassNames}>
      <div className="flex flex-col gap-2 overflow-visible">
        <div className="flex justify-between items-center w-full mb-almost-same">
          <Title size={3}>Rolls</Title>
        </div>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-block-600 dark:bg-block-600 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                Player
              </th>
              <th scope="col" className="px-6 py-3">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {rolls.map((roll) => (
              <tr
                key={roll.id}
                className="bg-block-700 border-b dark:bg-block-700 dark:border-block-600 hover:bg-block-600 dark:hover:bg-block-600"
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {new Date(roll.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4">
                  {roll.player ? (
                    <div className="flex items-center gap-2">
                      {roll.player.image ? (
                        <SmartImage
                          src={roll.player.image}
                          alt={roll.player.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-block-600 flex items-center justify-center text-gray-400 text-xs font-semibold">
                          {roll.player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-white">
                        {roll.player.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cx(
                      twMerge(
                        "px-3 py-1 rounded font-bold text-lg",
                        roll.isNegative
                          ? "bg-red-900/30 text-red-300"
                          : "bg-green-900/30 text-green-300"
                      )
                    )}
                  >
                    {roll.isNegative ? "Nat 1" : "Nat 20"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GameRollHistoryTable
