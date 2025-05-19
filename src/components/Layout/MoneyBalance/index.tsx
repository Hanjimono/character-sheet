// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
// Service
import { useFetchAndStoreData } from "@/service/fetcher"
// store
import { useStore } from "@/store"
// Components
import MoneyBalanceStatsTable from "./MoneyBalanceStatsTable"
import MoneyRender from "@/components/Helpers/MoneyRender"
// ui
import Beam from "@/ui/Layout/Beam"
import Button from "@/ui/Actions/Button"
import Text from "@/ui/Presentation/Text"
import Divider from "@/ui/Presentation/Divider"
import Room, { HiddenRoom } from "@/ui/Layout/Room"
import Title from "@/ui/Presentation/Title"
// Styles and types
import { MoneyBalanceProps } from "./types"
import {
  MoneyBalanceInfo,
  MoneyBalancePlayerInfo
} from "@/constants/types/money"

/**
 * Displays the money balance for a campaign, including common funds and players totals.
 * Provides UI controls for viewing details and performing money-related actions (add, subtract, transfer).
 *
 * @param {string} props.className - Optional additional class names for styling.
 * @param {string} props.characterId - The ID of the character whose balance is displayed.
 * @param {string} props.gameId - The ID of the game, used for showing detailed stats.
 */
function MoneyBalance({ className, characterId, gameId }: MoneyBalanceProps) {
  const calculatedClassNames = cx(
    twMerge(
      "money-balance bg-block-700 min-w-full min-h-8 p-2 rounded-md",
      className
    )
  )
  const [moneyBalance, loading, fetchBalance] =
    useFetchAndStoreData<MoneyBalanceInfo>(
      "/api/money/balance",
      null,
      characterId
    )
  const [stats, statsLoading, fetchStats] = useFetchAndStoreData<
    MoneyBalancePlayerInfo[]
  >("/api/money/stats", null, characterId)
  const [isShowDetails, setIsShowDetails] = useState(false)
  const openModal = useStore((state) => state.openModal)
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])
  const handleDataFetch = () => {
    fetchBalance()
    fetchStats()
  }
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
      onConfirm: handleDataFetch
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
            amount={moneyBalance ? moneyBalance.common : 0}
            isShowZero
          />
          <MoneyBalanceActionPanel
            handleChangeMoney={handleChangeMoney}
            isCommon
          />
        </Beam>
        <Divider gap="almost-same" />
        <Beam contentAlign="center">
          <Title size={4} bottomGap="same" className="text-gray-400">
            Players total:
          </Title>
          <MoneyRender
            className="bg-block-800 py-2 px-3 rounded-lg"
            amount={moneyBalance ? moneyBalance.total : 0}
            isShowZero
          />
          <MoneyBalanceActionPanel
            handleChangeMoney={handleChangeMoney}
            isCommon={false}
          />
        </Beam>
      </Room>
      <HiddenRoom isShown={isShowDetails && !!gameId}>
        <MoneyBalanceStatsTable stats={stats || []} />
      </HiddenRoom>
    </>
  )
}

/**
 * Renders a panel with action buttons for managing money balance.
 *
 * @param handleChangeMoney - Callback function invoked when an action button is clicked.
 *   - `isNegative`: Indicates if the action is a subtraction.
 *   - `isTransfer`: Indicates if the action is a transfer.
 *   - `isCommon`: Indicates if the action applies to the common balance.
 * @param isCommon - Optional flag to specify if the actions apply to the common balance. Defaults to `false`.
 *
 * The panel includes three buttons:
 * - Add (plus icon): Calls `handleChangeMoney(false, false, isCommon)`
 * - Remove (minus icon): Calls `handleChangeMoney(true, false, isCommon)`
 * - Transfer (swap icon): Calls `handleChangeMoney(false, true, isCommon)`
 */
function MoneyBalanceActionPanel({
  handleChangeMoney,
  isCommon = false
}: {
  handleChangeMoney: (
    isNegative: boolean,
    isTransfer: boolean,
    isCommon: boolean
  ) => void
  isCommon?: boolean
}) {
  return (
    <div className="flex gap-1">
      <Button
        className="h-6 w-6"
        icon="add"
        text
        onClick={() => handleChangeMoney(false, false, isCommon)}
      />
      <Button
        className="h-6 w-6"
        icon="remove"
        text
        onClick={() => handleChangeMoney(true, false, isCommon)}
      />
      <Button
        className="h-6 w-6"
        icon="swap_horiz"
        text
        onClick={() => handleChangeMoney(false, true, isCommon)}
      />
    </div>
  )
}
export default MoneyBalance
