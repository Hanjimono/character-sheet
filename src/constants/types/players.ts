/** Interface for player information */
export interface PlayerInfo {
  id: number
  /** Player's character full name */
  name: string
  /** Player's character short name */
  shortname?: string
  /** Is it a my character */
  isMe?: boolean
  /** Is it a DM character */
  isDM?: boolean
  /** Image URL */
  image?: string
}
