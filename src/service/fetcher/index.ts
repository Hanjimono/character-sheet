import { ApiResponse } from "@/constants/types/api"
import { useStore } from "@/store"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { doFetching } from "./fethingAction"

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
 * Custom React hook that provides helper functions and state for handling form data submissions.
 *
 * @returns A tuple containing:
 *   - errorSnack: Function to display an error message.
 *   - successSnack: Function to display a success message.
 *   - loading: Boolean indicating if a form submission is in progress.
 *   - setLoading: Function to set the loading state.
 */
export function usePostFormDataHelpers(): [
  (message: string) => void,
  (message: string) => void,
  boolean,
  Dispatch<SetStateAction<boolean>>
] {
  const errorSnack = useStore((state) => state.errorSnack)
  const successSnack = useStore((state) => state.successSnack)
  const [loading, setLoading] = useState(false)
  return [errorSnack, successSnack, loading, setLoading]
}

/**
 * Sends a POST request with form data to the specified API endpoint.
 *
 * @param api - The API endpoint to send the request to.
 * @param query - An object containing query parameters to include in the request.
 * @param formData - An object containing form data to be sent in the request body.
 * @param characterId - Optional character ID to include in the request.
 * @param successMessageFunction - Optional callback to display a success message.
 * @param errorMessageFunction - Optional callback to display an error message.
 * @param loadingFunction - Optional callback to indicate loading state.
 * @param successMessage - Optional success message to display upon successful request.
 * @returns A promise that resolves to `true` if the request was successful, or `false` otherwise.
 */
export async function postFormData(
  api: string,
  query: Record<string, any> = {},
  formData: Record<string, any> = {},
  characterId: number | null = null,
  successMessageFunction?: (message: string) => void,
  errorMessageFunction?: (message: string) => void,
  loadingFunction?: (loading: boolean) => void,
  successMessage?: string
): Promise<boolean> {
  if (loadingFunction) {
    loadingFunction(true)
  }
  try {
    const response = await doFetching(api, query, characterId, "POST", formData)
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
    if (loadingFunction) {
      loadingFunction(false)
    }
    if (successMessage && successMessageFunction) {
      successMessageFunction(successMessage)
    }
    return responseResult.success
  } catch (error) {
    if (loadingFunction) {
      loadingFunction(false)
    }
    if (errorMessageFunction) {
      if (error instanceof Error) {
        errorMessageFunction(error.message)
      } else {
        errorMessageFunction("An unknown error occurred")
      }
    }
  }
  return false
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
  const [errorSnack, successSnack, loading, setLoading] =
    usePostFormDataHelpers()
  const postData = useCallback(async () => {
    return postFormData(
      api,
      query,
      body,
      characterId,
      successSnack,
      errorSnack,
      setLoading,
      successMessage
    )
  }, [
    api,
    errorSnack,
    characterId,
    body,
    query,
    successMessage,
    successSnack,
    setLoading
  ])
  return [postData, loading]
}
