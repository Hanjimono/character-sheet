"use client"
// System
import { useMemo } from "react"
// Lib
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Components
import CharacterLeftPartView from "@/components/Sheet/Drow/leftPart"
import CampaignView from "@/components/Layout/CampaignView"
// Ui
import Beam from "@/ui/Layout/Beam"
import Pillar from "@/ui/Layout/Pillar"
// Styles and types
import type { CharacterSheetProps } from "./types"

/**
 * Main character sheet layout for a selected character.
 * Uses characterId from the URL and sets it in tRPC context for API calls.
 */
function CharacterSheet({ characterId }: CharacterSheetProps) {
  const normalizedId = useMemo(() => Number(characterId), [characterId])

  useSetCharacterId(normalizedId)

  if (!normalizedId || Number.isNaN(normalizedId)) {
    return null
  }

  return (
    <Beam>
      <Pillar lg={8} md={12} xs={12}>
        <CharacterLeftPartView />
      </Pillar>
      <Pillar lg={4} md={12} xs={12}>
        <CampaignView characterId={normalizedId} />
      </Pillar>
    </Beam>
  )
}

export default CharacterSheet
