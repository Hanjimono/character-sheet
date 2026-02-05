"use client"
// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import * as yup from "yup"
import { useState } from "react"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Store
import { useStore } from "@/store"
// Components
import PlayerFrameSelect from "@/components/Helpers/PlayerFrameSelect"
// Ui
import Icon from "@/ui/Presentation/Icon"
import Title from "@/ui/Presentation/Title"
import Brick from "@/ui/Layout/Brick"
import FormElementWrapper, {
  FormContextElementWrapper,
  FormElementNestedWrapper
} from "@/ui/Form/FormElementWrapper"
import Beam from "@/ui/Layout/Beam"
import Input from "@/ui/Form/Input"
import Form from "@/ui/Form/Form"
import CoinSign from "@/components/Helpers/CoinSign"
import FormSubmit from "@/ui/Form/FormSubmit"
import Button from "@/ui/Actions/Button"
import Modal from "@/ui/Navigation/Modal"
// Utils
import { transformCoinsToCopper } from "@/utils"
// Styles and types
import { MoneyChangeSaverModalProps } from "./types"
import { PlayerInfo } from "@/constants/types/players"
import { CoinType } from "@/constants/types/money"

const formValues = {
  platinum: yup.number().nullable(),
  electrum: yup.number().nullable(),
  gold: yup.number().nullable(),
  silver: yup.number().nullable(),
  copper: yup.number().nullable(),
  comment: yup.string().required("Comment is required")
}

//TODO: add some specific styles for operations with common funds
/**
 * Modal component for handling money changes (add, remove, or transfer) for a character or common funds.-
 *
 * @param {string} [props.className] - Additional class names for styling the modal.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {string} props.characterId - The ID of the character for whom the money change is being made.
 * @param {boolean} props.isNegative - If true, the operation is a removal of money.
 * @param {boolean} props.isTransfer - If true, the operation is a transfer between players.
 * @param {boolean} props.isCommon - If true, the operation affects common funds.
 * @param {() => void} [props.onConfirm] - Optional callback invoked after a successful save.
 *
 * @returns {JSX.Element} The rendered modal component for changing money.
 */
function MoneyChangeSaverModal({
  className,
  onClose,
  characterId,
  isNegative,
  isTransfer,
  isCommon,
  onConfirm
}: MoneyChangeSaverModalProps) {
  useSetCharacterId(characterId)
  const errorSnack = useStore((state) => state.errorSnack)
  const successSnack = useStore((state) => state.successSnack)
  const calculatedClassNames = cx(
    twMerge(
      "money-change-saver-modal bg-transparent max-w-100",
      isTransfer && "max-w-160",
      className
    )
  )
  const title = isTransfer
    ? "Transfer money to player"
    : isNegative
      ? "Remove money"
      : "Add money"
  const [fromPlayer, setFromPlayer] = useState<PlayerInfo | undefined>()
  const [toPlayer, setToPlayer] = useState<PlayerInfo | undefined>()
  const changeMoneyMutation = trpc.money.change.useMutation({
    onSuccess: () => {
      successSnack("Money change saved")
      onConfirm?.()
      onClose()
    },
    onError: (error) => {
      errorSnack(error.message || "Failed to save money change")
    }
  })
  const handleConfirm = async (data: any) => {
    const { gold, silver, copper, comment } = data
    const money = transformCoinsToCopper({
      platinum: 0,
      electrum: 0,
      gold: Number(gold) || 0,
      silver: Number(silver) || 0,
      copper: Number(copper) || 0
    })
    changeMoneyMutation.mutate({
      fromPlayerId: fromPlayer?.id,
      toPlayerId: toPlayer?.id,
      count: money,
      isTransfer,
      isCommon,
      isNegative,
      comment
    })
  }
  const fromPlayerId = fromPlayer?.id
  const toPlayerId = toPlayer?.id
  return (
    <Modal className={calculatedClassNames}>
      <Form
        onSubmit={handleConfirm}
        validationSchema={yup.object(formValues)}
        useContext
      >
        <Title
          className="w-full"
          uppercase
          size={1}
          bottomGap="same"
          align="center"
        >
          {title}
        </Title>
        <Beam contentJustify="center" contentAlign="center" withoutWrap>
          <PlayerFrameSelect
            className="w-42 h-42"
            characterId={characterId}
            onPlayerSelect={setFromPlayer}
            selectedPlayerId={fromPlayerId}
            playersIdsToExclude={toPlayerId ? [toPlayerId] : []}
          />
          {isTransfer && <Icon type="md" name="sync_alt" size={32}></Icon>}
          {isTransfer && (
            <PlayerFrameSelect
              className="w-42 h-42"
              characterId={characterId}
              onPlayerSelect={setToPlayer}
              selectedPlayerId={toPlayerId}
              playersIdsToExclude={fromPlayerId ? [fromPlayerId] : []}
            />
          )}
          <Brick durability={7} className="w-36 flex flex-col gap-same-level">
            <CoinInput type="copper" />
            <CoinInput type="silver" />
            <CoinInput type="gold" />
          </Brick>
        </Beam>
        <FormElementNestedWrapper>
          <Beam contentJustify="center" contentAlign="center">
            <Brick className={cx(twMerge("w-86", "w-142"))} durability={7}>
              <FormElementWrapper>
                <Input
                  className="mb-same-level"
                  name="comment"
                  label="Comment"
                  md={12}
                />
              </FormElementWrapper>
              <Beam contentJustify="end">
                <FormElementWrapper>
                  <FormSubmit disabled={changeMoneyMutation.isPending}>
                    Save
                  </FormSubmit>
                </FormElementWrapper>
                <Button onClick={onClose} transparent>
                  Cancel
                </Button>
              </Beam>
            </Brick>
          </Beam>
        </FormElementNestedWrapper>
      </Form>
    </Modal>
  )
}

/**
 * Renders an input field for a specific coin type, displaying the coin sign and an input box.
 *
 * @param type - The type of coin to display and accept input for.
 */
function CoinInput({ type }: { type: CoinType }) {
  return (
    <div className="h-8 flex align-center justify-center">
      <CoinSign type={type} />
      <FormContextElementWrapper>
        <Input
          className="h-8 w-18 ml-close"
          name={type}
          label={type}
          labelOnTop
          withoutFormField
          placeholder="0"
        />
      </FormContextElementWrapper>
    </div>
  )
}
export default MoneyChangeSaverModal
