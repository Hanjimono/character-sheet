import { Character } from "@/database/models/character"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { NotesListForCategory, ObsidianCallout } from "@/constants/types/notes"

/**
 * Parses a note from an Obsidian markdown file.
 *
 * @param path - The file system path to the Obsidian markdown file.
 * @returns A promise that resolves to the processed HTML content as a string.
 */
export async function parseNoteFromObsidianFile(path: string) {
  const fileContents = fs.readFileSync(path, "utf8")
  const matterResult = matter(fileContents)
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  return processedContent.toString()
}

/**
 * Parses all Markdown notes for a given character within a specified folder.
 *
 * @param character - The character object whose notes are to be parsed. Must not be null.
 * @param folder - The folder name within the character's Obsidian path to search for notes. Must not be null.
 * @returns A promise that resolves to a `NotesListForCategory` object containing the names and parsed contents of the notes.
 * @throws Will throw an error if the folder or character is not provided.
 */
export async function parseNotesForCharacterInFolder(
  character: Character | null,
  folder: string | null
): Promise<NotesListForCategory> {
  if (!folder) {
    throw new Error("Folder not found")
  }
  if (!character) {
    throw new Error("Character not found")
  }
  const notesPath = character.obsidianPath + "//" + folder
  const notesInFolder = fs
    .readdirSync(notesPath)
    .filter((file) => file.endsWith(".md"))
  const results: NotesListForCategory = {
    notesNames: notesInFolder,
    notesList: {}
  }
  if (notesInFolder.length > 0) {
    notesInFolder.map(async (file) => {
      const fullPath = path.join(notesPath, file)
      results.notesList[file] = await parseNoteFromObsidianFile(fullPath)
    })
  }
  return results
}

/**
 * Extracts Obsidian callouts from a markdown file.
 *
 * This function reads the specified file, parses its frontmatter and content,
 * and extracts all Obsidian-style callouts (e.g., `> [!note] Title`) into an array.
 * Each callout includes its type, optional title, and content lines.
 *
 * @param filePath - The path to the markdown file to parse.
 * @returns An array of `ObsidianCallout` objects representing the extracted callouts.
 */
export function extractObsidianCallouts(filePath: string): ObsidianCallout[] {
  const fileContents = fs.readFileSync(filePath, "utf8")
  const matterResult = matter(fileContents)
  const lines = matterResult.content.split("\n")
  const callouts: ObsidianCallout[] = []
  let current: ObsidianCallout | null = null

  for (const line of lines) {
    const calloutStart = line.match(/^> \[!(\w+)\](?: (.*))?/)
    if (calloutStart) {
      if (current) callouts.push(current)

      current = {
        type: calloutStart[1].toLowerCase(),
        title: calloutStart[2] || "",
        content: []
      }
    } else if (line.startsWith(">") && current) {
      current.content.push(line.replace(/^> ?/, ""))
    } else {
      if (current) {
        callouts.push(current)
        current = null
      }
    }
  }

  if (current) callouts.push(current)
  return callouts
}
