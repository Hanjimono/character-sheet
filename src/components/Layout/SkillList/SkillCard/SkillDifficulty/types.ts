import { SkillSavingThrow } from "@/constants/types/skills"

export interface SkillDifficultyProps {
  /** Additional class names */
  className?: string
  /** Saving throw information for the skill */
  savingThrow?: SkillSavingThrow
  /** Hit modifier for the skill */
  hitModifier?: number
}
