export interface PlayerStatBlockStats {
  rolls: {
    totalPositive: number
    totalNegative: number
  }
  damages: {
    totalPositive: number
    totalNegative: number
  }
  heals: {
    totalPositive: number
    totalNegative: number
  }
  moneyTotal: number
  selfHarmTotal?: number
  selfHarmPercentage?: number
}

export interface PlayerStatBlockProps {
  /** Additional class names. */
  className?: string
  /** Player display name. */
  playerName: string
  /** Optional player image URL. */
  playerImage?: string | null
  /** Dice stats: totalPositive = Nat 20, totalNegative = Nat 1. */
  rolls: PlayerStatBlockStats["rolls"]
  /** Damage stats: totalPositive = dealt, totalNegative = taken. */
  damages: PlayerStatBlockStats["damages"]
  /** Heal stats: totalPositive = given, totalNegative = received. */
  heals: PlayerStatBlockStats["heals"]
  /** Money amount (campaign total or game spent). */
  moneyTotal: number
  /** Total amount of self-harm damage. */
  selfHarmTotal?: number
  /** Percentage of total damage taken that was self-harm. */
  selfHarmPercentage?: number
  /** If true, labels indicate "this game" context (e.g. "Spent this game"). */
  isGameContext?: boolean
}
