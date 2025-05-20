// Constants
import { DROW_WARLOCK } from "@/constants/characters"
// Components
import CharacterLeftPartView from "./leftPart"
import CampaignView from "@/components/Layout/CampaignView"
// ui
import Beam from "@/ui/Layout/Beam"
import Pillar from "@/ui/Layout/Pillar"

export default function DrowDiaryPage() {
  return (
    <Beam>
      <Pillar lg={8} md={12} xs={12}>
        <CharacterLeftPartView />
      </Pillar>
      <Pillar lg={4} md={12} xs={12}>
        <CampaignView characterId={DROW_WARLOCK} />
      </Pillar>
    </Beam>
  )
}
