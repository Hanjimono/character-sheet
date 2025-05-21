// components
import BreadCrumbs from "@/components/Layout/Breadcrumbs"
import DrowNotes from "@/components/Sheet/Drow/Notes"
// ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"

const BREADCRUMBS = [{ title: "Персонаж", href: "/" }]

export default function SpellsPage() {
  return (
    <WallDecorated animationMode="slide-both-sides" isShortYPadding>
      <BreadCrumbs title="Записи" items={BREADCRUMBS} />
      <DrowNotes />
    </WallDecorated>
  )
}
