"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { SkillListProps } from "./types"
import SkillCard from "./SkillCard"

function SkillList({ className, skills }: SkillListProps) {
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
export default SkillList
