"use client"
// System
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { cx } from "class-variance-authority"
import { z } from "zod"
// Lib
import { trpc } from "@/lib/trpc/client"
import { useSetCharacterId } from "@/lib/trpc/hooks"
// Store
import { useStore } from "@/store"
// Components
import PlayerFrameSelect from "@/components/Helpers/PlayerFrameSelect"
// Ui
import Modal from "@/ui/Navigation/Modal"
import Beam from "@/ui/Layout/Beam"
import Button from "@/ui/Actions/Button"
import Title from "@/ui/Presentation/Title"
import FormElementWrapper, {
  FormElementNestedWrapper
} from "@/ui/Form/FormElementWrapper"
import Form from "@/ui/Form/Form"
import Input from "@/ui/Form/Input"
import FormSubmit from "@/ui/Form/FormSubmit"
import Brick from "@/ui/Layout/Brick"
import Inline from "@/ui/Layout/Inline"
// Constants
import { PlayerInfo } from "@/constants/types/players"
// Styles and types
import { HealSaverModalProps } from "./types"

const healSaverSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
  count: z.coerce.number().min(0, "Count is required")
})

/**
 * A modal component for saving the result of receiving or giving healing.
 *
 * @component
 * @param {HealSaverModalProps} props - The properties for the HealSaverModal component.
 * @param {string} [props.className] - Additional class names to style the modal.
 * @param {() => void} [props.onConfirm] - Callback function triggered after successfully saving the heal.
 * @param {boolean} props.isNegative - Indicates whether the heal is received (true) or given (false).
 * @param {string} props.characterId - The ID of the character associated with the heal.
 * @param {string} [props.title="Save Heal stats"] - The title of the modal.
 * @param {() => void} props.onClose - Callback function triggered when the modal is closed.
 */
function HealSaverModal({
  className,
  onConfirm,
  isNegative,
  characterId,
  title = "Save Heal stats",
  onClose
}: HealSaverModalProps) {
  useSetCharacterId(characterId)
  const errorSnack = useStore((state) => state.errorSnack)
  const successSnack = useStore((state) => state.successSnack)
  const calculatedClassNames = twMerge(
    cx("heal-saver box-border w-117 bg-transparent", className)
  )
  const [player, setPlayer] = useState<PlayerInfo | undefined>()
  const saveHealMutation = trpc.stats.heal.save.useMutation({
    onSuccess: () => {
      successSnack(`Heal saved for ${player?.name}`)
      onConfirm?.()
      onClose()
    },
    onError: (error) => {
      errorSnack(error.message || "Failed to save heal")
    }
  })
  const handleSave = async (data: z.infer<typeof healSaverSchema>) => {
    if (!player) {
      return
    }
    const { count, comment } = data
    saveHealMutation.mutate({
      player: player.id,
      isNegative: isNegative,
      count: count || 0,
      comment: comment
    })
  }
  return (
    <Modal className={calculatedClassNames}>
      <Form
        onSubmit={handleSave}
        validationSchema={
          healSaverSchema as z.ZodType<
            z.infer<typeof healSaverSchema>,
            z.infer<typeof healSaverSchema>
          >
        }
      >
        <Title className="w-full" uppercase size={1} align="center">
          {isNegative ? "Heal received" : "Heal given"}
        </Title>
        <FormElementNestedWrapper>
          <Inline>
            <PlayerFrameSelect
              className="w-32 h-32"
              characterId={characterId}
              onPlayerSelect={setPlayer}
              selectedPlayerId={player?.id}
            />
            <Brick durability={7} className="gap-same-level flex flex-col">
              <FormElementWrapper>
                <Input
                  name="count"
                  label="Heal count"
                  icon={isNegative ? "church" : "health_cross"}
                />
              </FormElementWrapper>
            </Brick>
          </Inline>
        </FormElementNestedWrapper>
        <FormElementNestedWrapper>
          <Brick durability={7} className="gap-same-level flex flex-col" whole>
            <FormElementWrapper>
              <Input name="comment" label="comment" />
            </FormElementWrapper>
            <Inline className="justify-end">
              <FormElementWrapper>
                <FormSubmit disabled={!player || saveHealMutation.isPending}>
                  Save
                </FormSubmit>
                <Button onClick={onClose} transparent>
                  Cancel
                </Button>
              </FormElementWrapper>
            </Inline>
          </Brick>
        </FormElementNestedWrapper>
      </Form>
    </Modal>
  )
}
export default HealSaverModal
