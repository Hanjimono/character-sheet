import { PlayerInfo } from "./players"

export type BaseCoinTypes = "gold" | "silver" | "copper"

export type CoinType = BaseCoinTypes | "platinum" | "electrum"

/** Represents an information about a coin. */
export interface Coin {
  /** The type of coin. */
  type: CoinType
  /** The value of the coin in copper. */
  inCopper: number
  /** Abbreviation for the coin type. */
  abbreviation: string
  /** Text representation of the coin. */
  name: CoinType
}

/**
 * Represents a mapping of each `CoinType` to its corresponding `Coin` information.
 */
export type CoinsInfo = Record<CoinType, Coin>

/** Represents a player's money transaction history. */
export interface MoneyHistory {
  /** Amount of money involved in the transaction. */
  amount: number
  /** Indicates if the transaction is negative (debit) or positive (credit). */
  isNegative: boolean
  /** Indicates if the transaction is a transfer between players. */
  isTransfer: boolean
  /** The player from whom the money was transferred. */
  fromPlayer?: string
  /** The player to whom the money was transferred. */
  toPlayer?: string
  /** Comment or description associated with the transaction. */
  comment?: string
}

/**
 * Represents information about a money balance
 */
export interface MoneyBalanceInfo {
  /** Amount of common funds. */
  common: number
  /** Total amount of money for every player. */
  total: number
}
/**
 * Represents a player's money balance information.
 */
export interface MoneyBalancePlayerInfo {
  /** The player associated with this balance. */
  player: PlayerInfo
  /** The current amount of money the player has. */
  amount: number
  /** The transaction history for the player's money balance in currently active game */
  history: MoneyHistory[]
}
