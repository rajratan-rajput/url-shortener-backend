# Updated Folder Structure

```
url-shortener/
├── docs/
│   ├── API.md
│   ├── DATABASE_SCHEMA.md
│   ├── FOLDER_STRUCTURE.md
│   └── IMPLEMENTATION_PLAN.md
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/                 # Axios API clients
│   │   ├── components/          # Layout, Navbar, ProtectedRoute
│   │   ├── context/             # AuthContext (JWT)
│   │   └── pages/               # Home, Login, Register, Dashboard, etc.
│   └── vite.config.js
├── public/
│   └── qr/                      # Generated QR PNG files
├── src/
│   ├── config/                  # db, redis, swagger, env
│   ├── controllers/             # auth, url, analytics, dashboard, health
│   ├── docs/
│   │   └── openapi.js           # Swagger / OpenAPI 3 spec
│   ├── middlewares/             # auth, cors, helmet, rate limit, errors
│   ├── models/                  # User, Url, ClickEvent
│   ├── routes/                  # auth, api url, analytics, dashboard, public
│   ├── services/                # auth, url, qr, analytics, dashboard
│   └── utils/                   # validation, logger, click metadata
├── tests/
│   └── auth.integration.test.js
├── docker-compose.yml
├── docker-compose.dev.yml
├── Dockerfile
└── DEPLOYMENT.md
```
