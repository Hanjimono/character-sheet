// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Ui
import SmartImage from "@/ui/Presentation/SmartImage"
// Styles and types
import { AbilityProps } from "./types"

function Ability({
  className,
  image,
  description,
  name,
  origin,
  surname
}: AbilityProps) {
  const calculatedClassNames = cx(
    twMerge("ability flex gap-same-level", className)
  )
  return (
    <div className={calculatedClassNames}>
      <div>
        <SmartImage src={image} alt={name} className="ability-image" />
      </div>
      <div className="flex flex-col">
        <h4 className="text-2xl font-bold">{name}</h4>
        {surname && <h5 className="text-xl">{surname}</h5>}
        <p className="text-base">{description}</p>
        {origin && (
          <span className="text-sm text-gray-500">{`Origin: ${origin}`}</span>
        )}
      </div>
    </div>
  )
}
export default Ability
