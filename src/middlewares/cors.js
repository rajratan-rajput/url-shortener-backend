import cors from "cors";

const DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

const ALLOWED_HEADERS = ["Content-Type", "Authorization"];

export function applyCors(app) {
  const configuredOrigins = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origin =
    configuredOrigins?.length > 0
      ? configuredOrigins
      : process.env.NODE_ENV === "production"
        ? false
        : DEV_ORIGINS;

  app.use(
    cors({
      origin,
      methods: ALLOWED_METHODS,
      allowedHeaders: ALLOWED_HEADERS,
      exposedHeaders: ["Content-Type"],
      optionsSuccessStatus: 204,
      preflightContinue: false,
    })
  );
}
