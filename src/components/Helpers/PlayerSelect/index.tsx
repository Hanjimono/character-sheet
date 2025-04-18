// System
import { useEffect, useState } from "react"
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
// Ui
import Select from "@/ui/Form/Select"
// Constants
import { PlayerInfo } from "@/constants/types/players"
// Styles and types
import { PlayerSelectOption, PlayerSelectProps } from "./types"

/**
 * A React component for selecting a player from a list of options.
 * The component fetches player data based on the provided `characterId`
 * and displays it in a dropdown menu. When a player is selected, the
 * `onPlayerSelect` callback is triggered with the selected player's information.
 *
 * @param {Object} props - The props for the PlayerSelect component.
 * @param {string} [props.className] - Additional class names to style the component.
 * @param {string} [props.name="player-select"] - The name attribute for the select input.
 * @param {string} [props.label="Player"] - The label displayed above the select input.
 * @param {number | undefined} props.characterId - The ID of the character used to fetch the player list.
 * @param {(playerInfo: PlayerInfo) => void} [props.onPlayerSelect] - Callback triggered when a player is selected.
 * @param {number | undefined} props.selectedPlayerId - The ID of the currently selected player.
 */
function PlayerSelect({
  className,
  name = "player-select",
  label = "Player",
  characterId,
  onPlayerSelect,
  selectedPlayerId
}: PlayerSelectProps) {
  const calculatedClassNames = cx(twMerge("player-select", className))
  const [playerList, setPlayerList] = useState<PlayerSelectOption[]>([])
  useEffect(() => {
    const fetchData = async () => {
      if (!characterId) return
      const response = await fetch(
        `/api/dictionary/players?character=${characterId}`
      )
      const data = await response.json()
      if (data && data.players) {
        const options: PlayerSelectOption[] = []
        data.players.map((player: PlayerInfo) => {
          options.push({
            value: player.id,
            title: player.name,
            playerInfo: player
          })
        })
        setPlayerList(options)
      }
    }
    fetchData()
  }, [characterId])
  const handlePlayerSelect = (name: string, value?: number) => {
    if (!value) {
      if (!!onPlayerSelect) {
        onPlayerSelect(undefined)
      }
      return
    }
    const selectedPlayer = playerList.find((player) => player.value === value)
    if (selectedPlayer && !!onPlayerSelect) {
      onPlayerSelect(selectedPlayer.playerInfo)
    }
  }
  return (
    <Select
      label={label}
      className={calculatedClassNames}
      name={name}
      options={playerList}
      clearable
      onChange={handlePlayerSelect}
      onClear={() => handlePlayerSelect(name, undefined)}
      value={selectedPlayerId}
    />
  )
}
export default PlayerSelect
