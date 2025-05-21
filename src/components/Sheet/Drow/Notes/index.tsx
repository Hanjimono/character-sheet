"use server"
// system
import fs from "fs"
import path from "path"
// database
import { Character } from "@/database/models/character"
// components
import NotesCategories from "@/components/Layout/Notes/NotesCategories"
import ImportantNotes from "./ImportantNotes"
// constants
import { NOTES_CATEGORIES } from "@/constants/notes"

/**
 * Asynchronously renders the DrowNotes component for a character.
 *
 * This function check if everything is set up correctly for the character's notes.
 *
 * @throws {Error} If the character is not found.
 * @throws {Error} If the Obsidian path is not found.
 * @throws {Error} If any required notes folders are missing.
 * @returns {JSX.Element} The rendered notes components for the character.
 */
export default async function DrowNotes() {
  const character = await Character.findOne({
    where: {
      id: 1
    }
  })
  if (!character) {
    throw new Error("Character not found")
  }
  const obsidianPath = character.obsidianPath
  if (!obsidianPath) {
    throw new Error("Obsidian path not found")
  }
  const notesFolder = fs.readdirSync(obsidianPath).filter((name) => {
    const fullPath = path.join(obsidianPath, name)
    return fs.statSync(fullPath).isDirectory()
  })
  const missedFolders = NOTES_CATEGORIES.filter((category) => {
    return !notesFolder.includes(category)
  })
  if (missedFolders.length > 0) {
    throw new Error(`Missed notes folders: ${missedFolders.join(", ")}`)
  }
  return (
    <div className="flex flex-col">
      <ImportantNotes characterId={1} />
      <NotesCategories characterId={1} />
    </div>
  )
}
