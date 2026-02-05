// This route is kept only for backwards compatibility.
// New URLs should use `/{characterId}/notes`.
import { redirect } from "next/navigation"

export default function LegacyNotesPage() {
  redirect("/")
}
