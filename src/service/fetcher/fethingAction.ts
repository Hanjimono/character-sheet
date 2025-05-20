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
