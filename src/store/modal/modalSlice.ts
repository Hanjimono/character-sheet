// System
import { StateCreator } from "zustand"
import { produce } from "immer"

// Constant
import { ModalName } from "@/constants/modalList"
import { ModalStoreInterfaceMap } from "@/constants/types/modals"

export type OpenedModal = Record<ModalName, ModalStoreInterfaceMap[ModalName]>

/**
 * Represents the state of the modal system.
 */
export interface ModalState {
  /**
   * List of all opened modals.
   */
  listOfOpenModals: Partial<OpenedModal>

  /**
   * Opens a modal with the specified name and optional properties.
   *
   * @template Name - The name of the modal to open.
   * @param modalName - The name of the modal to open.
   * @param props - Optional properties to pass to the modal.
   */
  openModal: <Name extends ModalName>(
    modalName: Name,
    props?: ModalStoreInterfaceMap[Name]
  ) => void

  /**
   * Closes the modal with the specified name.
   *
   * @param modalName - The name of the modal to close.
   */
  closeModal: (modalName: ModalName) => void

  /**
   * Closes all open modals.
   */
  closeAllModals: () => void

  /**
   * Displays an alert modal with the specified text and optional properties.
   *
   * @param text - The text to display in the alert modal.
   * @param props - Optional properties to pass to the alert modal.
   */
  alert: (text: string, props?: ModalStoreInterfaceMap["alert"]) => void

  /**
   * Displays a confirm modal with the specified text and optional properties.
   *
   * @param text - The text to display in the confirm modal.
   * @param props - Optional properties to pass to the confirm modal.
   */
  confirm: (text: string, props?: ModalStoreInterfaceMap["confirm"]) => void
}

/**
 * Store for managing the state of the modal system.
 */
export const createModalStore: StateCreator<ModalState> = (set, get) => ({
  listOfOpenModals: {},
  openModal: (modalName, props) =>
    set(
      produce((draft: ModalState) => {
        if (!draft.listOfOpenModals[modalName]) {
          draft.listOfOpenModals[modalName] =
            {} as ModalStoreInterfaceMap[ModalName]
        }
        draft.listOfOpenModals[modalName] = {
          ...draft.listOfOpenModals[modalName],
          ...props
        }
      })
    ),
  closeModal: (modalName) =>
    set(
      produce((draft: ModalState) => {
        if (!!draft.listOfOpenModals[modalName]) {
          delete draft.listOfOpenModals[modalName]
        }
      })
    ),
  closeAllModals: () => {
    set(
      produce((draft: ModalState) => {
        draft.listOfOpenModals = {}
      })
    )
  },
  alert: (text, props = {}) => {
    let alertProps = { ...props }
    if (!alertProps) {
      alertProps = {
        text
      }
    }
    alertProps.text = text
    alertProps.title = alertProps.title || "Warning!"
    get().openModal("alert", alertProps)
  },
  confirm: (text, props = {}) => {
    let confirmProps = { ...props }
    if (!confirmProps) {
      confirmProps = {
        text
      }
    }
    confirmProps.text = text
    confirmProps.title = confirmProps.title || "Confirm action"
    confirmProps.isNotClosable = true
    get().openModal("confirm", confirmProps)
  }
})
