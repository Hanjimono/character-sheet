import { SkillInfo } from "@/constants/types/skills"

export interface SkillSelectListProps {
  /** Additional class names */
  className?: string
  /** List of skills to display */
  skills: SkillInfo[]
}
