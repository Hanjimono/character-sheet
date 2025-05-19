"use client"
// System
import { useCallback, useEffect, useMemo, useState } from "react"
// Components
import DiceBalance from "@/components/Layout/DicaBalance"
import MoneyBalance from "@/components/Layout/MoneyBalance"
import DamageBalance from "@/components/Layout/DamageBalance"
// Ui
import Room from "@/ui/Layout/Room"
import Button from "@/ui/Actions/Button"
// Services
import { useFetchAndStoreData, usePostData } from "@/service/fetcher"
// Styles and types
import { GameViewProps } from "./types"
import { GameInfo } from "@/constants/types/game"

// apies
const GET_ACTIVE_GAME_API = "/api/game/active"
const START_NEW_GAME_API = "/api/game/start"
const END_GAME_API = "/api/game/end"

/**
 * The `GameView` component is responsible for managing and displaying the state of a game
 * within a campaign. It provides functionality to start and end a game, as well as displays
 * various balances (dice, money, damage) related to the game and character.
 *
 * @param {string} props.campaignId - The ID of the campaign associated with the game.
 * @param {string} props.characterId - The ID of the character participating in the game.
 */
function GameView({ campaignId, characterId }: GameViewProps) {
  const [game, loading, fetchGame] = useFetchAndStoreData<GameInfo>(
    GET_ACTIVE_GAME_API,
    undefined,
    characterId
  )
  const [startGame] = usePostData(START_NEW_GAME_API, undefined, characterId)
  const [endGame] = usePostData(END_GAME_API, undefined, characterId)
  const handleStartNewGame = async () => {
    const response = await startGame()
    if (response) {
      await fetchGame()
    }
  }
  const handleEndGame = async () => {
    const response = await endGame()
    if (response) {
      await fetchGame()
    }
  }
  return (
    <>
      <Room className="w-full">
        {!game && <Button onClick={handleStartNewGame}>Start new game</Button>}
        {!!game && (
          <div className="min-w-full h-12 bg-block-700 rounded-lg">
            <div className="flex justify-between items-center h-full px-4">
              <span className="text-gray-400">Game playing:</span>
              <GameTimer game={game} />
              <Button
                className="py-2 px-4"
                onClick={handleEndGame}
                isCustomSize
                isNoPadding
              >
                End game
              </Button>
            </div>
          </div>
        )}
      </Room>
      <Room className="w-full">
        <DiceBalance
          gameId={!!game ? game.id : undefined}
          characterId={characterId}
        />
      </Room>
      <Room className="w-full">
        <MoneyBalance
          campaignId={campaignId}
          gameId={!!game ? game.id : undefined}
          characterId={characterId}
        />
      </Room>
      <Room className="w-full">
        <DamageBalance
          campaignId={campaignId}
          gameId={!!game ? game.id : undefined}
          characterId={characterId}
        />
      </Room>
    </>
  )
}

/**
 * Displays a game timer, calculating the elapsed time
 * between the start date of the game and the current time.
 *
 * @param {GameInfo} props.game - The game information object containing the start date.
 */
function GameTimer({ game }: { game: GameInfo }) {
  const startDate = useMemo(() => {
    if (game) {
      return new Date(game.date)
    }
    return null
  }, [game])
  const [endDate, setEndDate] = useState<Date | null>(null)
  const startTimer = useCallback(() => {
    const timer = setInterval(() => {
      if (!game) {
        clearInterval(timer)
        return
      }
      setEndDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [game])
  useEffect(() => {
    if (game && endDate == null) {
      setEndDate(new Date())
      startTimer()
    }
  }, [game, endDate, startTimer])
  const timeDifference =
    endDate && startDate ? endDate.getTime() - startDate.getTime() : 0
  const seconds = Math.floor((timeDifference / 1000) % 60)
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
  return (
    <span>
      {hours >= 10 ? hours : "0" + hours}:
      {minutes >= 10 ? minutes : "0" + minutes}:
      {seconds >= 10 ? seconds : "0" + seconds}
    </span>
  )
}

export default GameView
