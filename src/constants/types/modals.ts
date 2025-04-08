import { AlertModalProps } from "@/modals/Helpers/Alert/types"
import { ModalName } from "@/constants/modalList"
import { ConfirmModalProps } from "@/modals/Helpers/Confirm/types"

/**
 * Props that can be used in any modal but will be passed to the wrapper component
 */
export interface DefaultModalContainerProps {
  /** Removes mask from the modal */
  withoutMask?: boolean
  /** Function is called when the modal is closed */
  onClose?: () => void
  /** If true, modal can't be closed by clicking on the mask */
  isNotClosable?: boolean
}

/**
 * Props that can be used in any modal
 */
export interface DefaultModalProps {
  /** Type of the modal */
  type: ModalName
  /** Function for closing the modal */
  onClose: () => void
  /** Title of the modal */
  title?: string
}

/**
 * Props passed to modal store. It's slightly different from the props that are passed to the modal component.
 * It doesn't have onClose and type props, because they are passed by Modal Container and not necessary to be passed to the store by user.
 */
type ModalPropsForStore<T extends DefaultModalProps> = Omit<
  T,
  "onClose" | "type"
>

/**
 * Interface that maps modal names to their props
 */
export interface ModalStoreInterfaceMap {
  alert: DefaultModalContainerProps & ModalPropsForStore<AlertModalProps>
  confirm: DefaultModalContainerProps & ModalPropsForStore<ConfirmModalProps>
}
