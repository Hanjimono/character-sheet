import { CoinsInfo } from "./types/money"

export const COINS: CoinsInfo = {
  gold: {
    type: "gold",
    inCopper: 100,
    abbreviation: "gp",
    name: "gold"
  },
  silver: {
    type: "silver",
    inCopper: 10,
    abbreviation: "sp",
    name: "silver"
  },
  copper: {
    type: "copper",
    inCopper: 1,
    abbreviation: "cp",
    name: "copper"
  },
  platinum: {
    type: "platinum",
    inCopper: 1000,
    abbreviation: "pp",
    name: "platinum"
  },
  electrum: {
    type: "electrum",
    inCopper: 50,
    abbreviation: "ep",
    name: "electrum"
  }
}
