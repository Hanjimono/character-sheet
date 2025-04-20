import { COINS } from "@/constants/money"
import { BaseCoinTypes, CoinType } from "@/constants/types/money"

export function transformMoneyFromCopperToCoins(
  amount: number
): Record<BaseCoinTypes, number> {
  const transformedMoney: Record<BaseCoinTypes, number> = {
    gold: 0,
    silver: 0,
    copper: 0
  }
  transformedMoney.gold = Math.floor(amount / COINS.gold.inCopper)
  amount -= transformedMoney.gold * COINS.gold.inCopper
  transformedMoney.silver = Math.floor(amount / COINS.silver.inCopper)
  amount -= transformedMoney.silver * COINS.silver.inCopper
  transformedMoney.copper = amount

  return transformedMoney
}

export function transformCoinsToCopper(
  coins: Record<CoinType, number>
): number {
  let totalCopper = 0
  for (const coinType in coins) {
    if (Object.prototype.hasOwnProperty.call(coins, coinType)) {
      const coinValue = COINS[coinType as CoinType].inCopper
      totalCopper += coins[coinType as CoinType] * coinValue
    }
  }
  return totalCopper
}
