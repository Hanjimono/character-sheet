"use client"
// System
import { createElement, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
// Store
import { useStore } from "@/store"
// Ui
import ModalSkeleton from "@/ui/Skeleton/ModalSkeleton"
// Constants
import { MODAL_LIST, ModalName } from "@/constants/modalList"
import { ModalStoreInterfaceMap } from "@/constants/types/modals"

/**
 * Component that renders all open modals
 */
export default function ModalContainer() {
  const listOfOpenModals = useStore((state) => state.listOfOpenModals)
  const closeModal = useStore((state) => state.closeModal)
  const handleCloseModal = useCallback(
    (modalName: ModalName) => {
      const modal = listOfOpenModals[modalName] as
        | ModalStoreInterfaceMap[ModalName]
        | undefined
      if (!!modal) {
        if (!!modal.onClose) {
          modal.onClose()
        }
        closeModal(modalName)
      }
    },
    [listOfOpenModals, closeModal]
  )
  return (
    <AnimatePresence>
      {Object.keys(listOfOpenModals).length > 0 &&
        Object.keys(listOfOpenModals).map((modalName, key) => {
          const { withoutMask, isNotClosable, ...rest } = listOfOpenModals[
            modalName as ModalName
          ] as ModalStoreInterfaceMap[ModalName]
          const modalComponent = MODAL_LIST[modalName as ModalName]
          const onClose = () => handleCloseModal(modalName as ModalName)
          return (
            <ModalSkeleton
              isNotClosable={isNotClosable}
              withoutMask={withoutMask}
              key={key}
              onClose={onClose}
            >
              {createElement(
                modalComponent as React.ComponentType<
                  ModalStoreInterfaceMap[ModalName]
                >,
                { ...rest, onClose }
              )}
            </ModalSkeleton>
          )
        })}
    </AnimatePresence>
  )
}
