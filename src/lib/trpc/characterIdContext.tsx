"use client"
// System
import { createContext, useContext, useState, ReactNode } from "react"

const CharacterIdContext = createContext<{
  characterId: number | null
  setCharacterId: (id: number | null) => void
}>({
  characterId: null,
  setCharacterId: () => {}
})

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
  const [characterId, setCharacterId] = useState<number | null>(
    initialCharacterId || null
  )

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
