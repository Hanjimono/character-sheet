import { DiceRoll, SkillDamageType } from "@/constants/types/skills"

export interface SkillDiceRollProps {
  /** Roll info */
  roll: DiceRoll
  /** Type of damage */
  damageType?: SkillDamageType
  /** Additional class names */
  className?: string
}
