// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Components
import SkillDiceRoll from "./SkillDiceRoll"
import SkillTime from "./SkillTime"
import SkillDifficulty from "./SkillDifficulty"
import SkillSlider from "./SkillSlider"
// ui
import Title from "@/ui/Presentation/Title"
import SmartImage from "@/ui/Presentation/SmartImage"
import Text from "@/ui/Presentation/Text"
import Beam from "@/ui/Layout/Beam"
// Styles and types
import { SkillCardProps } from "./types"

/**
 * Renders a card displaying detailed information about a skill.
 *
 * @param className - Optional additional class names to apply to the card container.
 * @param skill - The skill object containing all relevant data to display in the card.
 */
function SkillCard({ className, skill }: SkillCardProps) {
  const calculatedClassNames = cx(
    twMerge(
      "skill-card flex gap-same-level bg-block-700 rounded-xl p-4 max-w-230 h-fit max-h-fit",
      className
    )
  )
  return (
    <div className={calculatedClassNames}>
      <div className="image-part w-64 h-64 min-w-64 rounded-2xl overflow-hidden relative soft-edges">
        {skill.image && <SmartImage alt={skill.name} src={skill.image} />}
      </div>
      <div className="description-part">
        <div className="header mb-same-level relative">
          <Title bottomGap="almost-same">{skill.name}</Title>
          <Beam
            className="stats-line gap-almost-same"
            contentAlign="center"
            withoutGap
          >
            <Text className="text-right opacity-50 mr-2" size="small">
              {skill.originalName}
            </Text>
            {skill.damage && (
              <SkillDiceRoll
                roll={skill.damage}
                damageType={skill.damageType}
              />
            )}
            {skill.castingTime && <SkillTime castingTime={skill.castingTime} />}
          </Beam>
          {(skill.hitModifier || skill.savingThrow) && (
            <SkillDifficulty
              className="absolute top-0 right-0"
              hitModifier={skill.hitModifier}
              savingThrow={skill.savingThrow}
            />
          )}
        </div>
        <div className="description">
          <Text size="small" className="text-justify">
            {skill.description}
          </Text>
          {skill.originalDescription && (
            <SkillSlider
              className="mt-close"
              title="Original description"
              description={skill.originalDescription}
              type="original"
            />
          )}
          {skill.features &&
            skill.features.map((feature) => (
              <SkillSlider
                key={feature.name}
                className="mt-close"
                title={feature.name}
                description={feature.description}
                type="feature"
              />
            ))}
        </div>
      </div>
    </div>
  )
}
export default SkillCard
