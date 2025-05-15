// System
import { useCallback, useState } from "react"
import { twMerge } from "tailwind-merge"
import { cx } from "class-variance-authority"
// Service
import { usePostData } from "@/service/fetcher"
// Constants
import { PlayerInfo } from "@/constants/types/players"
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
import PlayerFrameSelect from "@/components/Helpers/PlayerFrameSelect"
import Dice from "@/components/Presentation/Dice"

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
  const calculatedClassNames = twMerge(
    cx("dice-saver box-border min-w-80", className)
  )
  const [player, setPlayer] = useState<PlayerInfo | undefined>()
  const [saveCriticalRoll] = usePostData(
    "/api/stats/rolls/save",
    {},
    characterId,
    {
      player: player?.id,
      isNegative
    },
    `Roll saved for ${player?.name} (it's ${isNegative ? "natural 1" : "natural 20"})`
  )
  const handleSave = useCallback(async () => {
    if (!player) {
      return
    }
    const result = await saveCriticalRoll()
    if (result) {
      onConfirm?.()
      onClose()
    }
  }, [player, saveCriticalRoll, onConfirm, onClose])
  return (
    <Modal title={title} onClose={onClose} className={calculatedClassNames}>
      <Room>
        <Beam>
          <PlayerFrameSelect
            characterId={characterId}
            selectedPlayerId={player?.id}
            onPlayerSelect={setPlayer}
          />
          <div className="flex flex-col items-center justify-center ml-4 pointer-events-none">
            <Dice isPositive={!isNegative} isWithoutCount />
          </div>
        </Beam>
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
