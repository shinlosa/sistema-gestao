import cors, { CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import { environment } from "./config/environment.js";
import { errorHandler, notFoundHandler, requestLogger } from "./middleware/index.js";
import { appRouter } from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(requestLogger);
const allowedOrigins = new Set<string>();

for (const entry of environment.corsOrigins) {
  const trimmed = entry.trim();
  if (!trimmed) continue;
  allowedOrigins.add(trimmed);

  try {
    const url = new URL(trimmed);
    const { protocol, port, hostname } = url;
    if (hostname === "localhost" && port) {
      allowedOrigins.add(`${protocol}//127.0.0.1:${port}`);
    }
  } catch {
    // ignore invalid origins; they will be skipped
  }
}

const allowAllOrigins = allowedOrigins.has("*");
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: string | boolean) => void) => {
    if (allowAllOrigins || !origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, origin);
    }

    try {
      const url = new URL(origin);
      const normalized = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
      if (allowedOrigins.has(normalized)) {
        return callback(null, origin);
      }
    } catch {
      // ignore parse errors and fall through to rejection
    }

    if (environment.nodeEnv === "development" && origin.startsWith("http://localhost:")) {
      return callback(null, origin);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", appRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
