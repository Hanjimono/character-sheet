// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
// Ui
import Title from "@/ui/Presentation/Title"
import Text from "@/ui/Presentation/Text"
// Styles and types
import { SkillSliderProps } from "./types"

/**
 * Renders a collapsible skill slider card component for displaying some additional information about a skill.
 *
 * @param {string} [props.className] - Additional class names to apply to the root element.
 * @param {string} props.title - The title displayed in the header of the slider.
 * @param {string} props.description - The description shown when the slider is expanded.
 * @param {"feature" | string} props.type - The type of the skill, which affects styling (e.g., "feature").
 */
function SkillSlider({
  className,
  title,
  description,
  type
}: SkillSliderProps) {
  const calculatedClassNames = cx(
    twMerge(
      "skill-slider border-block-500 border-1 border-dashed rounded-md opacity-80 overflow-hidden",
      type === "feature" && "bg-block-500 border-none",
      className
    )
  )
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={calculatedClassNames}>
      <div
        className="header flex justify-between items-center p-2 cursor-pointer hover:bg-block-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Title bottomGap="same" size={6}>
          {title}
        </Title>
      </div>
      {isOpen && (
        <div className="description p-2">
          <Text size="small">{description}</Text>
        </div>
      )}
    </div>
  )
}
export default SkillSlider
