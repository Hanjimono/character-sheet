// Components
import ModalContainer from "@/components/Containers/ModalContainer"
import SnackbarContainer from "@/components/Containers/SnackbarContainer"

/**
 * Special component for initializing some service components
 */
export default function Initializer() {
  return (
    <>
      <ModalContainer />
      <SnackbarContainer />
    </>
  )
}
