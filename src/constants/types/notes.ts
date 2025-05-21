import { NOTES_CATEGORIES } from "../notes"

/** List of available notes categories */
export type AvailableNotesCategories = (typeof NOTES_CATEGORIES)[number]

/**
 * List of notes for specific category
 */
export interface NotesListForCategory {
  /**
   * List of notes names for specific category
   */
  notesNames: string[]
  /**
   * List of notes for specific category
   */
  notesList: Record<string, string>
}

/**
 * Obsidian callout info
 */
export interface ObsidianCallout {
  /** Obsidian callout type */
  type: string
  /** Obsidian callout title (first string in callout) */
  title: string
  /** Obsidian callout content (rest of the callout) */
  content: string[]
}
