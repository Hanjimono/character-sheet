import { DefaultModalProps } from "@/constants/types/modals"

export interface MoneyChangeSaverModalProps extends DefaultModalProps {
  type: "moneyChangeSaver"
  characterId?: number
  /** Classes */
  className?: string
  /** Flag to remove or add money */
  isNegative?: boolean
  /** Flag to indicate if the money is being transferred from one player to another */
  isTransfer?: boolean
  /** Callback function to be executed on confirm */
  onConfirm?: () => void
  /** Is this a common fund? */
  isCommon?: boolean
}
