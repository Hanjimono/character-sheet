"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Lib
import { trpc } from "@/lib/trpc/client"
// Components
import SmartImage from "@/ui/Presentation/SmartImage"
// Ui
import Title from "@/ui/Presentation/Title"
import Button from "@/ui/Actions/Button"
// Styles and types
import { GameDamageHistoryTableProps } from "./types"

/**
 * Detailed table showing every damage record for a game as separate rows.
 *
 * @param {string} className - Additional class names to apply
 * @param {Array} damages - Array of damage records to display
 */
function GameDamageHistoryTable({
  className,
  damages,
  onDelete
}: GameDamageHistoryTableProps) {
  const utils = trpc.useUtils()
  const deleteMutation = trpc.stats.damage.delete.useMutation({
    onSuccess: () => {
      utils.stats.getGameHistory.invalidate()
      utils.stats.getGameStats.invalidate()
      utils.stats.getCampaignPlayerStats.invalidate()
      if (onDelete) {
        onDelete()
      }
    }
  })

  const handleDelete = async (historyId: number) => {
    if (confirm("Are you sure you want to delete this damage record?")) {
      await deleteMutation.mutateAsync({ historyId })
    }
  }
  const calculatedClassNames = cx(
    twMerge(
      "game-damage-history-table bg-block-700 min-w-full min-h-24 h-fit overflow-auto rounded-md p-4",
      className
    )
  )

  if (!damages || damages.length === 0) {
    return (
      <div className={calculatedClassNames}>
        <Title size={3}>Damages</Title>
        <p className="text-gray-400 mt-2">No damage records for this game.</p>
      </div>
    )
  }

  return (
    <div className={calculatedClassNames}>
      <div className="flex flex-col gap-2 overflow-visible">
        <div className="flex justify-between items-center w-full mb-almost-same">
          <Title size={3}>Damages</Title>
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
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Comment
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {damages.map((damage) => (
              <tr
                key={damage.id}
                className="bg-block-700 border-b dark:bg-block-700 dark:border-block-600 hover:bg-block-600 dark:hover:bg-block-600"
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {new Date(damage.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4">
                  {damage.player ? (
                    <div className="flex items-center gap-2">
                      {damage.player.image ? (
                        <SmartImage
                          src={damage.player.image}
                          alt={damage.player.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-block-600 flex items-center justify-center text-gray-400 text-xs font-semibold">
                          {damage.player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-white">
                        {damage.player.name}
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
                        "px-2 py-1 rounded text-xs",
                        damage.isNegative
                          ? "bg-red-900/30 text-red-300"
                          : "bg-green-900/30 text-green-300"
                      )
                    )}
                  >
                    {damage.isNegative ? "Taken" : "Dealt"}
                    {damage.isSummon && " (Summon)"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cx(
                      twMerge(
                        "font-semibold",
                        damage.isNegative ? "text-red-400" : "text-green-400"
                      )
                    )}
                  >
                    {damage.isNegative ? "-" : "+"}
                    {damage.count}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {damage.comment || "-"}
                </td>
                <td className="px-6 py-4">
                  <Button
                    icon="delete"
                    remove
                    isText
                    isSmall
                    onClick={() => handleDelete(damage.id)}
                    disabled={deleteMutation.isPending}
                    isLoading={deleteMutation.isPending}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GameDamageHistoryTable
