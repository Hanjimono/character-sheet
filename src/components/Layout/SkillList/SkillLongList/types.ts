import { SkillInfo } from "@/constants/types/skills"

export interface SkillLongListProps {
  /** Additional class names */
  className?: string
  /** List of skills to display */
  skills: SkillInfo[]
}
