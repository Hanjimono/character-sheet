"use client"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Components
import ImportantNote from "@/components/Layout/Notes/ImportantNote"
// Styles and types
import { ImportantNotesProps } from "./types"

/**
 * Renders a list of important notes for a given character.
 *
 * @param characterId - The unique identifier of the character whose notes are to be displayed.
 */
export default function ImportantNotes({ characterId }: ImportantNotesProps) {
  useSetCharacterId(characterId)
  const { data: notes } = trpc.notes.important.useQuery(undefined, {
    enabled: !!characterId
  })
  if (!notes || notes.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col gap-same-level mb-other-level">
      {notes.map((note, index) => (
        <ImportantNote key={index} note={note.content.join(" ")} />
      ))}
    </div>
  )
}
