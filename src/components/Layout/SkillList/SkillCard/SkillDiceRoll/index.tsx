// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Ui
import SmartImage from "@/ui/Presentation/SmartImage"
// Styles and types
import { SkillDiceRollProps } from "./types"

/**
 * Renders a styled dice roll display for a skill, optionally showing a damage type icon.
 *
 * @param {string} [props.className] - Additional class names to apply to the root element.
 * @param {Object} props.roll - The roll configuration.
 * @param {number} [props.roll.numberOfDice] - The number of dice to roll.
 * @param {number} [props.roll.diceType] - The type of dice (e.g., 6 for d6, 20 for d20).
 * @param {number} [props.roll.modifier] - The modifier to add to the roll.
 * @param {string} [props.damageType] - The type of damage, used to display an icon.
 */
function SkillDiceRoll({ className, roll, damageType }: SkillDiceRollProps) {
  const calculatedClassNames = cx(
    twMerge(
      "skill-dice-roll bg-blue-900 py-1 px-2 rounded-lg cursor-default flex items-center h-8 box-border",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      <span className="text-white text-sm flex">
        {damageType && (
          <span className="text-gray-500 text-xs w-6 mr-0.5">
            <SmartImage
              className="inline-block mr-1"
              src={`/public/images/damage/${damageType}.svg`}
              alt={damageType}
            />
          </span>
        )}
        {roll.numberOfDice && (
          <span className="flex items-center">
            {roll.numberOfDice}d{roll.diceType}{" "}
            {roll.modifier && "+" + roll.modifier}
          </span>
        )}
        {!roll.numberOfDice && (
          <span className="flex items-center">{roll.modifier}</span>
        )}
      </span>
    </div>
  )
}
export default SkillDiceRoll
