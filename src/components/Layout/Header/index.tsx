// System
import { twMerge } from "tailwind-merge"
import { cx } from "class-variance-authority"
// Ui
import SmartImage from "@/ui/Presentation/SmartImage"
// Styles and types
import { HeaderProps } from "./types"

function Header({ className, title }: HeaderProps) {
  const calculatedClassNames = twMerge(cx("bg-block-400 h-32", className))
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
