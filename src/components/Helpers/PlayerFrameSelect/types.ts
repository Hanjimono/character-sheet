import { PlayerInfo } from "@/constants/types/players"

export interface PlayerFrameSelectProps {
  /** Additional class names */
  className?: string
  /** Id of selected player */
  selectedPlayerId?: number
  /** Callback function for player selection */
  onPlayerSelect?: (player?: PlayerInfo) => void
  /** Character Id to be used for the players list */
  characterId?: number
  /** List of players to be excluded from the selection */
  playersIdsToExclude?: number[]
}

export interface PlayerFramePortraitProps {
  /** Additional class names */
  className?: string
  /** Selected player info */
  player?: PlayerInfo
  /** Callback function for frame click */
  onClick?: (player?: PlayerInfo) => void
  /** Default title for the image */
  defaultTitle?: string
  /** Default description for the image */
  defaultDescription?: string
  /** If true, player's name will be used as description */
  isUsingOnlyDescription?: boolean
}
