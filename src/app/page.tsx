"use client"
// Components
import CharacterSelection from "@/components/Layout/CharacterSelection"
// Ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"

export default function MainPage() {
  return (
    <WallDecorated animationMode="slide-both-sides" isShortYPadding>
      <CharacterSelection />
    </WallDecorated>
  )
}
