import Beam from "@/ui/Layout/Beam"
import SmartImage from "@/ui/Presentation/SmartImage"
import { motion } from "framer-motion"

export default function MainInfo() {
  return (
    <Beam>
      <MainAvatar />
      <div className="flex flex-col gap-close flex-1 max-w-96 py-2">
        <DataLine title="Имя:" data="Сар'Таэль Верин'Келот" />
        <DataLine title="Раса:" data="Дроу" />
        <DataLine title="Класс:" data="Варлок (патрон Бездонный)" />
        <DataLine title="Уровень:" data="3" />
        <DataLine title="Возраст:" data="32" />
        <DataLine title="Языки:" data="Всеобщий, эльфийский, подземный" />
      </div>
      <div className="flex flex-col gap-other-level py-3">
        <motion.a
          target="_blank"
          href="https://www.dndbeyond.com/characters/144564949"
          className="w-24 h-24 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer saturate-20 hover:saturate-70 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <SmartImage src="/public/images/beyond1.png" alt="" />
        </motion.a>
        <motion.a
          target="_blank"
          href="https://www.dndbeyond.com/campaigns/6588296"
          className="w-24 h-24 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer saturate-20 hover:saturate-70 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <SmartImage
            src="/public/images/campaign.jpeg"
            className="object-cover"
            alt=""
          />
        </motion.a>
      </div>
    </Beam>
  )
}

function MainAvatar() {
  return (
    <div className="w-64 h-64 overflow-hidden rounded-md">
      <SmartImage src="/public/images/Portrait2Edited.png" alt="Avatar" />
    </div>
  )
}

function DataLine({ title, data }: { title: string; data: string }) {
  return (
    <div className="flex items-center gap-2 bg-block-700 w-full px-2 py-2">
      <span className="text-gray-500">{title}</span>
      <span>{data}</span>
    </div>
  )
}
