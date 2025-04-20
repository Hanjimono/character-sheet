import { DefaultModalProps } from "@/constants/types/modals"

export interface DamageSaverModalProps extends DefaultModalProps {
  type: "damageSaver"
  characterId?: number
  /** Classes */
  className?: string
  /** Flag to indicate natural 1 roll */
  isNegative?: boolean
  /** Callback function to be executed on confirm */
  onConfirm?: () => void
}
