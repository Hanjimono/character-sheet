import { DefaultModalProps } from "@/constants/types/modals"

export interface AlertModalProps extends DefaultModalProps {
  type: "alert"
  /** Classes */
  className?: string
  /** Text to display in the alert modal */
  text?: string
}
