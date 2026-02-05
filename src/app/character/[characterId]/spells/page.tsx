"use client"
// System
import { useMemo } from "react"
// Components
import BreadCrumbs from "@/components/Layout/Breadcrumbs"
import DrowSpellsPage from "@/components/Sheet/Drow/Spells"
// Ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"

const BREADCRUMBS = [{ title: "Персонаж", href: "/" }]

interface CharacterSpellsPageProps {
  params: {
    characterId: string
  }
}

export default function CharacterSpellsPage({
  params
}: CharacterSpellsPageProps) {
  const characterId = useMemo(
    () => Number(params.characterId),
    [params.characterId]
  )

  if (!characterId || Number.isNaN(characterId)) {
    return null
  }

  return (
    <WallDecorated animationMode="slide-both-sides" isShortYPadding>
      <BreadCrumbs title="Способности" items={BREADCRUMBS} />
      <DrowSpellsPage />
    </WallDecorated>
  )
}
