import { error, success } from "./response"

/**
 * A basic API handler function that takes a request and a standardized response.
 * It also handles errors and returns a standardized error response.
 */
export function apiHandler<ResponseDataType>(
  handler: (req: Request) => Promise<ResponseDataType>
) {
  return async function (req: Request) {
    try {
      return success<ResponseDataType>(await handler(req))
    } catch (e) {
      if (e instanceof Error) {
        return error(e.message, e.stack)
      }
      return error("Internal server error")
    }
  }
}
