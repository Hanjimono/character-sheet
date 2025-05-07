import { ApiResponse } from "@/constants/types/api"

/** The typical response for a successful API request */
export function success<T>(data: T, init?: ResponseInit) {
  const responseData: ApiResponse<T> = {
    success: true,
    data
  }
  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init
  })
}

/** The typical response for a failed API request */
export function error(
  message: string,
  details?: string,
  status: number = 500,
  init?: ResponseInit
) {
  const responseData: ApiResponse<null> = {
    success: false,
    error: message,
    details: details || undefined
  }
  return new Response(JSON.stringify(responseData), {
    status,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init
  })
}
