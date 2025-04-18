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
import { DiceRollSaverModalProps } from "./types"

/**
 * A modal component for saving the result of a critical dice roll.
 *
 * @component
 * @param {DiceRollSaverModalProps} props - The properties for the DiceRollSaverModal component.
 * @param {string} [props.className] - Additional class names to style the modal.
 * @param {() => void} [props.onConfirm] - Callback function triggered after successfully saving the roll.
 * @param {boolean} props.isNegative - Indicates whether the roll is a natural 1 (true) or a natural 20 (false).
 * @param {string} props.characterId - The ID of the character associated with the roll.
 * @param {string} [props.title="Save result of Critical Roll"] - The title of the modal.
 * @param {() => void} props.onClose - Callback function triggered when the modal is closed.
 */
function DiceRollSaverModal({
  className,
  onConfirm,
  isNegative,
  characterId,
  title = "Save result of Critical Roll",
  onClose
}: DiceRollSaverModalProps) {
  const successSnack = useStore((state) => state.successSnack)
  const errorSnack = useStore((state) => state.errorSnack)
  const calculatedClassNames = twMerge(
    cx("dice-saver box-border min-w-96", className)
  )
  const [player, setPlayer] = useState<PlayerInfo | undefined>()
  const handleSave = useCallback(async () => {
    if (!player) {
      return
    }
    try {
      const response = await fetch(
        "/api/stats/rolls/save?character=" + characterId,
        {
          method: "POST",
          body: JSON.stringify({
            player: player.id,
            isNegative: isNegative
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      const data = await response.json()
      if (!data.success) {
        errorSnack("Error saving roll")
        onClose()
        return
      }
      successSnack(
        `Roll saved for ${player.name} (it's ${isNegative ? "natural 1" : "natural 20"})`
      )
      if (!!onConfirm) {
        onConfirm()
      }
      onClose()
    } catch (error) {
      errorSnack("Error saving roll")
      onClose()
    }
  }, [
    characterId,
    player,
    onClose,
    onConfirm,
    isNegative,
    errorSnack,
    successSnack
  ])
  return (
    <Modal title={title} onClose={onClose} className={calculatedClassNames}>
      <Room>
        <Text>
          Which player is rolled a{" "}
          <span className="font-bold text-gray-400">
            natural {isNegative ? "1" : "20"}?
          </span>
        </Text>
        <PlayerSelect
          characterId={characterId}
          selectedPlayerId={player?.id}
          onPlayerSelect={setPlayer}
        />
        <Beam contentJustify="end">
          <Button onClick={handleSave} disabled={!player}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Beam>
      </Room>
    </Modal>
  )
}
export default DiceRollSaverModal
