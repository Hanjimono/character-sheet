import { PlayerInfo } from "./types/players"

export const PLAYERS: Record<string, PlayerInfo> = {
  DM: {
    id: 1,
    name: "Dungeon Master"
  },
  LIGHANE: {
    id: 2,
    name: "Lighane"
  },
  REKSAI: {
    id: 3,
    name: "Rek'Sai"
  },
  SARTAEL: {
    id: 4,
    name: "Sar'Tael",
    isMe: true
  },
  SELYNAN: {
    id: 5,
    name: "Selynan"
  },
  VISH: {
    id: 6,
    name: "Vish"
  }
}
