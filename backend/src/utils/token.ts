import jwt from "jsonwebtoken";
import { environment } from "../config/environment.js";

export interface AccessTokenPayload {
  sub: string;
  role: string;
  name: string;
}

type JwtSign = (payload: object, secret: string, options?: Record<string, unknown>) => string;
type JwtVerify = (token: string, secret: string) => unknown;

interface JwtModule {
  sign: JwtSign;
  verify: JwtVerify;
}

const isJwtModule = (value: unknown): value is JwtModule => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<PropertyKey, unknown>;
  return typeof record.sign === "function" && typeof record.verify === "function";
};

const resolveJwtModule = (): JwtModule => {
  const base: unknown = jwt;

  if (typeof base === "object" && base !== null && "default" in base) {
    const candidate = (base as Record<PropertyKey, unknown>).default;
    if (isJwtModule(candidate)) {
      return candidate;
    }
  }

  if (isJwtModule(base)) {
    return base;
  }

  throw new Error("JWT module not loaded correctly");
};

const jwtModule = resolveJwtModule();

const sign = (payload: AccessTokenPayload): string => {
  return jwtModule.sign(payload, environment.jwtSecret, {
    expiresIn: environment.jwtExpiresInSeconds,
  });
};

const verify = (token: string): AccessTokenPayload => {
  const decoded = jwtModule.verify(token, environment.jwtSecret);
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Token payload inválido");
  }
  const { sub, role, name } = decoded as Record<string, unknown>;

  if (typeof sub !== "string" || typeof role !== "string" || typeof name !== "string") {
    throw new Error("Token payload inválido");
  }

  return { sub, role, name };
};

export const tokenUtils = {
  sign,
  verify,
};
