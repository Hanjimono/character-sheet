// System
import { StateCreator } from "zustand"
import { produce } from "immer"
// Ui
import { SnackbarType } from "@/ui/Navigation/Snackbar/types"

/** Props for a single Snackbar */
interface Snackbar {
  message: string
  type: SnackbarType
  title?: string
  duration?: number
  isClosing?: boolean
}

/**
 * Represents the state and actions related to snackbars in the application.
 */
export interface SnackbarState {
  /**
   * List of all opened snackbars.
   */
  listOfOpenSnackbar: Record<string, Snackbar>

  /**
   * Displays a snackbar with the given message, type, and duration.
   *
   * @param message - The message to display in the snackbar.
   * @param type - The type of the snackbar (optional).
   * @param title - The title of the snackbar (optional).
   * @param duration - The duration for which the snackbar should be displayed (optional).
   */
  snack: (
    message: string,
    type?: SnackbarType,
    title?: string,
    duration?: number
  ) => void

  /**
   * Delays the closing of a snackbar with the given ID.
   *
   * @param id - The ID of the snackbar to delay closing.
   */
  delayCloseSnackbar: (id: string) => void

  /**
   * Closes the snackbar with the given ID.
   *
   * @param id - The ID of the snackbar to close.
   */
  closeSnackbar: (id: string) => void

  /**
   * Closes all currently opened snackbars.
   */
  closeAllSnackbars: () => void

  /**
   * Displays an error snackbar with the given message and duration.
   *
   * @param message - The error message to display in the snackbar.
   * @param title - The title of the snackbar (optional).
   * @param duration - The duration for which the snackbar should be displayed (optional).
   */
  errorSnack: (message: string, title?: string, duration?: number) => void

  /**
   * Displays a success snackbar with the given message and duration.
   *
   * @param message - The success message to display in the snackbar.
   * @param title - The title of the snackbar (optional).
   * @param duration - The duration for which the snackbar should be displayed (optional).
   */
  successSnack: (message: string, title?: string, duration?: number) => void

  /**
   * Displays a critical error snackbar with the given message.
   *
   * @param message - The critical message to display in the snackbar.
   * @param title - The title of the snackbar (optional).
   */
  criticalSnack: (message: string, title?: string) => void
}

export const createSnackbarStore: StateCreator<SnackbarState> = (set, get) => ({
  listOfOpenSnackbar: {},
  snack: (message, type = "info", title, duration = 8) => {
    const id = Date.now().toString()
    set(
      produce((state) => {
        state.listOfOpenSnackbar[id] = { message, type, duration, title }
      })
    )
    return id
  },
  delayCloseSnackbar: (id) => {
    set(
      produce((state) => {
        if (state.listOfOpenSnackbar[id]) {
          state.listOfOpenSnackbar[id].isClosing = true
        }
      })
    )
    setTimeout(() => get().closeSnackbar(id), 300)
  },
  closeSnackbar: (id) => {
    set(
      produce((state) => {
        if (state.listOfOpenSnackbar[id]) {
          delete state.listOfOpenSnackbar[id]
        }
      })
    )
  },
  closeAllSnackbars: () => {
    set(
      produce((state) => {
        state.listOfOpenSnackbar = {}
      })
    )
  },
  errorSnack: (message, title, duration) => {
    return get().snack(message, "warning", title, duration)
  },
  successSnack: (message, title, duration) => {
    return get().snack(message, "success", title, duration)
  },
  criticalSnack: (message, title) => {
    return get().snack(message, "critical", title)
  }
})
