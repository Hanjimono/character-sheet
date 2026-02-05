"use client"
// System
import { useMemo } from "react"
import { notFound } from "next/navigation"
// Components
import GameDetail from "@/components/Layout/Games/GameDetail"
// Ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"
import Button from "@/ui/Actions/Button"
import Stack from "@/ui/Layout/Stack"

interface GameDetailPageProps {
  params: {
    characterId: string
    gameId: string
  }
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const characterId = useMemo(
    () => Number(params.characterId),
    [params.characterId]
  )
  const gameId = useMemo(() => Number(params.gameId), [params.gameId])

  if (!characterId || Number.isNaN(characterId)) {
    notFound()
  }

  if (!gameId || Number.isNaN(gameId)) {
    notFound()
  }

  return (
    <WallDecorated
      className="h-auto"
      animationMode="slide-both-sides"
      isShortYPadding
    >
      <Stack>
        <Button
          link={`/character/${characterId}/games`}
          isText
          secondary
          isNoPadding
        >
          ← Back to Games
        </Button>
        <GameDetail characterId={characterId} gameId={gameId} />
      </Stack>
    </WallDecorated>
  )
}
