import helmet from "helmet";

export function applySecurityMiddleware(app) {
  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
}
