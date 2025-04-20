// System
import { useCallback, useState } from "react"
import { twMerge } from "tailwind-merge"
import { cx } from "class-variance-authority"
// Constants
import { PlayerInfo } from "@/constants/types/players"
// Store
import { useStore } from "@/store"
// Components
import PlayerSelect from "@/components/Helpers/PlayerSelect"
// Ui
import Modal from "@/ui/Navigation/Modal"
import Room from "@/ui/Layout/Room"
import Text from "@/ui/Presentation/Text"
import Beam from "@/ui/Layout/Beam"
import Button from "@/ui/Actions/Button"
// Styles and types
import { DamageSaverModalProps } from "./types"
import Form from "@/ui/Form/Form"
import Input from "@/ui/Form/Input"
import FormSubmit from "@/ui/Form/FormSubmit"
import Checkbox from "@/ui/Form/Checkbox"

/**
 * A modal component for saving the result of getting or dealing damage.
 *
 * @component
 * @param {DamageSaverModalProps} props - The properties for the DamageSaverModal component.
 * @param {string} [props.className] - Additional class names to style the modal.
 * @param {() => void} [props.onConfirm] - Callback function triggered after successfully saving the damage.
 * @param {boolean} props.isNegative - Indicates whether the damage is a taken damage (true) or dealt damage (false).
 * @param {string} props.characterId - The ID of the character associated with the damage.
 * @param {string} [props.title="Save result of Critical damage"] - The title of the modal.
 * @param {() => void} props.onClose - Callback function triggered when the modal is closed.
 */
function DamageSaverModal({
  className,
  onConfirm,
  isNegative,
  characterId,
  title = "Save result of Critical damage",
  onClose
}: DamageSaverModalProps) {
  const successSnack = useStore((state) => state.successSnack)
  const errorSnack = useStore((state) => state.errorSnack)
  const calculatedClassNames = twMerge(
    cx("damage-saver box-border min-w-96", className)
  )
  const [player, setPlayer] = useState<PlayerInfo | undefined>()
  const handleSave = useCallback(
    async (data: any) => {
      if (!player) {
        return
      }
      const { count, comment, isSummon } = data
      try {
        const response = await fetch(
          "/api/stats/damage/save?character=" + characterId,
          {
            method: "POST",
            body: JSON.stringify({
              player: player.id,
              isNegative: isNegative,
              count: Number(count) || 0,
              comment: comment || null,
              isSummon: isSummon || false
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        const data = await response.json()
        if (!data.success) {
          errorSnack("Error saving damage")
          onClose()
          return
        }
        successSnack(`Damage saved for ${player.name}`)
        if (!!onConfirm) {
          onConfirm()
        }
        onClose()
      } catch (error) {
        errorSnack("Error saving damage")
        onClose()
      }
    },
    [
      characterId,
      player,
      onClose,
      onConfirm,
      isNegative,
      errorSnack,
      successSnack
    ]
  )
  return (
    <Modal title={title} onClose={onClose} className={calculatedClassNames}>
      <Room>
        <Text>
          Which player is{" "}
          <span className="font-bold text-gray-400">
            {isNegative ? "taken damage" : "dealing damage"}?
          </span>
        </Text>
        <PlayerSelect
          characterId={characterId}
          selectedPlayerId={player?.id}
          onPlayerSelect={setPlayer}
        />
        <Form onSubmit={handleSave}>
          <Input name="count" label="count" />
          <Input name="comment" label="comment" />
          <Checkbox name="isSummon" label="Summon" />
          <FormSubmit disabled={!player}>Save</FormSubmit>
          <Button onClick={onClose}>Cancel</Button>
        </Form>
      </Room>
    </Modal>
  )
}
export default DamageSaverModal
