import { PlayerInfo } from "./players"

/**
 * Represents the balance information of dice rolls.
 */
export interface DiceBalanceInfo {
  /** the total number of positive outcomes */
  totalPositive: number
  /** the total number of negative outcomes */
  totalNegative: number
}

/**
 * Represents the balance information of dice for a specific player.
 */
export interface DiceBalancePlayerInfo {
  /** the player associated with this balance information */
  player: PlayerInfo
  /** the total number of positive dice */
  totalPositive: number
  /** the total number of negative dice */
  totalNegative: number
}

/**
 * Represents a request to save a dice roll.
 */
export interface DiceRollSaveRequest {
  /** The ID of the player who made the roll */
  player: number
  /** If the roll is positive(nat20) or negative(nat1) */
  isNegative?: boolean
}
