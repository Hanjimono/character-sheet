export interface GameDamageRecord {
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
  isSummon: boolean
  comment: string | null
  createdAt: string
}

export interface GameDamageHistoryTableProps {
  /** Additional class names. */
  className?: string
  /** Array of damage records to display. */
  damages: GameDamageRecord[]
}
