import { NextFunction, Request, Response } from "express";
import { performance } from "node:perf_hooks";

export const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  const start = performance.now();

  response.on("finish", () => {
    const duration = performance.now() - start;
    const logMessage = `${request.method} ${request.originalUrl} ${response.statusCode} - ${duration.toFixed(2)}ms`;

    if (response.statusCode >= 500) {
      console.error(logMessage);
      return;
    }

    if (response.statusCode >= 400) {
      console.warn(logMessage);
      return;
    }

    console.info(logMessage);
  });

  next();
};
