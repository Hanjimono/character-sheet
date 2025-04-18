import AlertModal from "@/modals/Helpers/Alert"
import ConfirmModal from "@/modals/Helpers/Confirm"
import DiceRollSaverModal from "@/modals/Savers/DiceRollSaver"

/** List of all modals */
export const MODAL_LIST = {
  alert: AlertModal,
  confirm: ConfirmModal,
  diceRollSaver: DiceRollSaverModal
}

/** All available modals names */
export type ModalName = keyof typeof MODAL_LIST
