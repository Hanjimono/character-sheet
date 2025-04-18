// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { MoneyBalanceProps } from "./types"
import CoinSign from "@/components/Helpers/CoinSign"
import Room from "@/ui/Layout/Room"
import Title from "@/ui/Presentation/Title"
import MoneyRender from "@/components/Helpers/MoneyRender"
import Beam from "@/ui/Layout/Beam"
import Button from "@/ui/Actions/Button"
import Text from "@/ui/Presentation/Text"
import Divider from "@/ui/Presentation/Divider"

function MoneyBalance({ className }: MoneyBalanceProps) {
  const calculatedClassNames = cx(
    twMerge(
      "money-balance bg-block-700 min-w-full min-h-8 p-2 rounded-md",
      className
    )
  )
  return (
    <Room className={calculatedClassNames} noGap>
      <Beam>
        <Title size={3} bottomGap="almost-same">
          Money Balance
        </Title>
      </Beam>
      <Beam contentAlign="center">
        <Text className="text-gray-400" size="small">
          Common funds:
        </Text>
        <MoneyRender
          className="bg-block-800 py-2 px-3 rounded-lg"
          amount={407134}
          isShowZero
        />
        <div className="flex gap-1">
          <Button className="h-6 w-6" icon="add" text />
          <Button className="h-6 w-6" icon="remove" text />
          <Button className="h-6 w-6" icon="swap_horiz" text />
        </div>
      </Beam>
      <Divider gap="almost-same" />
      <Beam contentAlign="center">
        <Title size={4} bottomGap="same" className="text-gray-400">
          Players total:
        </Title>
        <MoneyRender
          className="bg-block-800 py-2 px-3 rounded-lg"
          amount={407}
          isShowZero
        />
        <div className="flex gap-1">
          <Button className="h-6 w-6" icon="add" text />
          <Button className="h-6 w-6" icon="remove" text />
          <Button className="h-6 w-6" icon="swap_horiz" text />
        </div>
      </Beam>
    </Room>
  )
}
export default MoneyBalance
