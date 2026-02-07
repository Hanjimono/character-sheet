import { HealBalancePlayerInfo } from "@/constants/types/heal"

export interface HealBalanceStatsTableProps {
  /** Additional classes*/
  className?: string
  /** Stats to show */
  stats: HealBalancePlayerInfo[]
}
