"use client"
// Components
import MainInfo from "@/components/Layout/MainInfo"
import MenuLine from "@/components/Layout/MenuLine"
// ui
import Room from "@/ui/Layout/Room"

export default function CharacterLeftPartView() {
  return (
    <>
      <Room bottomGap="other-level">
        <MainInfo />
      </Room>
      <Room>
        <MenuLine />
      </Room>
    </>
  )
}
