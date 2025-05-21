// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useMemo } from "react"
// Service
import { useFetchAndStoreData } from "@/service/fetcher"
// Constants
import { NotesListForCategory } from "@/constants/types/notes"
// Styles and types
import { NotesCategoryContentProps } from "./types"
import ObsidianNote from "../ObsidianNote"

/**
 * Renders the content for a specific notes category, displaying a list of notes
 * for the given folder and character.
 *
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {string} props.folder - The folder/category of notes to display.
 * @param {string} props.characterId - The ID of the character whose notes are being displayed.
 *
 * @returns {JSX.Element} The rendered notes category content.
 */
function NotesCategoryContent({
  className,
  folder,
  characterId
}: NotesCategoryContentProps) {
  const calculatedClassNames = cx(
    twMerge(
      "notes-category-content flex flex-col gap-other-level py-4",
      className
    )
  )
  const params = useMemo(() => {
    return { folder }
  }, [folder])
  const [notesList] = useFetchAndStoreData<NotesListForCategory>(
    "/api/notes/list",
    params,
    characterId
  )
  return (
    <div className={calculatedClassNames}>
      {notesList?.notesNames.map((noteName) => (
        <ObsidianNote
          key={noteName}
          title={noteName}
          content={notesList.notesList[noteName]}
        />
      ))}
    </div>
  )
}
export default NotesCategoryContent
