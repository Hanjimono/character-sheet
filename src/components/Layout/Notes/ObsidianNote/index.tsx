// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { ObsidianNoteProps } from "./types"
import { useState } from "react"
import Button from "@/ui/Actions/Button"

/**
 * Renders an note from Obsidian with a collapsible content area.
 *
 * @param {string} props.className - Additional class names to apply to the note container.
 * @param {string} props.title - The title displayed at the top of the note.
 * @param {string} props.content - The HTML content to display inside the note when expanded.
 */
function ObsidianNote({ className, title, content }: ObsidianNoteProps) {
  const calculatedClassNames = cx(
    twMerge(
      "obsidian-note bg-block-700 rounded-2xl overflow-hidden w-full",
      className
    )
  )
  const [isShowContent, setIsShowContent] = useState(false)
  return (
    <div className={calculatedClassNames}>
      <div
        onClick={() => setIsShowContent(!isShowContent)}
        className="note-title p-4 cursor-pointer hover:bg-block-700"
      >
        {title}
      </div>
      {isShowContent && (
        <div className="note-content overflow-hidden relative w-full">
          <div
            className="prose-obsidian flex flex-col py-4 pl-12 pr-4 overflow-y-auto overflow-x-hidden max-h-80 h-fit min-w-full whitespace-pre"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Button
            onClick={() => setIsShowContent(false)}
            className="absolute top-1 left-2"
            icon="close"
            text
          />
        </div>
      )}
    </div>
  )
}
export default ObsidianNote
