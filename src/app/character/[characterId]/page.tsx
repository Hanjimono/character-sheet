"use client"
// System
import { useMemo } from "react"
import { notFound } from "next/navigation"
// Components
import CharacterSheet from "@/components/Sheet/Character"
// Ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"

interface CharacterPageProps {
  params: {
    characterId: string
  }
}

export default function CharacterPage({ params }: CharacterPageProps) {
  const characterId = useMemo(
    () => Number(params.characterId),
    [params.characterId]
  )

  if (!characterId || Number.isNaN(characterId)) {
    notFound()
  }

  return (
    <WallDecorated
      className="h-auto"
      animationMode="slide-both-sides"
      isShortYPadding
    >
      <CharacterSheet characterId={characterId} />
    </WallDecorated>
  )
}
