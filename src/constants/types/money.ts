export type BaseCoinTypes = "gold" | "silver" | "copper"

export type CoinType = BaseCoinTypes | "platinum" | "electrum"

export interface Coin {
  type: CoinType
  inCopper: number
  abbreviation: string
  name: CoinType
}

export type CoinsInfo = Record<CoinType, Coin>
