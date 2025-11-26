import dotenv from "dotenv";
import ms, { type StringValue } from "ms";

dotenv.config();

const DEFAULT_JWT_EXPIRATION_SECONDS = 60 * 60; // 1 hora

const parseJwtExpiration = (rawValue: string | undefined): number => {
  if (!rawValue) {
    return DEFAULT_JWT_EXPIRATION_SECONDS;
  }

  const numericValue = Number(rawValue);
  if (!Number.isNaN(numericValue) && numericValue > 0) {
    return Math.floor(numericValue);
  }

  const parsedMs = ms(rawValue as StringValue);
  if (typeof parsedMs === "number" && parsedMs > 0) {
    return Math.floor(parsedMs / 1000);
  }

  return DEFAULT_JWT_EXPIRATION_SECONDS;
};

export const environment = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3333),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:3000").split(","),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
  jwtExpiresInSeconds: parseJwtExpiration(process.env.JWT_EXPIRES_IN),
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_DATABASE ?? "nami_gestao",
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  },
};
