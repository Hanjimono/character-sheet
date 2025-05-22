// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Components
import SkillCard from "../SkillCard"
// Styles and types
import { SkillLongListProps } from "./types"

/**
 * Renders a vertical, scrollable list of skill cards.
 *
 * @param skills - An array of skill objects to display in the list.
 * @param className - Optional additional CSS class names to apply to the list container.
 */
function SkillLongList({ skills, className }: SkillLongListProps) {
  const calculatedClassNames = cx(
    twMerge(
      "skill-list flex flex-col w-full h-full overflow-auto gap-other-level",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      {skills.map((skill) => (
        <SkillCard key={skill.name} skill={skill} />
      ))}
    </div>
  )
}
export default SkillLongList
