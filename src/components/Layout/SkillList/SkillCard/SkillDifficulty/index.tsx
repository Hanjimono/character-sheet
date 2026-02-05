// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Ui
import SmartImage from "@/ui/Presentation/SmartImage"
// Constants
import { SkillSavingThrow } from "@/constants/types/skills"
// Styles and types
import { SkillDifficultyProps } from "./types"

/**
 * Renders a circular skill difficulty indicator with a dice icon and displays either a saving throw DC or a hit modifier.
 *
 * @param className - Additional CSS class names to apply to the root element.
 * @param hitModifier - The modifier value to display when not showing a saving throw.
 * @param savingThrow - An optional object containing saving throw information, including its DC.
 */
function SkillDifficulty({
  className,
  hitModifier,
  savingThrow
}: SkillDifficultyProps) {
  const calculatedClassNames = cx(
    twMerge(
      "skill-difficulty bg-block-500 w-16 h-16 p-1 flex rounded-full items-center justify-center overflow-hidden cursor-default",
      hitModifier && "bg-block-200",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      <div className="dice-image relative">
        <SmartImage alt="dice" src="/public/images/icons/dice.svg" />
        <div className="flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full text-center font-bold">
          <span className="text-xs">
            {savingThrow
              ? getSkillDifficultyAbbreviation(savingThrow)
              : "TO HIT"}
          </span>
          <span className="text-sm">
            {savingThrow ? savingThrow.dc : "+" + hitModifier}
          </span>
        </div>
      </div>
    </div>
  )
}

function getSkillDifficultyAbbreviation(savingThrow: SkillSavingThrow): string {
  switch (savingThrow.type) {
    case "strength":
      return "STR"
    case "dexterity":
      return "DEX"
    case "constitution":
      return "CON"
    case "intelligence":
      return "INT"
    case "wisdom":
      return "WIS"
    case "charisma":
      return "CHA"
    default:
      return ""
  }
}

export default SkillDifficulty
