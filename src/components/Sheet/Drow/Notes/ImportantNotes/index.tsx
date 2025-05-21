"use client"
// Components
import ImportantNote from "@/components/Layout/Notes/ImportantNote"
// Services
import { useFetchAndStoreData } from "@/service/fetcher"
// Types
import { ImportantNotesProps } from "./types"
import { ObsidianCallout } from "@/constants/types/notes"

/**
 * Renders a list of important notes for a given character.
 *
 * @param characterId - The unique identifier of the character whose notes are to be displayed.
 */
export default function ImportantNotes({ characterId }: ImportantNotesProps) {
  const [notes] = useFetchAndStoreData<ObsidianCallout[]>(
    "/api/notes/important",
    undefined,
    characterId
  )
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
