"use client"
// System
import { useMemo } from "react"
// Components
import BreadCrumbs from "@/components/Layout/Breadcrumbs"
import CharacterNotes from "@/components/Sheet/Drow/Notes"
// Ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"

const BREADCRUMBS = [{ title: "Персонаж", href: "/" }]

interface CharacterNotesPageProps {
  params: {
    characterId: string
  }
}

export default function CharacterNotesPage({
  params
}: CharacterNotesPageProps) {
  const characterId = useMemo(
    () => Number(params.characterId),
    [params.characterId]
  )

  if (!characterId || Number.isNaN(characterId)) {
    return null
  }

  return (
    <WallDecorated animationMode="slide-both-sides" isShortYPadding>
      <BreadCrumbs title="Записи" items={BREADCRUMBS} />
      <CharacterNotes characterId={characterId} />
    </WallDecorated>
  )
}
