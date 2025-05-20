/**
 * Information about a skill feature, including its name and descriptions.
 */
export interface SkillFeatureInfo {
  /** Name of the skill feature */
  name: string
  /** Original name of the skill */
  originalName: string
  /** Translated or processed description of the feature */
  description: string
  /** Original description of the feature */
  originalDescription: string
}

/**
 * Possible duration types for a skill.
 */
export type SkillDurationType =
  | "hour"
  | "minute"
  | "second"
  | "day"
  | "infinite"

/**
 * Duration information for a skill, including value and type.
 */
export interface SkillDuration {
  /** Numeric value of the duration */
  duration: number
  /** Type of the duration (e.g., hour, minute) */
  durationType: SkillDurationType
}

/**
 * Possible casting time types for a skill.
 */
export type SkillCastingTimeType =
  | "action"
  | "bonus action"
  | "reaction"
  | "special"

/**
 * Possible damage types for a skill.
 */
export type SkillDamageType =
  | "force"
  | "fire"
  | "cold"
  | "lightning"
  | "thunder"
  | "acid"
  | "necrotic"
  | "poison"
  | "radiant"
  | "psychic"
  | "slashing"
  | "piercing"
  | "bludgeoning"

/**
 * Supported dice types for damage or effects.
 */
export type DiceType = 4 | 6 | 8 | 10 | 12 | 20

/**
 * Information about a dice roll, including number, type, and modifier.
 */
export interface DiceRoll {
  /** Number of dice to roll */
  numberOfDice?: number
  /** Type of dice (e.g., 6 for d6) */
  diceType?: DiceType
  /** Modifier to add to the roll */
  modifier?: number
}

/**
 * Possible area types for a skill's effect.
 */
export type SkillAreaType = "cube" | "sphere" | "cone" | "line" | "cylinder"

/**
 * Information about the area of effect for a skill.
 */
export interface SkillArea {
  /** Shape of the area (e.g., sphere, cone) */
  type: SkillAreaType
  /** Radius or size of the area */
  radius: number
}

/**
 * Possible saving throw types for a skill.
 */
export type SavingThrowType =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma"

export interface SkillSavingThrow {
  /** Type of saving throw (e.g., strength, dexterity) */
  type: SavingThrowType
  /** Difficulty class for the saving throw */
  dc: number
}

/**
 * Main information about a skill, including name, description, duration, and effects.
 */
export interface SkillInfo {
  /** Name of the skill */
  name: string
  /** Original name of the skill */
  originalName: string
  /** Translated or processed description of the skill */
  description: string
  /** Original description of the skill */
  originalDescription: string
  /** Duration information for the skill */
  duration: SkillDuration
  /** List of features associated with the skill */
  features?: SkillFeatureInfo[]
  /** Casting time type for the skill */
  castingTime?: SkillCastingTimeType
  /** Range of the skill in units (e.g., feet, meters) */
  range?: number
  /** Area of effect for the skill */
  area?: SkillArea
  /** Damage roll information for the skill */
  damage?: DiceRoll
  /** Type of damage dealt by the skill */
  damageType?: SkillDamageType
  /** Path to the skill's icon or image */
  image?: string
  /** Saving throw information for the skill */
  savingThrow?: SkillSavingThrow
  /** Hit modifier for the skill */
  hitModifier?: number
}
