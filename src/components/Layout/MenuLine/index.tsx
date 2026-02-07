"use client"
import { CharacterSheetProps } from "@/components/Sheet/Character/types"
import { CharacterIcons } from "@/constants/types/character"
// Ui
import ImageButton from "@/ui/Actions/ImageButton"
import Inline from "@/ui/Layout/Inline"
import { useEffect, useState } from "react"

export default function MenuLine({ characterId }: CharacterSheetProps) {
  const [icons, setIcons] = useState<CharacterIcons>({})
  useEffect(() => {
    fetch(`/json/icons/character-${characterId}.json`)
      .then((res) => res.json())
      .then((json) => setIcons(json))
  }, [characterId])
  return (
    <Inline>
      <ImageButton
        src={icons.inventoryIcon}
        className="w-48 h-48"
        alt="Рюкзак"
        title="Вещи"
        description="Все, что у вас есть"
        link={`/character/${characterId}/items`}
      />
      <ImageButton
        src={icons.appearanceIcon}
        className="w-48 h-48"
        alt="Внешность"
        title="Внешность"
        description="Текстовое описание"
        link={`/character/${characterId}/appearance`}
      />

      <ImageButton
        src={icons.notesIcon}
        className="w-48 h-48"
        alt="Записи"
        title="Записи"
        description="Заметки о кампейне"
        link={`/character/${characterId}/notes`}
      />
      <ImageButton
        src={icons.spellsIcon}
        className="w-48 h-48"
        alt="Способности"
        title="Способности"
        description="Красочное описание"
        link={`/character/${characterId}/spells`}
      />
    </Inline>
  )
}
