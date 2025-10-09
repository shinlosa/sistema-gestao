import dotenv from "dotenv";

dotenv.config();

export const environment = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3333),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:3000").split(","),
};
