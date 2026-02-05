"use client"
// System
import { useCallback, useState } from "react"
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
import Checkbox from "@/ui/Form/Checkbox"
import Brick from "@/ui/Layout/Brick"
// Styles and types
import { DamageSaverModalProps } from "./types"
import { PlayerInfo } from "@/constants/types/players"
import Inline from "@/ui/Layout/Inline"

const damageSaverSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
  count: z.coerce.number().min(0, "Count is required"),
  isSummon: z.boolean().optional().default(false)
})

/**
 * A modal component for saving the result of getting or dealing damage.
 *
 * @component
 * @param {DamageSaverModalProps} props - The properties for the DamageSaverModal component.
 * @param {string} [props.className] - Additional class names to style the modal.
 * @param {() => void} [props.onConfirm] - Callback function triggered after successfully saving the damage.
 * @param {boolean} props.isNegative - Indicates whether the damage is a taken damage (true) or dealt damage (false).
 * @param {string} props.characterId - The ID of the character associated with the damage.
 * @param {string} [props.title="Save result of Critical damage"] - The title of the modal.
 * @param {() => void} props.onClose - Callback function triggered when the modal is closed.
 */
function DamageSaverModal({
  className,
  onConfirm,
  isNegative,
  characterId,
  title = "Save Damage stats",
  onClose
}: DamageSaverModalProps) {
  useSetCharacterId(characterId)
  const errorSnack = useStore((state) => state.errorSnack)
  const successSnack = useStore((state) => state.successSnack)
  const calculatedClassNames = twMerge(
    cx("damage-saver box-border w-117 bg-transparent", className)
  )
  const [player, setPlayer] = useState<PlayerInfo | undefined>()
  const saveDamageMutation = trpc.stats.damage.save.useMutation({
    onSuccess: () => {
      successSnack(`Damage saved for ${player?.name}`)
      onConfirm?.()
      onClose()
    },
    onError: (error) => {
      errorSnack(error.message || "Failed to save damage")
    }
  })
  const handleSave = async (data: z.infer<typeof damageSaverSchema>) => {
    if (!player) {
      return
    }
    const { count, comment, isSummon } = data
    saveDamageMutation.mutate({
      player: player.id,
      isNegative: isNegative,
      count: count || 0,
      comment: comment,
      isSummon: isSummon || false
    })
  }
  return (
    <Modal className={calculatedClassNames}>
      <Form
        onSubmit={handleSave}
        validationSchema={
          damageSaverSchema as z.ZodType<
            z.infer<typeof damageSaverSchema>,
            z.infer<typeof damageSaverSchema>
          >
        }
      >
        <Title className="w-full" uppercase size={1} align="center">
          {title}
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
                  label="Damage count"
                  icon={isNegative ? "shield" : "swords"}
                />
                <Checkbox name="isSummon" label="Check if it's not a player" />
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
                <FormSubmit disabled={!player || saveDamageMutation.isPending}>
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
export default DamageSaverModal
