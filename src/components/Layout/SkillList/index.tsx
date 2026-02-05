"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// System
import { useState } from "react"
// Components
import SkillLongList from "./SkillLongList"
import SkillSelectList from "./SkillSelectList"
// Ui
import Switch from "@/ui/Form/Switch"
// Styles and types
import { SkillListProps } from "./types"

function SkillList({ className, skills }: SkillListProps) {
  const calculatedClassNames = cx(
    twMerge("skill-list-wrapper flex flex-col gap-same-level", className)
  )
  const [isShowAllView, setIsShowAllView] = useState(true)
  return (
    <div className={calculatedClassNames}>
      <Switch
        name="view"
        onChange={(name, value: boolean) => {
          setIsShowAllView(value)
        }}
        checked={isShowAllView}
        label="Show all skills as cards"
      />
      {isShowAllView && <SkillLongList skills={skills} />}
      {!isShowAllView && <SkillSelectList skills={skills} />}
    </div>
  )
}
export default SkillList
