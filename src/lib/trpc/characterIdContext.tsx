"use client"
// System
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react"

const CharacterIdContext = createContext<{
  characterId: number | null
  setCharacterId: (id: number | null) => void
}>({
  characterId: null,
  setCharacterId: () => {}
})

/**
 * Helper function to get characterId from cookies or localStorage.
 */
function getCharacterIdFromStorage(): number | null {
  if (typeof window === "undefined") {
    return null
  }

  // Try to get from cookies
  const cookies = document.cookie.split(";")
  const characterCookie = cookies.find((c) => c.trim().startsWith("character="))
  if (characterCookie) {
    const value = characterCookie.split("=")[1]
    const id = Number(value)
    if (!isNaN(id)) {
      return id
    }
  }

  // Try localStorage as fallback
  const stored = localStorage.getItem("characterId")
  if (stored) {
    const id = Number(stored)
    if (!isNaN(id)) {
      return id
    }
  }

  return null
}

/**
 * Provider for characterId context
 */
export function CharacterIdProvider({
  children,
  initialCharacterId
}: {
  children: ReactNode
  initialCharacterId?: number | null
}) {
  const [characterId, setCharacterId] = useState<number | null>(() => {
    if (initialCharacterId !== undefined) {
      return initialCharacterId
    }
    return getCharacterIdFromStorage()
  })

  // Sync with storage on mount
  useEffect(() => {
    const storedId = getCharacterIdFromStorage()
    if (storedId !== null && storedId !== characterId) {
      setCharacterId(storedId)
    }
  }, [])

  return (
    <CharacterIdContext.Provider value={{ characterId, setCharacterId }}>
      {children}
    </CharacterIdContext.Provider>
  )
}

/**
 * Hook to get and set characterId
 */
export function useCharacterId() {
  return useContext(CharacterIdContext)
}
