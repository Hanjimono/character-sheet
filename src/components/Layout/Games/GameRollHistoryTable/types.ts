export interface GameRollRecord {
  id: number
  player: {
    id: number
    name: string
    image?: string | null
    shortname?: string | null
    isMe?: boolean
    isDM?: boolean
  } | null
  isNegative: boolean
  createdAt: string
}

export interface GameRollHistoryTableProps {
  /** Additional class names. */
  className?: string
  /** Array of roll records to display. */
  rolls: GameRollRecord[]
  /** Callback to refresh data after deletion. */
  onDelete?: () => void
}
