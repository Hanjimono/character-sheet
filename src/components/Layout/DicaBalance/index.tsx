"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
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
import Stack from "@/ui/Layout/Stack"

/**
 * Responsible for displaying and managing the balance of dice rolls
 * (positive and negative) for all players in a campaign or game. It provides functionality to view
 * critical roll statistics, toggle between total and current game stats, and open a modal to save dice rolls.
 *
 * @param {string} className - Additional CSS class names to style the component.
 * @param {number} characterId - The ID of the character associated with the dice balance.
 * @param {number} gameId - The ID of the game associated with the dice balance.
 */
function DiceBalance({ className, characterId, gameId }: DiceBalanceProps) {
  useSetCharacterId(characterId)
  const [isShowGameStats, setIsShowGameStats] = useState(false)
  const utils = trpc.useUtils()
  const { data: totalBalance, isLoading: totalLoading } =
    trpc.stats.rolls.total.useQuery(undefined, {
      enabled: !!characterId && !isShowGameStats
    })
  const { data: gameBalance, isLoading: gameLoading } =
    trpc.stats.rolls.game.useQuery(undefined, {
      enabled: !!characterId && !!isShowGameStats && !!gameId
    })
  const { data: stats, isLoading: statsLoading } =
    trpc.stats.rolls.table.useQuery(
      { isShowGameStats },
      { enabled: !!characterId }
    )
  const balance = isShowGameStats ? gameBalance : totalBalance
  const loading = isShowGameStats ? gameLoading : totalLoading
  const calculatedClassNames = cx(
    twMerge(
      "dice-balance min-w-full flex justify-center items-center",
      className
    )
  )
  const [isShowDetails, setIsShowDetails] = useState(false)
  const openModal = useStore((state) => state.openModal)
  const handleDataFetch = () => {
    utils.stats.rolls.total.invalidate()
    utils.stats.rolls.game.invalidate()
    utils.stats.rolls.table.invalidate()
  }
  const handleSaveDiceRoll = (isPositive: boolean) => {
    openModal("diceRollSaver", {
      isNegative: !isPositive,
      characterId: characterId,
      onConfirm: handleDataFetch
    })
  }

  return (
    <Stack>
      <Room className={calculatedClassNames}>
        <div className="flex w-full min-w-fit h-36 rounded-md shadow-sm shadow-block-600 bg-block-700">
          <Dice
            isPositive={false}
            onClick={handleSaveDiceRoll}
            count={balance ? balance.totalNegative || 0 : 0}
          />
          <div className="flex flex-col flex-1 h-full justify-center content-center items-center px-4">
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
              isText
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
    </Stack>
  )
}

export default DiceBalance
