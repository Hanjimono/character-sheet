export interface GameMoneyRecord {
  id: number
  fromPlayer: {
    id: number
    name: string
    image?: string | null
    shortname?: string | null
    isMe?: boolean
    isDM?: boolean
  } | null
  toPlayer: {
    id: number
    name: string
    image?: string | null
    shortname?: string | null
    isMe?: boolean
    isDM?: boolean
  } | null
  amount: number
  isNegative: boolean
  isTransfer: boolean
  comment: string | null
  createdAt: string
}

export interface GameMoneyHistoryTableProps {
  /** Additional class names. */
  className?: string
  /** Array of money transaction records to display. */
  transactions: GameMoneyRecord[]
}
