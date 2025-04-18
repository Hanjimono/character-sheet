// System
import { twMerge } from "tailwind-merge"
import { cx } from "class-variance-authority"
// Styles and types
import { HeaderProps } from "./types"
import SmartImage from "@/ui/Presentation/SmartImage"

function Header({ className, title }: HeaderProps) {
  const calculatedClassNames = twMerge(
    cx("absolute top-0 left-0 right-0 bg-block-400 h-24", className)
  )
  return (
    <div className={calculatedClassNames}>
      <SmartImage
        src="/public/images/header.jpg"
        alt="Header background"
        className="w-full h-full object-cover object-bottom saturate-45"
      />
    </div>
  )
}
export default Header
