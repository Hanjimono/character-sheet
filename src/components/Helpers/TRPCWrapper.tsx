"use client"
// System
import { TRPCProvider } from "@/lib/trpc/provider"

/**
 * Client-side wrapper for tRPC provider.
 * This component must be a client component to use React hooks.
 */
export default function TRPCWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return <TRPCProvider>{children}</TRPCProvider>
}
