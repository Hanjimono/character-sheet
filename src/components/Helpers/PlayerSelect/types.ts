import { PlayerInfo } from "@/constants/types/players"

export interface PlayerSelectOption {
  /** Player Id */
  value: number
  /** Player name */
  title: string
  /** Other player info */
  playerInfo: PlayerInfo
}

export interface PlayerSelectProps {
  /** Additional classes */
  className?: string
  /** Character Id to be used for the players list */
  characterId?: number
  /** Id of selected player */
  selectedPlayerId?: number
  /** Callback function for player selection */
  onPlayerSelect?: (player?: PlayerInfo) => void
  /** Name for select if there are several player selects in form */
  name?: string
  /** Custom label for select */
  label?: string
}
