"use client"
// Ui
import Note from "@/ui/Presentation/Note"

export default function WithoutCampaignView() {
  return (
    <Note type="info" title="There is no active campaign">
      Some features as dice roll count or gold management are available only in
      active campaigns. You should create or activate a campaign to use them.
    </Note>
  )
}
