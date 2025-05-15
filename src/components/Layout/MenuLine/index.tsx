"use client"
import ImageButton from "@/ui/Actions/ImageButton"
import Beam from "@/ui/Layout/Beam"
import SmartImage from "@/ui/Presentation/SmartImage"
import Text from "@/ui/Presentation/Text"
import { motion } from "framer-motion"
import Link from "next/link"

export default function MenuLine() {
  return (
    <Beam>
      <ImageButton
        src="/public/images/backpack.png"
        className="w-48 h-48"
        alt="Рюкзак"
        title="Вещи"
        description="Все, что у вас есть"
        link="items"
      />
      <ImageButton
        src="/public/images/HalfBody.png"
        className="w-48 h-48"
        alt="Внешность"
        title="Внешность"
        description="Текстовое описание"
        link="appearance"
      />

      <ImageButton
        src="/public/images/Notes.png"
        className="w-48 h-48"
        alt="Записи"
        title="Записи"
        description="Заметки о кампейне"
        link="notes"
      />
      <ImageButton
        src="/public/images/More Than Half Body.png"
        className="w-48 h-48"
        alt="Способности"
        title="Способности"
        description="Красочное описание"
        link="spells"
      />
    </Beam>
  )
}
