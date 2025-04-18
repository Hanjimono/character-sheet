// System
// Styles and types
import { cx } from "class-variance-authority"
import { DiceBalanceStatsTableProps } from "./types"
import { twMerge } from "tailwind-merge"
import Room from "@/ui/Layout/Room"
import { useCallback, useEffect, useState } from "react"
import { DiceBalancePlayerInfo } from "@/constants/types/dice"
import Title from "@/ui/Presentation/Title"

function DiceBalanceStatsTable({
  className,
  campaignId,
  gameId,
  isShowGameStats
}: DiceBalanceStatsTableProps) {
  const calculatedClassNames = cx(
    twMerge(
      "dice-balance-stats-table bg-block-700 min-w-full min-h-24 h-fit overflow-auto rounded-md p-4",
      className
    )
  )
  const [stats, setStats] = useState<DiceBalancePlayerInfo[]>([])
  const fetchData = useCallback(async () => {
    const response = await fetch(
      "/api/stats/rolls/table" +
        `?character=${campaignId}` +
        `&game=${isShowGameStats}`
    )
    if (!response.ok) {
      return
    }
    const data = await response.json()
    setStats(data as DiceBalancePlayerInfo[])
  }, [campaignId, isShowGameStats])
  useEffect(() => {
    fetchData()
  }, [fetchData, isShowGameStats])
  return (
    <div className={calculatedClassNames}>
      <div className="flex flex-col gap-2 overflow-visible">
        <div className="flex justify-between items-center w-full">
          <Title size={3} bottomGap="almost-same">
            Dice Balance
          </Title>
        </div>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-block-600 dark:bg-block-600 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Player
              </th>
              <th scope="col" className="px-6 py-3">
                Nat 20
              </th>
              <th scope="col" className="px-6 py-3">
                Nat 1
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
export default DiceBalanceStatsTable
