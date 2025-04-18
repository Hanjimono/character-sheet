"use client"
import Beam from "@/ui/Layout/Beam"
import SmartImage from "@/ui/Presentation/SmartImage"
import Text from "@/ui/Presentation/Text"
import { motion } from "framer-motion"
import Link from "next/link"

export default function MenuLine() {
  return (
    <Beam>
      <MenuItem src="/public/images/backpack.png" title="Вещи" link="items" />
      <MenuItem
        src="/public/images/HalfBody.png"
        title="Внешность"
        link="appearance"
      />
      <MenuItem src="/public/images/Notes.png" title="Записи" link="notes" />
      <MenuItem
        src="/public/images/More Than Half Body.png"
        title="Способности"
        link="spells"
      />
    </Beam>
  )
}

function MenuItem({
  src,
  title,
  link
}: {
  src: string
  title: string
  link: string
}) {
  return (
    <Link className="flex flex-col gap-2" href={link}>
      <motion.div
        className="w-48 h-48 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer saturate-70 hover:saturate-100 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <SmartImage src={src} alt="" />
      </motion.div>
      <Text className="pl-2" size="small">
        {title}
      </Text>
    </Link>
  )
}
