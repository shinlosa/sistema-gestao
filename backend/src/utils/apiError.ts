export type ApiErrorOptions = {
  status?: number;
  cause?: unknown;
  details?: Record<string, unknown> | undefined;
};

/**
 * Lightweight HTTP-friendly error for controller/service layers.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly details: Record<string, unknown> | undefined;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 500;
    this.details = options.details;

    if (options.cause) {
      // Preserve original stack when available
      this.cause = options.cause;
    }
  }

  static badRequest(message: string, details?: Record<string, unknown>) {
    return new ApiError(message, { status: 400, details });
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, { status: 401 });
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, { status: 403 });
  }

  static notFound(message = "Resource not found") {
    return new ApiError(message, { status: 404 });
  }

  static conflict(message = "Conflict", details?: Record<string, unknown>) {
    return new ApiError(message, { status: 409, details });
  }

  static internal(message = "Internal server error", cause?: unknown) {
    return new ApiError(message, { status: 500, cause });
  }
}
