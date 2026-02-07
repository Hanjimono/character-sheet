"use client"
// System
import { motion } from "framer-motion"
// Ui
import Inline from "@/ui/Layout/Inline"
import SmartImage from "@/ui/Presentation/SmartImage"
import { useCharacterId } from "@/lib/trpc/characterIdContext"
import { useEffect, useState } from "react"
import { CharacterSheetProps } from "@/components/Sheet/Character/types"
import {
  CharacterIconsAndLinks,
  CharacterInfoLine
} from "@/constants/types/character"

export default function MainInfo({ characterId }: CharacterSheetProps) {
  const [data, setData] = useState<CharacterInfoLine[]>([])
  const [icons, setIcons] = useState<CharacterIconsAndLinks>({})
  useEffect(() => {
    fetch(`/json/info/character-${characterId}.json`)
      .then((res) => res.json())
      .then((json) => setData(json))
    fetch(`/json/icons/character-${characterId}.json`)
      .then((res) => res.json())
      .then((json) => setIcons(json))
  }, [characterId])
  return (
    <Inline>
      <div className="w-64 h-64 overflow-hidden rounded-md">
        <SmartImage src={icons.avatarIcon} alt="Avatar" />
      </div>
      <div className="flex flex-col gap-close flex-1 max-w-96 py-2">
        {data.map((line) => (
          <DataLine key={line.title} title={line.title} data={line.value} />
        ))}
      </div>
      <div className="flex flex-col gap-other-level py-3">
        <motion.a
          target="_blank"
          href={icons.beyondLink}
          className="w-24 h-24 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer saturate-20 hover:saturate-70 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <SmartImage src={icons.beyondIcon} alt="" />
        </motion.a>
        <motion.a
          target="_blank"
          href={icons.campaignLink}
          className="w-24 h-24 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer saturate-20 hover:saturate-70 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <SmartImage
            src={icons.campaignIcon}
            className="object-cover"
            alt=""
          />
        </motion.a>
      </div>
    </Inline>
  )
}

function DataLine({ title, data }: { title: string; data: string }) {
  return (
    <div className="flex items-center gap-2 bg-block-700 w-full px-2 py-2">
      <span className="text-light">{title}</span>
      <span>{data}</span>
    </div>
  )
}
