"use client"
// System
import { useCallback, useEffect, useState } from "react"
// Components
import DiceBalance from "@/components/Layout/DicaBalance"
// Ui
import Room from "@/ui/Layout/Room"
import Button from "@/ui/Actions/Button"
// Styles and types
import { GameViewProps } from "./types"

function GameView({ campaignId, characterId }: GameViewProps) {
  const [game, setGame] = useState<number | null>(null)
  const [startDate, setStartDate] = useState<Date | null>()
  const [endDate, setEndDate] = useState<Date | null>()
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
  const handleStartNewGame = async () => {
    const response = await fetch("/api/game/start?character=" + characterId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    if (data && data.game) {
      setGame(data.game.id)
      setStartDate(new Date(data.game.date))
      startTimer()
    }
  }
  const handleEndGame = async () => {
    const response = await fetch("/api/game/end?character=" + characterId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    setGame(null)
    setStartDate(null)
  }
  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(
        "/api/game/active?character=" + characterId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      const data = await response.json()
      if (data && data.game) {
        setGame(data.game.id)
        setStartDate(new Date(data.game.date))
        startTimer()
      }
    }
    fetchGame()
  }, [characterId, setGame, setStartDate, startTimer])
  const timeDifference =
    endDate && startDate ? endDate.getTime() - startDate.getTime() : 0
  const seconds = Math.floor((timeDifference / 1000) % 60)
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
  return (
    <>
      <Room className="w-full">
        {!game && <Button onClick={handleStartNewGame}>Start new game</Button>}
        {!!game && (
          <div className="min-w-full h-12 bg-block-800 rounded-lg">
            <div className="flex justify-between items-center h-full px-4">
              <span className="text-gray-400">Game playing:</span>
              <span className="text-gray-200">
                {hours > 10 ? hours : "0" + hours}:
                {minutes > 10 ? minutes : "0" + minutes}:
                {seconds > 10 ? seconds : "0" + seconds}
              </span>
              <Button onClick={handleEndGame}>End game</Button>
            </div>
          </div>
        )}
      </Room>
      <Room>
        <DiceBalance
          campaignId={campaignId}
          gameId={game || undefined}
          characterId={characterId}
        />
      </Room>
    </>
  )
}
export default GameView
