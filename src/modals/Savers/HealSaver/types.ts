import { DefaultModalProps } from "@/constants/types/modals"

export interface HealSaverModalProps extends DefaultModalProps {
  type: "healSaver"
  characterId?: number
  /** Classes */
  className?: string
  /** Flag to indicate heal received (true) or heal given (false) */
  isNegative?: boolean
  /** Callback function to be executed on confirm */
  onConfirm?: () => void
}
