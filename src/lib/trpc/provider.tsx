"use client"
// System
import { useState, useMemo, useRef } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import superjson from "superjson"
// Lib
import { trpc } from "./client"
import { CharacterIdProvider, useCharacterId } from "./characterIdContext"

/**
 * tRPC Provider component that wraps the application with tRPC and React Query.
 * Provides tRPC client configuration and React Query setup.
 *
 * @param {React.ReactNode} children - The child components to wrap
 */
function TRPCProviderInner({ children }: { children: React.ReactNode }) {
  const { characterId } = useCharacterId()
  const characterIdRef = useRef(characterId)
  characterIdRef.current = characterId

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000
          }
        }
      })
  )

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: "/api/trpc",
            transformer: superjson,
            headers: () => {
              return {}
            },
            fetch: async (url, options) => {
              // Get characterId from context or fallback sources
              const currentCharacterId =
                characterIdRef.current ?? getCharacterIdFromStorage()
              const urlWithCharacter = currentCharacterId
                ? `${url}${url.includes("?") ? "&" : "?"}character=${currentCharacterId}`
                : url
              return fetch(urlWithCharacter, options)
            }
          })
        ]
      }),
    []
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

/**
 * tRPC Provider with characterId context
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return (
    <CharacterIdProvider>
      <TRPCProviderInner>{children}</TRPCProviderInner>
    </CharacterIdProvider>
  )
}

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
