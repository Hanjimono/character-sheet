"use client"
// System
import { useRouter } from "next/navigation"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useCharacterId } from "@/lib/trpc/characterIdContext"
// Ui
import Button from "@/ui/Actions/Button"
import Title from "@/ui/Presentation/Title"
import Text from "@/ui/Presentation/Text"
import Beam from "@/ui/Layout/Beam"
import Pillar from "@/ui/Layout/Pillar"
// Styles and types
import { CharacterSelectionProps } from "./types"

/**
 * CharacterSelection component displays a list of available characters
 * and allows the user to select one to use.
 */
function CharacterSelection({ className }: CharacterSelectionProps) {
  const router = useRouter()
  const { setCharacterId } = useCharacterId()
  const { data: characters, isLoading } = trpc.dictionary.characters.useQuery()

  const handleCharacterSelect = (characterId: number) => {
    setCharacterId(characterId)
    localStorage.setItem("characterId", characterId.toString())
    document.cookie = `character=${characterId}; path=/; max-age=31536000`
    // Navigate to character-specific page; route id defines characterId
    router.push(`/character/${characterId}`)
  }

  if (isLoading) {
    return (
      <Beam className="justify-center items-center min-h-96">
        <Text>Loading characters...</Text>
      </Beam>
    )
  }

  if (!characters || characters.length === 0) {
    return (
      <Beam className="justify-center items-center min-h-96">
        <Text>No characters available. Please create a character first.</Text>
      </Beam>
    )
  }

  return (
    <Beam className={className} contentJustify="center" contentAlign="center">
      <Pillar lg={8} md={10} xs={12}>
        <Beam className="flex-col gap-other-level">
          <Beam className="flex-col gap-same-level">
            <Title size={1} bottomGap="same">
              Select Character
            </Title>
            <Text size="small" className="text-gray-400">
              Choose a character to view their character sheet
            </Text>
          </Beam>
          <Beam className="flex-col gap-same-level">
            {characters.map((character) => (
              <Button
                key={character.id}
                onClick={() => handleCharacterSelect(character.id)}
                wide
                primary
                className="p-6 h-auto"
              >
                <Beam className="flex-col gap-close" contentAlign="start">
                  <Text size="large" className="font-semibold">
                    {character.name}
                  </Text>
                </Beam>
              </Button>
            ))}
          </Beam>
        </Beam>
      </Pillar>
    </Beam>
  )
}

export default CharacterSelection
