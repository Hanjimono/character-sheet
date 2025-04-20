// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { DamageBalanceProps } from "./types"
import Room, { HiddenRoom } from "@/ui/Layout/Room"
import Button from "@/ui/Actions/Button"
import { useCallback, useEffect, useState } from "react"
import { DamageBalanceInfo } from "@/constants/types/damage"
import { useStore } from "@/store"
import DamageBalanceStatsTable from "./DamageBalanceStatsTable"

function DamageBalance({
  className,
  campaignId,
  characterId,
  gameId
}: DamageBalanceProps) {
  const calculatedClassNames = cx(
    twMerge(
      "damage-balance min-w-full flex justify-center items-center",
      className
    )
  )
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [balance, setBalance] = useState<DamageBalanceInfo>({
    totalPositive: 0,
    totalNegative: 0
  })
  const openModal = useStore((state) => state.openModal)
  const handleSaveDiceRoll = (isPositive: boolean) => {
    openModal("damageSaver", {
      isNegative: !isPositive,
      characterId: characterId,
      isNotClosable: true,
      onConfirm: fetchBalance
    })
  }
  const fetchBalance = useCallback(async () => {
    if (!gameId || !characterId) return
    const url = "/api/stats/damage/game"
    const response = await fetch(url + `?character=${characterId}`)
    if (!response.ok) {
      return
    }
    const data = await response.json()
    setBalance(data as DamageBalanceInfo)
  }, [gameId, characterId])
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])
  return (
    <>
      <Room className={calculatedClassNames}>
        <div className="relative flex w-fit justify-center items-center h-32 rounded-md shadow-sm shadow-block-600 bg-block-700">
          <div>
            <span className="text-2xl bold">{balance.totalPositive}</span>
            <Button onClick={() => handleSaveDiceRoll(true)}>
              Deal Damage
            </Button>
          </div>
          <div className="flex flex-col h-full justify-center content-center items-center px-4">
            <span className="text-2xl bold">Damage</span>
          </div>
          <div>
            <span className="text-2xl bold">{balance.totalNegative}</span>
            <Button onClick={() => handleSaveDiceRoll(false)}>
              Take Damage
            </Button>
          </div>
          <Button
            className="p-0 text-sm h-8 absolute bottom-0.25 right-1"
            text
            secondary
            onClick={() => setIsShowDetails(!isShowDetails)}
            endIcon={isShowDetails ? "arrow_drop_up" : "arrow_drop_down"}
          >
            details
          </Button>
        </div>
      </Room>
      <HiddenRoom isShown={isShowDetails}>
        <DamageBalanceStatsTable
          className="w-full"
          campaignId={campaignId}
          gameId={gameId}
          isShowGameStats={true}
        />
      </HiddenRoom>
    </>
  )
}
export default DamageBalance
