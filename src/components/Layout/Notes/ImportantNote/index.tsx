// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// ui
import Note from "@/ui/Presentation/Note"
// Styles and types
import { ImportantNoteProps } from "./types"

/**
 * Renders an important informational note using the `Note` component.
 *
 * @param className - Additional CSS class names to apply to the note.
 * @param note - The content of the important note to display.
 */
function ImportantNote({ className, note }: ImportantNoteProps) {
  const calculatedClassNames = cx(twMerge("important-note", className))
  return (
    <Note className={calculatedClassNames} type="info" bottomGap="same">
      {note}
    </Note>
  )
}
export default ImportantNote
