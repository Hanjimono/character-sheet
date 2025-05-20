export type SkillSliderType = "feature" | "original"

export interface SkillSliderProps {
  /** Additional class names */
  className?: string
  /** Skill info title */
  title: string
  /** Skill info description */
  description: string
  /** Type of info for this slider */
  type: SkillSliderType
}
