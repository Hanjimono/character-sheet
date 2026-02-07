// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Ui
import Title from "@/ui/Presentation/Title"
// Styles and types
import { HealBalanceStatsTableProps } from "./types"

/**
 * Renders a table displaying heal balance statistics for a list of players.
 *
 * @param {string} [props.className] - Optional additional class names to apply to the table container.
 * @param {Array} props.stats - An array of player statistics objects, each containing player information and their heal given and received.
 */
function HealBalanceStatsTable({
  className,
  stats
}: HealBalanceStatsTableProps) {
  const calculatedClassNames = cx(
    twMerge(
      "heal-balance-stats-table bg-block-700 min-w-full min-h-24 h-fit overflow-auto rounded-md p-4",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      <div className="flex flex-col gap-2 overflow-visible">
        <div className="flex justify-between items-center w-full mb-almost-same">
          <Title size={3}>Heal Balance</Title>
        </div>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-block-600 dark:bg-block-600 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Player
              </th>
              <th scope="col" className="px-6 py-3">
                Given
              </th>
              <th scope="col" className="px-6 py-3">
                Received
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
export default HealBalanceStatsTable
