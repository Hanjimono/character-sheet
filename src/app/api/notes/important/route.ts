import { withCampaignContext } from "@/lib/api/context/campaing"
import { ObsidianCallout } from "@/constants/types/notes"
import { extractObsidianCallouts } from "@/lib/api/obsidianParser"

export const GET = withCampaignContext<ObsidianCallout[]>(
  async ({ character }) => {
    if (!character) {
      throw new Error("Character not found")
    }
    const notePath = character.obsidianPath + "//" + "important.md"
    return extractObsidianCallouts(notePath)
  }
)
