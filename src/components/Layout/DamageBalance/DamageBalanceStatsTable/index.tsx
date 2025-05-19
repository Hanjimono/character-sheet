// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Ui
import Title from "@/ui/Presentation/Title"
// Styles and types
import { DamageBalanceStatsTableProps } from "./types"

/**
 * Renders a table displaying damage balance statistics for a list of players.
 *
 * @param {string} [props.className] - Optional additional class names to apply to the table container.
 * @param {Array} props.stats - An array of player statistics objects, each containing player information and their damage dealt and taken.
 */
function DamageBalanceStatsTable({
  className,
  stats
}: DamageBalanceStatsTableProps) {
  const calculatedClassNames = cx(
    twMerge(
      "Damage-balance-stats-table bg-block-700 min-w-full min-h-24 h-fit overflow-auto rounded-md p-4",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      <div className="flex flex-col gap-2 overflow-visible">
        <div className="flex justify-between items-center w-full">
          <Title size={3} bottomGap="almost-same">
            Damage Balance
          </Title>
        </div>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-block-600 dark:bg-block-600 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Player
              </th>
              <th scope="col" className="px-6 py-3">
                Dealt
              </th>
              <th scope="col" className="px-6 py-3">
                Taken
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr
                key={stat.player.id}
                className="bg-block-700 border-b dark:bg-block-700 dark:border-block-600 hover:bg-block-600 dark:hover:bg-block-600"
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                  {stat.player.name}
                </td>
                <td className="px-6 py-4">{stat.totalPositive}</td>
                <td className="px-6 py-4">{stat.totalNegative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default DamageBalanceStatsTable
