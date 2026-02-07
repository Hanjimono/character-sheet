// System
import { twMerge } from "tailwind-merge"
import { cx } from "class-variance-authority"
// Ui
import SmartImage from "@/ui/Presentation/SmartImage"
// Styles and types
import { HeaderProps } from "./types"

const CHARACTER_IMAGES = {
  1: "/public/images/header.jpg",
  2: "/public/images/header_bekker.jpg"
}

function Header({ className, title, characterId }: HeaderProps) {
  const calculatedClassNames = twMerge(cx("bg-block-400 h-32", className))
  return (
    <div className={calculatedClassNames}>
      <SmartImage
        src={CHARACTER_IMAGES[characterId as keyof typeof CHARACTER_IMAGES]}
        alt="Header background"
        className="w-full h-full object-cover object-bottom saturate-45"
      />
    </div>
  )
}
export default Header
