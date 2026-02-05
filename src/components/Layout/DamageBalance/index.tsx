"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
import { motion } from "framer-motion"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Store
import { useStore } from "@/store"
// Components
import DamageBalanceStatsTable from "./DamageBalanceStatsTable"
// Ui
import Title from "@/ui/Presentation/Title"
import Text from "@/ui/Presentation/Text"
import SmartImage from "@/ui/Presentation/SmartImage"
import Room, { HiddenRoom } from "@/ui/Layout/Room"
import Button from "@/ui/Actions/Button"
// Styles and types
import { DamageBalanceProps } from "./types"
import Stack from "@/ui/Layout/Stack"

/**
 * Renders the DamageBalance component, which displays the total damage dealt and taken
 * for an active game, along with a button to show detailed stats. Allows to open a modal
 * to save a new dice roll for damage dealt or taken.
 *
 * @param {string} className - Optional additional class names for styling.
 * @param {number} characterId - The unique identifier for the character for the sheet.
 * @param {number} campaignId - The ID of the active campaign.
 * @param {number} gameId - The ID of the currently active game.
 */
function DamageBalance({
  className,
  characterId,
  campaignId,
  gameId
}: DamageBalanceProps) {
  useSetCharacterId(characterId)
  const calculatedClassNames = cx(
    twMerge(
      "damage-balance min-w-full flex justify-center items-center",
      className
    )
  )
  const utils = trpc.useUtils()
  const { data: balance, isLoading: balanceLoading } =
    trpc.stats.damage.game.useQuery(undefined, {
      enabled: !!characterId && !!gameId
    })
  const { data: stats, isLoading: statsLoading } =
    trpc.stats.damage.table.useQuery(undefined, {
      enabled: !!characterId
    })
  const [isShowDetails, setIsShowDetails] = useState(false)
  const openModal = useStore((state) => state.openModal)
  const handleDataFetch = () => {
    utils.stats.damage.game.invalidate()
    utils.stats.damage.table.invalidate()
  }
  const handleSaveDiceRoll = (
    e: React.MouseEvent<HTMLDivElement>,
    isPositive: boolean
  ) => {
    e.stopPropagation()
    openModal("damageSaver", {
      isNegative: !isPositive,
      characterId: characterId,
      onConfirm: handleDataFetch
    })
  }
  return (
    <Stack>
      <Room className={calculatedClassNames}>
        <div className="relative p-4 flex w-full min-w-fit justify-center items-center h-32 rounded-md shadow-sm shadow-block-600 bg-block-700">
          <DamageStatButton
            count={balance?.totalPositive || 0}
            onClick={handleSaveDiceRoll}
            isPositive
          />
          <div className="flex flex-col flex-1 h-full content-center items-center px-4 relative">
            <Stack className="items-center" gap="tight">
              <Title>Damage</Title>
              <Text size="small">Dealt and Taken</Text>
            </Stack>
            <Button
              className="p-0 text-sm h-8 absolute bottom-0.25 mr-auto ml-auto"
              isText
              secondary
              onClick={() => setIsShowDetails(!isShowDetails)}
              endIcon={isShowDetails ? "arrow_drop_up" : "arrow_drop_down"}
            >
              details
            </Button>
          </div>
          <DamageStatButton
            count={balance?.totalNegative || 0}
            onClick={handleSaveDiceRoll}
            isPositive={false}
          />
        </div>
      </Room>
      <HiddenRoom isShown={isShowDetails}>
        <DamageBalanceStatsTable className="w-full" stats={stats || []} />
      </HiddenRoom>
    </Stack>
  )
}

/**
 * Renders an interactive button representing a damage statistic, displaying a count and an icon
 * (sword for positive, shield for negative).
 *
 * @param count - The numeric value to display inside the button.
 * @param isPositive - Determines the icon and style; true for positive (sword), false for negative (shield).
 * @param onClick - Callback invoked when the button is clicked, receiving the mouse event and the `isPositive` flag.
 */
function DamageStatButton({
  count,
  isPositive,
  onClick
}: {
  count: number
  isPositive: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement>, isPositive: boolean) => void
}) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative bg-block-900 w-24 h-24 rounded-2xl border-block-500 border-2 border-dashed flex justify-center items-center text-2xl text-block-500 font-bold cursor-pointer hover:bg-block-800 hover:border-block-400 transition-all duration-200"
      onClick={(e) => onClick(e, isPositive)}
    >
      <span className="z-2">{count}</span>
      <div className="absolute z-1 top-0 left-0 w-full h-full rounded-2xl bg-block-900 opacity-5 p-2">
        <SmartImage
          alt="damage"
          src={`/public/images/${isPositive ? "sword" : "shield"}.svg`}
        />
      </div>
    </motion.div>
  )
}

export default DamageBalance
