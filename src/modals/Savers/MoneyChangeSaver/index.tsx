// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Styles and types
import { MoneyChangeSaverModalProps } from "./types"
import Modal from "@/ui/Navigation/Modal"
import Room from "@/ui/Layout/Room"
import PlayerSelect from "@/components/Helpers/PlayerSelect"
import { useState } from "react"
import { PlayerInfo } from "@/constants/types/players"
import Beam from "@/ui/Layout/Beam"
import FormField from "@/ui/Form/Field"
import Input from "@/ui/Form/Input"
import Form from "@/ui/Form/Form"
import CoinSign from "@/components/Helpers/CoinSign"
import FormSubmit from "@/ui/Form/FormSubmit"
import Button from "@/ui/Actions/Button"
import * as yup from "yup"
import { transformCoinsToCopper } from "@/utils"
import { useStore } from "@/store"

const formValues = {
  platinum: yup.number().nullable(),
  electrum: yup.number().nullable(),
  gold: yup.number().nullable(),
  silver: yup.number().nullable(),
  copper: yup.number().nullable(),
  comment: yup.string()
}

function MoneyChangeSaverModal({
  className,
  onClose,
  characterId,
  isNegative,
  isTransfer,
  isCommon,
  onConfirm
}: MoneyChangeSaverModalProps) {
  const calculatedClassNames = cx(
    twMerge("money-change-saver-modal", className)
  )
  const successSnack = useStore((state) => state.successSnack)
  const errorSnack = useStore((state) => state.errorSnack)
  const title = isTransfer
    ? "Transfer money to another player"
    : isNegative
      ? "Remove money from player"
      : "Add money to player"
  const [fromPlayer, setFromPlayer] = useState<PlayerInfo | undefined>()
  const [toPlayer, setToPlayer] = useState<PlayerInfo | undefined>()
  const handleConfirm = async (data: any) => {
    const { platinum, electrum, gold, silver, copper, comment } = data
    const money = transformCoinsToCopper({
      platinum: Number(platinum) || 0,
      electrum: Number(electrum) || 0,
      gold: Number(gold) || 0,
      silver: Number(silver) || 0,
      copper: Number(copper) || 0
    })
    try {
      const response = await fetch(
        `/api/money/change?character=${characterId}`,
        {
          method: "POST",
          body: JSON.stringify({
            money: isNegative ? -money : money,
            fromPlayerId: fromPlayer?.id,
            toPlayerId: toPlayer?.id,
            count: money,
            isTransfer,
            isCommon,
            isNegative,
            comment
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      const result = await response.json()
      if (!result.success) {
        errorSnack(result.error || "Failed to save money change")
        return
      }
    } catch (error) {
      errorSnack("Failed to save money change")
      return
    }
    successSnack("Money change saved")
    onConfirm?.()
    onClose()
  }
  return (
    <Modal title={title} onClose={onClose} className={calculatedClassNames}>
      <Room>
        <Beam>
          <FormField>
            <PlayerSelect
              characterId={characterId}
              label={isTransfer ? "From Player" : "Player"}
              onPlayerSelect={setFromPlayer}
              selectedPlayerId={fromPlayer?.id}
            />
          </FormField>
          {isTransfer && (
            <FormField>
              <PlayerSelect
                characterId={characterId}
                label={"To player"}
                onPlayerSelect={setToPlayer}
                selectedPlayerId={toPlayer?.id}
              />
            </FormField>
          )}
        </Beam>
        <Beam>
          <Form
            onSubmit={handleConfirm}
            validationSchema={yup.object(formValues)}
          >
            <span className="text-gray-400 w-12 h-full">
              <CoinSign type="platinum" />
            </span>
            <Input name="platinum" label="platinum" md={1} />
            <span className="text-gray-400 w-12 h-full">
              <CoinSign type="electrum" />
            </span>
            <Input name="electrum" label="electrum" md={1} />
            <span className="text-gray-400 w-12 h-full">
              <CoinSign type="gold" />
            </span>
            <Input name="gold" label="gold" md={1} />
            <span className="text-gray-400 w-12 h-full">
              <CoinSign type="silver" />
            </span>
            <Input name="silver" label="silver" md={1} />
            <span className="text-gray-400 w-12 h-full">
              <CoinSign type="copper" />
            </span>
            <Input name="copper" label="copper" md={1} />
            <Input name="comment" label="Comment" md={12} />
            <FormSubmit>Save</FormSubmit>
            <Button onClick={onClose}>Cancel</Button>
          </Form>
        </Beam>
      </Room>
    </Modal>
  )
}
export default MoneyChangeSaverModal
