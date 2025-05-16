import { DiceBalancePlayerInfo } from "@/constants/types/dice"

export interface DiceBalanceStatsTableProps {
  /** Additional classes*/
  className?: string
  /** Stats for table */
  stats: DiceBalancePlayerInfo[]
}
