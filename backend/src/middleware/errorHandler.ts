import { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/apiError.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const isKnownError = error instanceof ApiError;
  const status = isKnownError ? error.status : 500;

  const fallbackMessage = "Erro inesperado";
  let message = fallbackMessage;

  if (isKnownError) {
    message = error.message;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    const candidate = (error as { message?: unknown }).message;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      message = candidate;
    }
  }

  if (!isKnownError) {
    console.error("Unhandled error:", error);
  }

  response.status(status).json({
    message,
    ...(isKnownError && error.details ? { details: error.details } : {}),
  });
};
