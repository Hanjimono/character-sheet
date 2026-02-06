"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Lib
import { trpc } from "@/lib/trpc/client"
// Components
import MoneyRender from "@/components/Helpers/MoneyRender"
import SmartImage from "@/ui/Presentation/SmartImage"
// Ui
import Title from "@/ui/Presentation/Title"
import Button from "@/ui/Actions/Button"
// Styles and types
import { GameMoneyHistoryTableProps } from "./types"

/**
 * Detailed table showing every money transaction record for a game as separate rows.
 *
 * @param {string} className - Additional class names to apply
 * @param {Array} transactions - Array of money transaction records to display
 */
function GameMoneyHistoryTable({
  className,
  transactions,
  onDelete
}: GameMoneyHistoryTableProps) {
  const utils = trpc.useUtils()
  const deleteMutation = trpc.money.delete.useMutation({
    onSuccess: () => {
      utils.stats.getGameHistory.invalidate()
      utils.stats.getGameStats.invalidate()
      utils.stats.getCampaignPlayerStats.invalidate()
      utils.money.balance.invalidate()
      utils.money.stats.invalidate()
      if (onDelete) {
        onDelete()
      }
    }
  })

  const handleDelete = async (historyId: number) => {
    if (confirm("Are you sure you want to delete this money transaction?")) {
      await deleteMutation.mutateAsync({ historyId })
    }
  }
  const calculatedClassNames = cx(
    twMerge(
      "game-money-history-table bg-block-700 min-w-full min-h-24 h-fit overflow-auto rounded-md p-4",
      className
    )
  )

  if (!transactions || transactions.length === 0) {
    return (
      <div className={calculatedClassNames}>
        <Title size={3}>Money Transactions</Title>
        <p className="text-gray-400 mt-2">
          No money transactions for this game.
        </p>
      </div>
    )
  }

  return (
    <div className={calculatedClassNames}>
      <div className="flex flex-col gap-2 overflow-visible">
        <div className="flex justify-between items-center w-full mb-almost-same">
          <Title size={3}>Money Transactions</Title>
        </div>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-block-600 dark:bg-block-600 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                From
              </th>
              <th scope="col" className="px-6 py-3">
                To
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
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="bg-block-700 border-b dark:bg-block-700 dark:border-block-600 hover:bg-block-600 dark:hover:bg-block-600"
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {new Date(transaction.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4">
                  {transaction.fromPlayer ? (
                    <div className="flex items-center gap-2">
                      {transaction.fromPlayer.image ? (
                        <SmartImage
                          src={transaction.fromPlayer.image}
                          alt={transaction.fromPlayer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-block-600 flex items-center justify-center text-gray-400 text-xs font-semibold">
                          {transaction.fromPlayer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-white">
                        {transaction.fromPlayer.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Common funds</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {transaction.toPlayer ? (
                    <div className="flex items-center gap-2">
                      {transaction.toPlayer.image ? (
                        <SmartImage
                          src={transaction.toPlayer.image}
                          alt={transaction.toPlayer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-block-600 flex items-center justify-center text-gray-400 text-xs font-semibold">
                          {transaction.toPlayer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-white">
                        {transaction.toPlayer.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Common funds</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cx(
                      twMerge(
                        "px-2 py-1 rounded text-xs",
                        transaction.isTransfer
                          ? "bg-blue-900/30 text-blue-300"
                          : transaction.isNegative
                            ? "bg-red-900/30 text-red-300"
                            : "bg-green-900/30 text-green-300"
                      )
                    )}
                  >
                    {transaction.isTransfer
                      ? "Transfer"
                      : transaction.isNegative
                        ? "Spent"
                        : "Earned"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={cx(
                      twMerge(
                        "flex items-center gap-1 justify-start",
                        transaction.isNegative
                          ? "text-red-400"
                          : "text-green-400"
                      )
                    )}
                  >
                    {transaction.isNegative ? "-" : "+"}
                    <MoneyRender amount={transaction.amount} />
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {transaction.comment || "-"}
                </td>
                <td className="px-6 py-4">
                  <Button
                    icon="delete"
                    remove
                    isText
                    isSmall
                    onClick={() => handleDelete(transaction.id)}
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

export default GameMoneyHistoryTable
