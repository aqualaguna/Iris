import { HttpsError } from "firebase-functions/lib/providers/https";
import ajv from "./ajv";

export default function simpleAuth(data: any, context: any, schema: any) {
  // check for user
  if (!context.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
  // validate structure
  const validateFunc = ajv.compile(schema);
  const valid = validateFunc(data);
  if (!valid) {
    throw new HttpsError(
      "failed-precondition",
      "your provided data is invalid",
      validateFunc.errors
    );
  }
}
