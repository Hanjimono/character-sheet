import { DamageBalancePlayerInfo } from "@/constants/types/damage"

export interface DamageBalanceStatsTableProps {
  /** Additional classes*/
  className?: string
  /** Stats to show */
  stats: DamageBalancePlayerInfo[]
}
