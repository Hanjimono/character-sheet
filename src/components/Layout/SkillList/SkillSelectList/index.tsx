// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
// Components
import SkillCard from "../SkillCard"
// Ui
import Beam from "@/ui/Layout/Beam"
import ImageButton from "@/ui/Actions/ImageButton"
// Styles and types
import { SkillSelectListProps } from "./types"

function SkillSelectList({ skills, className }: SkillSelectListProps) {
  const calculatedClassNames = cx(
    twMerge("skill-select-list flex flex-col gap-same-level", className)
  )
  const [selectedSkill, setSelectedSkill] = useState(skills[0])
  return (
    <div className={calculatedClassNames}>
      <Beam>
        <SkillCard className="max-w-200" skill={selectedSkill} />
        <Beam className="flex-1">
          {skills.map((skill) => (
            <ImageButton
              key={skill.name}
              className="w-32 h-32"
              onClick={() => setSelectedSkill(skill)}
              src={skill.image || ""}
              alt={skill.name}
              description={skill.name}
            />
          ))}
        </Beam>
      </Beam>
    </div>
  )
}
export default SkillSelectList
