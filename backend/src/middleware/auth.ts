import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
import { tokenUtils } from "../utils/token.js";

export const authenticate = (request: Request, _response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Token de autenticação ausente"));
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = tokenUtils.verify(token);
    request.user = {
      id: payload.sub,
      role: payload.role,
      name: payload.name,
    };
    return next();
  } catch (error) {
    return next(ApiError.unauthorized("Token inválido ou expirado"));
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(request.user.role)) {
      return next(ApiError.forbidden("Permissão insuficiente"));
    }

    return next();
  };
};
