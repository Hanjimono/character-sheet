// This route is kept only for backwards compatibility.
// New URLs should use `/{characterId}/spells`.
import { redirect } from "next/navigation"

export default function LegacySpellsPage() {
  redirect("/")
}
