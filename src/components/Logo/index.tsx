// System
import Image from "next/image"
// Ui
import Title from "@/ui/Presentation/Title"
import Beam from "@/ui/Layout/Beam"

export default function Logo({ className }: { className?: string }) {
  return (
    <Beam className={"h-12 items-center py-2 px-4"} withoutGap>
      <Image alt="logo" src={"/images/logo_small.png"} width={20} height={20} />
      <Title className="ml-2" size={5} bottomGap="same">
        Ui-kit
      </Title>
    </Beam>
  )
}
