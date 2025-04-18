import { DefaultModalProps } from "@/constants/types/modals"

export interface DiceRollSaverModalProps extends DefaultModalProps {
  type: "diceRollSaver"
  characterId?: number
  /** Classes */
  className?: string
  /** Flag to indicate natural 1 roll */
  isNegative?: boolean
  /** Callback function to be executed on confirm */
  onConfirm?: () => void
}
