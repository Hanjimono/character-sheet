"use client"
// System
import { useState } from "react"
// Components
import NotesCategoryContent from "../NoteCategoryContent"
// Ui
import TabPanel from "@/ui/Navigation/TabPanel"
// Constants
import { NOTES_CATEGORIES } from "@/constants/notes"

/**
 * Renders the notes categories section for a character, including a tab panel
 * for switching between different note categories and displaying the content
 * for the selected category.
 *
 * @param characterId - The unique identifier of the character whose notes are being displayed.
 * @returns The notes categories UI component.
 */
export default function NotesCategories({
  characterId
}: {
  characterId: number
}) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  return (
    <div className="flex flex-col">
      <TabPanel
        tabsList={NOTES_CATEGORIES}
        activeTabIdx={activeTabIdx}
        onTabChange={setActiveTabIdx}
      />
      <NotesCategoryContent
        characterId={characterId}
        folder={NOTES_CATEGORIES[activeTabIdx]}
      />
    </div>
  )
}
