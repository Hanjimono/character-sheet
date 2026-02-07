"use client"
// Components
import MainInfo from "@/components/Layout/MainInfo"
import MenuLine from "@/components/Layout/MenuLine"
// Ui
import Room from "@/ui/Layout/Room"
import { CharacterSheetProps } from "../Character/types"

export default function CharacterLeftPartView({
  characterId
}: CharacterSheetProps) {
  return (
    <>
      <Room className="mb-other-level">
        <MainInfo characterId={characterId} />
      </Room>
      <Room>
        <MenuLine characterId={characterId} />
      </Room>
    </>
  )
}
