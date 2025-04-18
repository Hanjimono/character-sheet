import { CoinType } from "@/constants/types/money"

export interface CoinSignProps {
  /** Type of coin */
  type: CoinType
  viewBox?: `${number} ${number} ${number} ${number}`
}
