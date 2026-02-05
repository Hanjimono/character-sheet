"use client"
// System
import { useMemo } from "react"
import { notFound } from "next/navigation"
// Components
import GamesList from "@/components/Layout/Games/List"
import CampaignPlayerStats from "@/components/Layout/Games/CampaignPlayerStats"
// Ui
import WallDecorated from "@/ui/Layout/Decorators/WallDecorated"
import Button from "@/ui/Actions/Button"
import Stack from "@/ui/Layout/Stack"

interface GamesPageProps {
  params: {
    characterId: string
  }
}

export default function GamesPage({ params }: GamesPageProps) {
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
      <Stack gap="distant">
        <Button link={`/character/${characterId}`} isText secondary isNoPadding>
          ← Back to Character
        </Button>
        <CampaignPlayerStats characterId={characterId} />
        <GamesList characterId={characterId} />
      </Stack>
    </WallDecorated>
  )
}
