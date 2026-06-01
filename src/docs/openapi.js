const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "LinkSnap URL Shortener API",
    version: "2.0.0",
    description:
      "JWT-authenticated URL shortener with QR codes, click analytics, and user dashboard.",
  },
  servers: [{ url: "http://localhost:5000", description: "Local" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
      CreateUrlResponse: {
        type: "object",
        properties: {
          id: { type: "string" },
          shortUrl: { type: "string" },
          shortCode: { type: "string" },
          qrCode: { type: "string" },
          longUrl: { type: "string" },
          clicks: { type: "integer" },
          expiresAt: { type: "string", format: "date-time", nullable: true },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout (revoke token)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get profile",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/url/create": {
      post: {
        tags: ["URLs"],
        summary: "Create short URL",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                  customAlias: { type: "string" },
                  expiresAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUrlResponse" },
              },
            },
          },
        },
      },
    },
    "/api/url/my-urls": {
      get: {
        tags: ["URLs"],
        summary: "List my URLs",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/url/{id}": {
      delete: {
        tags: ["URLs"],
        summary: "Delete URL",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/api/analytics/{shortCode}": {
      get: {
        tags: ["Analytics"],
        summary: "URL analytics",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "shortCode",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "Dashboard statistics",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/{shortCode}": {
      get: {
        tags: ["Public"],
        summary: "Redirect to long URL",
        parameters: [
          {
            name: "shortCode",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          302: { description: "Redirect" },
          404: { description: "Not found" },
          410: { description: "Expired" },
        },
      },
    },
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: { 200: { description: "Healthy" } },
      },
    },
  },
};

export default openApiSpec;
