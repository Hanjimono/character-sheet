import { PlayerInfo } from "./players"

export interface DamageBalanceInfo {
  totalPositive: number
  totalNegative: number
}

export interface DamageBalancePlayerInfo {
  player: PlayerInfo
  totalPositive: number
  totalNegative: number
}
