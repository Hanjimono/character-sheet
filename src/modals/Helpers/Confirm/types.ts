import { DefaultModalProps } from "@/constants/types/modals"

/** Renders a confirm modal dialog with customizable text, title, and action buttons. */
export interface ConfirmModalProps extends DefaultModalProps {
  type: "confirm"
  /** Classes */
  className?: string
  /** Text to display in the alert modal */
  text?: string
  /** Function to call when the confirm button is clicked */
  onConfirm?: () => void
  /** Function to call when the cancel button is clicked */
  onCancel?: () => void
  /** Title of the modal */
  confirmButtonTitle?: string
  /** Text to display on the cancel button */
  cancelButtonTitle?: string
}
