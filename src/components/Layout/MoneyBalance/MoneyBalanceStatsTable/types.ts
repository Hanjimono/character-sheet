import { MoneyBalancePlayerInfo } from "@/constants/types/money"

export interface MoneyBalanceStatsTableProps {
  /** Classes */
  className?: string
  /** Stats of the money balance */
  stats: MoneyBalancePlayerInfo[]
}
