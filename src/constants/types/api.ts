import { Campaign } from "@/database/models/campaign"
import { Game } from "@/database/models/game"
import { Player } from "@/database/models/player"

/** A generic API response type */
export interface ApiResponse<T> {
  /** Indicates if the request was successful or not */
  success: boolean
  /** The data returned from the API, if any */
  data?: T
  /** An error message, if the request was not successful */
  error?: string
  /** Additional details about the error, if any */
  details?: string
}

/**  A wrapper interface for API handlers that provides the active campaign context. */
export interface ApiCampaignContext {
  /** The request object */
  req: Request
  /** The ID of the character associated with the request */
  characterId: number
  /** The active game for the character, if any */
  campaign: Campaign | null
}

/**  A base interface for API handlers that provides the request object. */
export interface BaseApiContext {
  /** The request object */
  req: Request
}

/**  A wrapper interface for API handlers that provides the active game context. */
export interface ApiGameContext extends BaseApiContext {
  /** The ID of the character associated with the request */
  characterId: number
  /** The active campaign for the character, if any */
  campaign: Campaign | null
  /** The active game for the campaign, if any */
  game: Game | null
  /** The players associated with the character */
  players: Player[]
}
