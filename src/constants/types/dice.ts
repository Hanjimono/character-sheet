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

export interface DiceRollSaveRequest {
  player: number
  isNegative?: boolean
  test?: number
}
