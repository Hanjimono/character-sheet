import { withCampaignContext } from "@/lib/api/context/campaing"
import { NotesListForCategory } from "@/constants/types/notes"
import { parseNotesForCharacterInFolder } from "@/lib/api/obsidianParser"

export const GET = withCampaignContext<NotesListForCategory>(
  async ({ req, character }) => {
    const { searchParams } = new URL(req.url)
    const folder = searchParams.get("folder")
    return parseNotesForCharacterInFolder(character, folder)
  }
)
