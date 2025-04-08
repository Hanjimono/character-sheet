// System
import { create } from "zustand"
// Store
import { createModalStore, ModalState } from "@/store/modal/modalSlice"
import {
  createSnackbarStore,
  SnackbarState
} from "@/store/snackbar/snackbarSlice"

export const useStore = create<ModalState & SnackbarState>()((...a) => ({
  ...createModalStore(...a),
  ...createSnackbarStore(...a)
}))
