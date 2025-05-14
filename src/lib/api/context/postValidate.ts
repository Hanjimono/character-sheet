import { BaseApiContext } from "@/constants/types/api"
import * as yup from "yup"

/**
 * Wraps an API handler with JSON body parsing and validation using a Yup schema.
 *
 * @template PostData - The expected shape of the POST data.
 * @template ApiContextData - The type of the API context, extending BaseApiContext.
 * @template ResponseData - The type of the response returned by the handler.
 *
 * @param ctx - The API context containing the request object.
 * @param validationSchema - A Yup schema used to validate the incoming POST data.
 * @param handler - An async function that processes the validated data and returns a response.
 *
 * @returns A promise resolving to the handler's response.
 *
 * @throws {Error} If validation fails, throws an error with the validation message or a generic error.
 */
export async function withPostValidateContext<
  PostData,
  ApiContextData extends BaseApiContext,
  ResponseData
>(
  ctx: ApiContextData,
  validationSchema: yup.Schema<PostData>,
  handler: (ctx: ApiContextData, data: PostData) => Promise<ResponseData>
) {
  const data = await ctx.req.json()
  try {
    await validationSchema.validate(data)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message)
    }
    throw new Error("Invalid data")
  }
  return handler(ctx, data)
}
