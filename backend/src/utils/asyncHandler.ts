import { NextFunction, Request, Response } from "express";

type AsyncHandler = (request: Request, response: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (handler: AsyncHandler) => {
  return (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
};
