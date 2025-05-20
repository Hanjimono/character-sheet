// components
import DrowDiaryPage from "@/components/Sheet/Drow"
// ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"

export default function MainPage() {
  return (
    <WallDecorated animationMode="slide-both-sides" isShortYPadding>
      <DrowDiaryPage />
    </WallDecorated>
  )
}
