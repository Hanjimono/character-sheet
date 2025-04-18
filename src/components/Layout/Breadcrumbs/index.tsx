// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { BreadCrumbsProps } from "./types"
import Link from "next/link"

function BreadCrumbs({ className, title, items }: BreadCrumbsProps) {
  const calculatedClassNames = cx(
    twMerge("flex items-center gap-2 py-4 text-lg", className)
  )
  return (
    <div className={calculatedClassNames}>
      {items?.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Link href={item.href}>
            <span className="text-teal-800 font-bold hover:text-teal-500">
              {item.title}
            </span>
          </Link>
          <span className="text-teal-800">/</span>
        </div>
      ))}
      {title && <span className="text-teal-600 font-semibold">{title}</span>}
    </div>
  )
}
export default BreadCrumbs
