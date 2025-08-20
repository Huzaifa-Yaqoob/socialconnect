import { Error } from "mongoose";

function handleMongooseValidationError(error: any): Record<string, string> | null {
  const formattedErrors: Record<string, string> = {};
  if (error instanceof Error.ValidationError) {
    for (const [field, err] of Object.entries(error.errors)) {
      formattedErrors[field] = err.message;
    }

    return formattedErrors;
  }

  if (error.code === 11000 && error.keyValue) {
    for (const [field, value] of Object.entries(error.keyValue)) {
      formattedErrors[field] = `This ${field} is already taken. Please choose another one.`;
    }
    return formattedErrors;
  }

  return null;
}

export default handleMongooseValidationError;
