export interface GameHealRecord {
  id: number
  player: {
    id: number
    name: string
    image?: string | null
    shortname?: string | null
    isMe?: boolean
    isDM?: boolean
  } | null
  count: number
  isNegative: boolean
  comment: string | null
  createdAt: string
}

export interface GameHealHistoryTableProps {
  /** Additional class names. */
  className?: string
  /** Array of heal records to display. */
  heals: GameHealRecord[]
  /** Callback to refresh data after deletion. */
  onDelete?: () => void
}
