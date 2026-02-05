"use client"
// Lib
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Components
import NotesCategories from "@/components/Layout/Notes/NotesCategories"
import ImportantNotes from "./ImportantNotes"

export interface CharacterNotesProps {
  characterId: number
}

/**
 * Generic character notes component.
 * Accepts characterId from the route and sets it for API calls.
 */
export default function CharacterNotes({ characterId }: CharacterNotesProps) {
  useSetCharacterId(characterId)

  if (!characterId) {
    return null
  }

  return (
    <div className="flex flex-col">
      <ImportantNotes characterId={characterId} />
      <NotesCategories characterId={characterId} />
    </div>
  )
}
