import { PlayerInfo } from "./players"

/** Information about the damage balance for the game */
export interface DamageBalanceInfo {
  /** Total dealt damage */
  totalPositive: number
  /** Total received damage */
  totalNegative: number
}

/** Information about the damage balance for a player */
export interface DamageBalancePlayerInfo {
  /** Player information */
  player: PlayerInfo
  /** Total dealt damage */
  totalPositive: number
  /** Total received damage */
  totalNegative: number
}

/** Information about the damage to save */
export interface DamageSaveRequest {
  /** Player ID of the player who is associated with the damage */
  player: number
  /** Amount of damage */
  count: number
  /** Comment for the damage */
  comment: string
  /** Whether the damage is negative (received) */
  isNegative?: boolean
  /** Whether the damage is from a summon */
  isSummon?: boolean
  /** Whether the damage is self-harm (for taken damage) */
  isSelfharm?: boolean
}
