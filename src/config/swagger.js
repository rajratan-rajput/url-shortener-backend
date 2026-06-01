import swaggerUi from "swagger-ui-express";
import openApiSpec from "../docs/openapi.js";

export function setupSwagger(app) {
  app.get("/api-docs.json", (req, res) => {
    res.json(openApiSpec);
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: "URL Shortener API Docs",
    })
  );
}
