// Lib
import { trpc } from "./client"
import { useCharacterId } from "./characterIdContext"
import { useEffect } from "react"

/**
 * Hook to set characterId in context before making tRPC calls.
 * Use this in components that receive characterId as a prop.
 *
 * @param characterId - The character ID to set
 */
export function useSetCharacterId(characterId: number | null | undefined) {
  const { setCharacterId } = useCharacterId()

  useEffect(() => {
    if (characterId !== undefined) {
      setCharacterId(characterId)
      // Also store in localStorage for the fetch function fallback
      if (characterId !== null) {
        localStorage.setItem("characterId", characterId.toString())
      } else {
        localStorage.removeItem("characterId")
      }
    }
  }, [characterId, setCharacterId])
}

/**
 * Wrapper hook for tRPC queries that ensures characterId is set.
 * Use this instead of direct trpc.*.useQuery when you have characterId as a prop.
 */
export function useTRPCQuery<T extends keyof typeof trpc>(
  router: T,
  procedure: string,
  input?: any,
  options?: any
) {
  // This is a helper - components should use trpc.*.useQuery directly
  // and call useSetCharacterId before using the query
  return trpc[router as keyof typeof trpc][procedure as never].useQuery(
    input,
    options
  )
}
