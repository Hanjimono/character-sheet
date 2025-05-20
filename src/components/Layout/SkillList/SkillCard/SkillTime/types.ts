import { SkillCastingTimeType } from "@/constants/types/skills"

export interface SkillTimeProps {
  /** Casting time info */
  castingTime: SkillCastingTimeType
  /** Additional class names */
  className?: string
}
