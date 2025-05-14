import { PlayerInfo } from "./players"

export type BaseCoinTypes = "gold" | "silver" | "copper"

export type CoinType = BaseCoinTypes | "platinum" | "electrum"

export interface Coin {
  type: CoinType
  inCopper: number
  abbreviation: string
  name: CoinType
}

export type CoinsInfo = Record<CoinType, Coin>

export interface MoneyHistory {
  amount: number
  isNegative: boolean
  isTransfer: boolean
  fromPlayer?: string
  toPlayer?: string
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
export interface MoneyBalancePlayerInfo {
  player: PlayerInfo
  amount: number
  history: MoneyHistory[]
}
