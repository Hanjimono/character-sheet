import { ApiResponse } from "@/constants/types/api"
import { useStore } from "@/store"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"

/**
 * Performs an HTTP request to the specified API endpoint with optional query parameters,
 * request body, and HTTP method.
 *
 * @param api - The base URL of the API endpoint to fetch.
 * @param params - An optional object containing query parameters to append to the URL.
 * @param characterId - An optional character ID to include as a query parameter.
 * @param method - The HTTP method to use for the request. Defaults to "GET".
 * @param body - An optional object containing the request body for "POST" requests.
 * @returns A promise that resolves to the `Response` object from the fetch call.
 */
export async function doFetching(
  api: string,
  params: Record<string, any> | null = null,
  characterId: number | null = null,
  method: "GET" | "POST" = "GET",
  body: Record<string, any> = {}
): Promise<Response> {
  let apiWithQuery = api
  if (params || characterId) {
    const formattedParams = new URLSearchParams(params || {})
    if (characterId) {
      if (formattedParams.has("character")) {
        formattedParams.set("character", characterId.toString())
      } else {
        formattedParams.append("character", characterId.toString())
      }
    }
    apiWithQuery = api + "?" + formattedParams.toString()
  }
  const response = await fetch(apiWithQuery, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: method === "POST" ? JSON.stringify(body) : undefined
  })
  return response
}

/**
 * A custom hook for fetching data from an API endpoint. It handles loading state, error handling, and response validation.
 * If an error occurs, it displays an error message using the `errorSnack` function from the store.
 *
 * @template ResponseDataType - The expected type of the response data.
 * @param {string} api - The API endpoint to fetch data from.
 * @param {Record<string, any>} [params={}] - An optional object containing query parameters to include in the request.
 * @param characterId - An optional character ID to include in the request. Defaults to `null`.
 * @param {"GET" | "POST"} [method="GET"] - The HTTP method to use for the request. Defaults to "GET".
 * @returns {[() => Promise<ResponseDataType | null>, boolean]} - A tuple containing:
 *   - A function to trigger the API call, which returns a promise resolving to the response data or `null` in case of an error.
 *   - A boolean indicating the loading state of the request.-
 */
export function useFetchData<ResponseDataType>(
  api: string,
  params: Record<string, any> | null = null,
  characterId: number | null = null,
  method: "GET" | "POST" = "GET"
): [() => Promise<ResponseDataType | null>, boolean] {
  const [loading, setLoading] = useState(false)
  const errorSnack = useStore((state) => state.errorSnack)
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await doFetching(api, params, characterId, method)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const responseResult: ApiResponse<ResponseDataType> =
        await response.json()
      if (!responseResult.success) {
        if (responseResult.details) {
          console.error(responseResult.details)
        }
        throw new Error(responseResult.error || "An unknown error occurred")
      }
      setLoading(false)
      return responseResult.data || null
    } catch (error) {
      setLoading(false)
      if (error instanceof Error) {
        errorSnack(error.message)
      } else {
        errorSnack("An unknown error occurred")
      }
    }
    return null
  }, [api, errorSnack, method, characterId, params])
  return [fetchData, loading]
}

/**
 * A custom hook that fetches data from an API and stores it in an uncontrolled state.
 * It also provides a loading state and a function to manually trigger the fetch operation.
 *
 * @template ResponseDataType - The type of the response data expected from the API.
 * @param api - The API endpoint to fetch data from.
 * @param setData - A state setter function to store the fetched data.
 * @param {Record<string, any>} [params={}] - An optional object containing query parameters to include in the request.
 * @param characterId - An optional character ID to include in the request. Defaults to `null`.
 * @param method - The HTTP method to use for the request. Defaults to "GET".
 * @returns A tuple containing:
 *   - `loading`: A boolean indicating whether the fetch operation is in progress.
 *   - `fetchData`: A function to manually trigger the fetch operation, returning the fetched data or `null`.
 */
export function useFetchAndUncontrolledStoreData<ResponseDataType>(
  api: string,
  setData: Dispatch<SetStateAction<ResponseDataType | null>>,
  params: Record<string, any> | null = null,
  characterId: number | null = null,
  method: "GET" | "POST" = "GET"
): [boolean, () => Promise<ResponseDataType | null>] {
  const [fetchData, loading] = useFetchData<ResponseDataType>(
    api,
    params,
    characterId,
    method
  )
  const fetchAndStoreData = useCallback(async () => {
    const result = await fetchData()
    setData(result)
    return result
  }, [fetchData, setData])
  useEffect(() => {
    fetchAndStoreData()
  }, [fetchAndStoreData])
  return [loading, fetchAndStoreData]
}

/**
 * A custom hook that fetches data from an API and stores it in the component's state.
 * It provides the fetched data, a loading state, and a function to manually trigger the fetch.
 *
 * @template ResponseDataType - The expected type of the response data.
 * @param api - The API endpoint to fetch data from.
 * @param {Record<string, any>} [params={}] - An optional object containing query parameters to include in the request.
 * @param characterId - An optional character ID to include in the request. Defaults to `null`.
 * @param method - The HTTP method to use for the request. Defaults to "GET".
 * @returns A tuple containing:
 * - `data`: The fetched data or `null` if not yet available.
 * - `loading`: A boolean indicating whether the data is currently being fetched.
 * - `fetchData`: A function to manually trigger the fetch operation.
 */
export function useFetchAndStoreData<ResponseDataType>(
  api: string,
  params: Record<string, any> | null = null,
  characterId: number | null = null,
  method: "GET" | "POST" = "GET"
): [ResponseDataType | null, boolean, () => Promise<ResponseDataType | null>] {
  const [data, setData] = useState<ResponseDataType | null>(null)
  const [loading, fetchData] =
    useFetchAndUncontrolledStoreData<ResponseDataType>(
      api,
      setData,
      params,
      characterId,
      method
    )
  return [data, loading, fetchData]
}

/**
 * A custom hook for making POST requests to a specified API endpoint.
 *
 * @param api - The API endpoint to send the POST request to.
 * @param query - An optional object containing query parameters to include in the request.
 * @param characterId - An optional character ID to include in the request, defaults to `null`.
 * @param body - An optional object containing the body of the POST request.
 * @param successMessage - An optional success message to display upon successful request.
 * @returns A tuple containing:
 *   - A function to trigger the POST request.
 *   - A boolean indicating whether the request is currently loading.
 */
export function usePostData(
  api: string,
  query: Record<string, any> = {},
  characterId: number | null = null,
  body: Record<string, any> = {},
  successMessage?: string
): [() => Promise<boolean>, boolean] {
  const [loading, setLoading] = useState(false)
  const errorSnack = useStore((state) => state.errorSnack)
  const successSnack = useStore((state) => state.successSnack)
  const postData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await doFetching(api, query, characterId, "POST", body)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const responseResult: ApiResponse<any> = await response.json()
      if (!responseResult.success) {
        if (responseResult.details) {
          console.error(responseResult.details)
        }
        throw new Error(responseResult.error || "An unknown error occurred")
      }
      setLoading(false)
      if (successMessage) {
        successSnack(successMessage)
      }
      return responseResult.success
    } catch (error) {
      setLoading(false)
      if (error instanceof Error) {
        errorSnack(error.message)
      } else {
        errorSnack("An unknown error occurred")
      }
    }
    return false
  }, [api, errorSnack, characterId, body, query, successMessage, successSnack])
  return [postData, loading]
}
