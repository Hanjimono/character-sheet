// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { MoneyBalanceProps } from "./types"
import CoinSign from "@/components/Helpers/CoinSign"
import Room, { HiddenRoom } from "@/ui/Layout/Room"
import Title from "@/ui/Presentation/Title"
import MoneyRender from "@/components/Helpers/MoneyRender"
import Beam from "@/ui/Layout/Beam"
import Button from "@/ui/Actions/Button"
import Text from "@/ui/Presentation/Text"
import Divider from "@/ui/Presentation/Divider"
import { useStore } from "@/store"
import { useCallback, useEffect, useState } from "react"
import MoneyBalanceStatsTable from "./MoneyBalanceStatsTable"

function MoneyBalance({ className, characterId, gameId }: MoneyBalanceProps) {
  const calculatedClassNames = cx(
    twMerge(
      "money-balance bg-block-700 min-w-full min-h-8 p-2 rounded-md",
      className
    )
  )
  const [moneyBalance, setMoneyBalance] = useState({ total: 0, common: 0 })
  const [isShowDetails, setIsShowDetails] = useState(false)
  const openModal = useStore((state) => state.openModal)
  const fetchBalance = useCallback(async () => {
    const response = await fetch(`/api/money/balance?character=${characterId}`)
    const data = await response.json()
    setMoneyBalance(data)
  }, [characterId])
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])
  const handleChangeMoney = (
    isNegative: boolean = false,
    isTransfer: boolean = false,
    isCommon: boolean = false
  ) => {
    openModal("moneyChangeSaver", {
      characterId,
      isNegative,
      isTransfer,
      isCommon,
      isNotClosable: true,
      onConfirm: fetchBalance
    })
  }
  return (
    <>
      <Room className={calculatedClassNames} noGap>
        <Beam className="relative">
          <Title size={3} bottomGap="almost-same">
            Money Balance
          </Title>
          <Button
            className="absolute right-0 top-0 text-sm text-gray-300"
            endIcon={isShowDetails ? "arrow_drop_up" : "arrow_drop_down"}
            onClick={() => setIsShowDetails((prev) => !prev)}
            text
          >
            details
          </Button>
        </Beam>
        <Beam contentAlign="center">
          <Text className="text-gray-400" size="small">
            Common funds:
          </Text>
          <MoneyRender
            className="bg-block-800 py-2 px-3 rounded-lg"
            amount={moneyBalance.common}
            isShowZero
          />
          <div className="flex gap-1">
            <Button
              className="h-6 w-6"
              icon="add"
              text
              onClick={() => handleChangeMoney(false, false, true)}
            />
            <Button
              className="h-6 w-6"
              icon="remove"
              text
              onClick={() => handleChangeMoney(true, false, true)}
            />
            <Button
              className="h-6 w-6"
              icon="swap_horiz"
              text
              onClick={() => handleChangeMoney(false, true, true)}
            />
          </div>
        </Beam>
        <Divider gap="almost-same" />
        <Beam contentAlign="center">
          <Title size={4} bottomGap="same" className="text-gray-400">
            Players total:
          </Title>
          <MoneyRender
            className="bg-block-800 py-2 px-3 rounded-lg"
            amount={moneyBalance.total}
            isShowZero
          />
          <div className="flex gap-1">
            <Button
              className="h-6 w-6"
              icon="add"
              text
              onClick={() => handleChangeMoney(false, false, false)}
            />
            <Button
              className="h-6 w-6"
              icon="remove"
              text
              onClick={() => handleChangeMoney(true, false, false)}
            />
            <Button
              className="h-6 w-6"
              icon="swap_horiz"
              text
              onClick={() => handleChangeMoney(false, true, false)}
            />
          </div>
        </Beam>
      </Room>
      <HiddenRoom isShown={isShowDetails && !!gameId}>
        <MoneyBalanceStatsTable
          characterId={characterId}
          totalBalance={moneyBalance.total}
        />
      </HiddenRoom>
    </>
  )
}
export default MoneyBalance
