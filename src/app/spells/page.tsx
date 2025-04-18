// components
import BreadCrumbs from "@/components/Layout/Breadcrumbs"
import DrowSpellsPage from "@/components/Sheet/Drow/Spells"
// ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"

const BREADCRUMBS = [{ title: "Персонаж", href: "/" }]

export default function SpellsPage() {
  return (
    <WallDecorated animationMode="slide-both-sides">
      <BreadCrumbs title="Способности" items={BREADCRUMBS} />
      <DrowSpellsPage />
    </WallDecorated>
  )
}
