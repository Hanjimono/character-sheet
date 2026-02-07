import { PlayerInfo } from "./players"

/** Information about the heal balance for the game */
export interface HealBalanceInfo {
  /** Total heal given */
  totalPositive: number
  /** Total heal received */
  totalNegative: number
}

/** Information about the heal balance for a player */
export interface HealBalancePlayerInfo {
  /** Player information */
  player: PlayerInfo
  /** Total heal given */
  totalPositive: number
  /** Total heal received */
  totalNegative: number
}

/** Information about the heal to save */
export interface HealSaveRequest {
  /** Player ID of the player who is associated with the heal */
  player: number
  /** Amount of heal */
  count: number
  /** Comment for the heal */
  comment: string
  /** Whether the heal is negative (received) */
  isNegative?: boolean
}
