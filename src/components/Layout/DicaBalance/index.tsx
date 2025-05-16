"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useCallback, useEffect, useMemo, useState } from "react"
// store
import { useStore } from "@/store"
// Components
import DiceBalanceStatsTable from "./DiceBalanceStatsTable"
import Dice from "@/components/Presentation/Dice"
import Button from "@/ui/Actions/Button"
// ui
import Room, { HiddenRoom } from "@/ui/Layout/Room"
import Switch from "@/ui/Form/Switch"
// Styles and types
import { DiceBalanceProps } from "./types"
import { DiceBalanceInfo, DiceBalancePlayerInfo } from "@/constants/types/dice"
import { useFetchAndStoreData } from "@/service/fetcher"

const GET_DICE_BALANCE_API = "/api/stats/rolls/total"
const GET_DICE_BALANCE_GAME_API = "/api/stats/rolls/game"

/**
 * Responsible for displaying and managing the balance of dice rolls
 * (positive and negative) for all players in a campaign or game. It provides functionality to view
 * critical roll statistics, toggle between total and current game stats, and open a modal to save dice rolls.
 *
 * @param {string} props.className - Additional CSS class names to style the component.
 * @param {string} props.campaignId - The ID of the campaign associated with the dice balance.
 * @param {string} props.characterId - The ID of the character associated with the dice balance.
 * @param {string} props.gameId - The ID of the game associated with the dice balance.
 */
function DiceBalance({ className, characterId, gameId }: DiceBalanceProps) {
  const [isShowGameStats, setIsShowGameStats] = useState(false)
  const [balance, loading, fetchBalance] =
    useFetchAndStoreData<DiceBalanceInfo>(
      isShowGameStats ? GET_DICE_BALANCE_GAME_API : GET_DICE_BALANCE_API,
      undefined,
      characterId
    )
  const params = useMemo(() => {
    return {
      isShowGameStats: isShowGameStats
    }
  }, [isShowGameStats])
  const [stats, statsLoading, fetchStats] = useFetchAndStoreData<
    DiceBalancePlayerInfo[]
  >("/api/stats/rolls/table", params, characterId)
  const fetchAllData = useCallback(() => {
    fetchBalance()
    fetchStats()
  }, [fetchBalance, fetchStats])
  const calculatedClassNames = cx(
    twMerge(
      "dice-balance min-w-full flex justify-center items-center",
      className
    )
  )
  const [isShowDetails, setIsShowDetails] = useState(false)
  const openModal = useStore((state) => state.openModal)
  const handleSaveDiceRoll = (isPositive: boolean) => {
    openModal("diceRollSaver", {
      isNegative: !isPositive,
      characterId: characterId,
      isNotClosable: true,
      onConfirm: fetchAllData
    })
  }

  return (
    <>
      <Room className={calculatedClassNames}>
        <div className="flex w-fit h-36 rounded-md shadow-sm shadow-block-600 bg-block-700">
          <Dice
            isPositive={false}
            onClick={handleSaveDiceRoll}
            count={balance ? balance.totalNegative || 0 : 0}
          />
          <div className="flex flex-col h-full justify-center content-center items-center px-4">
            <span className="text-2xl bold">Critical Rolls</span>
            <Switch
              name="total-critical-rolls"
              className="mt-close"
              onChange={() => setIsShowGameStats(!isShowGameStats)}
              checked={isShowGameStats}
              label="Game stats"
              disabled={!gameId}
            />
            <Button
              className="p-0 text-sm h-8"
              text
              secondary
              onClick={() => setIsShowDetails(!isShowDetails)}
              endIcon={isShowDetails ? "arrow_drop_up" : "arrow_drop_down"}
            >
              details
            </Button>
          </div>
          <Dice
            isPositive={true}
            onClick={handleSaveDiceRoll}
            count={balance ? balance.totalPositive || 0 : 0}
          />
        </div>
      </Room>
      <HiddenRoom isShown={isShowDetails}>
        <DiceBalanceStatsTable stats={stats || []} />
      </HiddenRoom>
    </>
  )
}

export default DiceBalance
