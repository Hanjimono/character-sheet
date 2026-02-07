"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Components
import MoneyRender from "@/components/Helpers/MoneyRender"
// Ui
import SmartImage from "@/ui/Presentation/SmartImage"
import Text from "@/ui/Presentation/Text"
import Stack from "@/ui/Layout/Stack"
// Styles and types
import { PlayerStatBlockProps } from "./types"
import Pillar from "@/ui/Layout/Pillar"

/**
 * Stat block for a single player: picture, dice stats (Nat 20 / Nat 1),
 * damage stats (dealt / taken), and money (total or game spent).
 *
 * @param {string} className - Additional class names to apply
 * @param {string} playerName - Player display name
 * @param {string | null} playerImage - Optional player image URL
 * @param {object} rolls - totalPositive (Nat 20), totalNegative (Nat 1)
 * @param {object} damages - totalPositive (dealt), totalNegative (taken)
 * @param {number} moneyTotal - Money amount
 * @param {boolean} isGameContext - If true, use "this game" labeling
 */
function PlayerStatBlock({
  className,
  playerName,
  playerImage,
  rolls,
  damages,
  heals,
  moneyTotal,
  selfHarmTotal,
  selfHarmPercentage,
  isGameContext = false
}: PlayerStatBlockProps) {
  const calculatedClassNames = cx(
    twMerge(
      "player-stat-block bg-block-700 rounded-lg p-4 min-w-[200px] flex-shrink-0",
      className
    )
  )

  return (
    <Pillar sm={4} className={calculatedClassNames}>
      <Stack gap="close">
        <div className="flex items-center gap-3">
          {playerImage ? (
            <SmartImage
              src={playerImage}
              alt={playerName}
              className="w-12 h-12 rounded-full object-cover bg-block-600"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full bg-block-600 flex items-center justify-center text-gray-400 text-lg font-semibold"
              aria-hidden
            >
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <Text className="font-semibold text-gray-100 truncate" size="small">
            {playerName}
          </Text>
        </div>
        <Stack gap="close" className="text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Nat 20</span>
            <span className="text-green-500">{rolls.totalPositive}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Nat 1</span>
            <span className="text-red-500">{rolls.totalNegative}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Dealt</span>
            <span className="text-gray-200">{damages.totalPositive}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Taken</span>
            <span className="text-gray-200">{damages.totalNegative}</span>
          </div>
          {selfHarmTotal !== undefined &&
            selfHarmPercentage !== undefined &&
            damages.totalNegative > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Self-harm</span>
                <span className="text-orange-400">
                  {selfHarmTotal} ({selfHarmPercentage}%)
                </span>
              </div>
            )}
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Heal Given</span>
            <span className="text-blue-400">{heals.totalPositive}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Heal Received</span>
            <span className="text-green-400">{heals.totalNegative}</span>
          </div>
          <div className="flex justify-between items-center gap-4 pt-1 border-t border-block-600">
            <span className="text-gray-400">
              {isGameContext ? "Spent this game" : "Money total"}
            </span>
            <MoneyRender amount={moneyTotal} isShowZero />
          </div>
        </Stack>
      </Stack>
    </Pillar>
  )
}

export default PlayerStatBlock
