import { PlayerInfo } from "./players"

export interface DiceBalanceInfo {
  totalPositive: number
  totalNegative: number
}

export interface DiceBalancePlayerInfo {
  player: PlayerInfo
  totalPositive: number
  totalNegative: number
}
