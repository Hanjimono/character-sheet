// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Ui
import SmartImage from "@/ui/Presentation/SmartImage"
import Text from "@/ui/Presentation/Text"
// Styles and types
import { SkillTimeProps } from "./types"

/**
 * Renders a styled component displaying the casting time of a skill, including an icon and label.
 *
 * @param className - Optional additional CSS class names to apply to the root element.
 * @param castingTime - The casting time value (e.g., "instant", "1min") used for both the icon and label.
 */
function SkillTime({ className, castingTime }: SkillTimeProps) {
  const calculatedClassNames = cx(
    twMerge(
      "skill-casting-time flex items-center px-3 py-1 h-8 box-border border-indigo-800 border-1 rounded-lg border-dashed cursor-default",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      <span className="w-6 mr-1">
        <SmartImage
          alt={castingTime}
          src={`/public/images/icons/${castingTime}.svg`}
        />
      </span>
      <Text>{castingTime}</Text>
    </div>
  )
}
export default SkillTime
