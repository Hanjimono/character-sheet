import AlertModal from "@/modals/Helpers/Alert"
import ConfirmModal from "@/modals/Helpers/Confirm"
import DamageSaverModal from "@/modals/Savers/DamageSaver"
import DiceRollSaverModal from "@/modals/Savers/DiceRollSaver"
import MoneyChangeSaverModal from "@/modals/Savers/MoneyChangeSaver"
import HealSaverModal from "@/modals/Savers/HealSaver"

/** List of all modals */
export const MODAL_LIST = {
  alert: AlertModal,
  confirm: ConfirmModal,
  diceRollSaver: DiceRollSaverModal,
  moneyChangeSaver: MoneyChangeSaverModal,
  damageSaver: DamageSaverModal,
  healSaver: HealSaverModal
}

/** All available modals names */
export type ModalName = keyof typeof MODAL_LIST
